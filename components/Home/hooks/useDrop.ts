import getAllCollections from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { useEffect, useState } from "react";
import { Collection } from "../types/home.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { useDispatch, useSelector } from "react-redux";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { RootState } from "@/redux/store";
import { setCollectionsRedux } from "@/redux/reducers/collectionsSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDropsRedux } from "@/redux/reducers/dropsSlice";

const useDrop = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );

  const handleAllCollections = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const data = await getAllCollections();
      if (!data) {
        setError(true);
        setCollectionsLoading(false);
        return;
      }

      if (
        data?.data?.collectionMinteds?.length < 1 ||
        !data?.data?.collectionMinteds
      ) {
        setCollectionsLoading(false);
        return;
      }
      const drops = await handleAllDrops();
      dispatch(setDropsRedux(drops?.data?.dropCreateds));

      const validCollections = [...data?.data?.collectionMinteds].filter(
        (collection: Collection) => {
          const collectionDrops = [...drops?.data?.dropCreateds]?.filter(
            (drop: any) =>
              drop?.collectionIds?.includes(collection.collectionId)
          );
          return collectionDrops.length > 0;
        }
      );

      const collections = await Promise.all(
        validCollections.map(async (collection: Collection, index: number) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              .replace(/"/g, "")
              .trim()
          );

          let collectionDrops;

          collectionDrops = drops.data.dropCreateds
            ?.filter((drop: any) =>
              drop.collectionIds?.includes(collection.collectionId)
            )
            ?.sort((a: any, b: any) => b.dropId - a.dropId);

          let dropjson;
          if (collectionDrops?.length > 0) {
            dropjson = await fetchIPFSJSON(
              collectionDrops[0]?.dropURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
          }
          const defaultProfile = await getDefaultProfile(collection.owner);

          return {
            ...collection,
            uri: json,
            profile: defaultProfile?.data?.defaultProfile,
            drop: {
              name: dropjson?.name,
              image: dropjson?.image,
            },
          };
        })
      );

      const collectionDrops = drops?.data?.dropCreateds
        ?.filter((drop: any) =>
          drop.collectionIds.includes(collections[0].collectionId)
        )
        .sort((a: any, b: any) => b.dropId - a.dropId);
      const latest = await fetchIPFSJSON(
        collectionDrops[0]?.dropURI
          ?.split("ipfs://")[1]
          .replace(/"/g, "")
          .trim()
      );
      dispatch(
        setMainNFT({
          name: collections[0].name,
          media: collections[0].uri.image.split("ipfs://")[1],
          description: collections[0].uri.description,
          type: collections[0].uri.type,
          drop: {
            name: latest.name,
            image: latest.image,
          },
          creator: {
            media: createProfilePicture(collections[0].profile, false),
            name: collections[0].profile?.handle,
          },
          price: collections[0].basePrices,
          acceptedTokens: collections[0].acceptedTokens,
          amount: collections[0]?.amount,
          tokenIds: collections[0].tokenIds,
          tokensSold: collections[0].soldTokens,
        })
      );
      dispatch(setCollectionsRedux(collections));
      setCollections(collections);
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleAllDrops = async (): Promise<any> => {
    try {
      const data = await getAllDrops();
      return data;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      handleAllCollections();
    }
  }, []);

  return { collections, collectionsLoading, error };
};

export default useDrop;
