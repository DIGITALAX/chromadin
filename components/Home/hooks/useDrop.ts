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
      dispatch(setDropsRedux(data?.data?.dropCreateds));

      const validCollections = data?.data?.collectionMinteds.filter(
        (collection: Collection) => {
          const collectionDrops = drops.filter((drop: any) =>
            drop.collectionIds.includes(collection.collectionId)
          );
          return collectionDrops.length > 0;
        }
      );

      const newValidCollections =
        data?.data?.chromadinCollectionNewCollectionMinteds.filter(
          (collection: Collection) => {
            const collectionDrops = drops.filter((drop: any) =>
              drop.collectionIds.includes(collection.collectionId)
            );
            return collectionDrops.length > 0;
          }
        );

      const collections = await Promise.all(
        [...validCollections, ...newValidCollections].map(
          async (collection: Collection, index: number) => {
            const json = await fetchIPFSJSON(
              (collection.uri as any)
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            const collectionDrops = drops
              .filter((drop: any) =>
                drop.collectionIds.includes(collection.collectionId)
              )
              .sort((a: any, b: any) => b.dropId - a.dropId);
            const dropjson = await fetchIPFSJSON(
              collectionDrops[0]?.dropURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            let defaultProfile;
            defaultProfile = await getDefaultProfile(collection.owner);
            if (!defaultProfile?.data?.defaultProfile) {
              defaultProfile = {
                handle: "syntheticfutures.lens",
                picture: {
                  original: {
                    url: "ipfs://Qmd7PdjsVSfVs6j4uFbxZLsHmzkJw2DYQLxbmgX7aDWkb3",
                  },
                },
              };
            } else {
              defaultProfile = defaultProfile?.data?.defaultProfile;
            }
            return {
              ...collection,
              uri: json,
              profile: defaultProfile,
              drop: {
                name: dropjson?.name,
                image: dropjson?.image,
              },
              contractType: index <= 29 ? "primary" : "secondary",
            };
          }
        )
      );

      const collectionDrops = drops
        .filter((drop: any) =>
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
          contractType: collections[0].contractType,
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
      return [
        ...data.data.dropCreateds,
        ...data.data.chromadinDropNewDropCreateds,
      ];
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
