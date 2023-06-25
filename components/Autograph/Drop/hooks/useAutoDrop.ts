import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsDrop,
  getCollectionsProfile,
} from "@/graphql/subgraph/queries/getAllCollections";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutoDrop } from "@/redux/reducers/autoDropSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAutoDrop = () => {
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const actionCollection = useSelector(
    (state: RootState) => state.app.autoCollectionReducer.collection
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [otherDrops, setOtherDrops] = useState<Collection[]>([]);

  const getDrop = async (autograph: string, drop: string) => {
    setDropLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setDropLoading(false);
        return;
      }

      const dropPromises = allDrops.filter((dropValue: Drop) => {
        if (
          dropValue?.uri?.name?.toLowerCase() ===
            (drop?.replaceAll("-", " ")?.toLowerCase() as string) &&
          dropValue?.creator?.toLowerCase() === prof?.ownedBy?.toLowerCase()
        ) {
          return dropValue;
        }
      });

      const filteredDrops = (await Promise.all(dropPromises)).filter(Boolean);

      let colls: Collection[] = [];

      for (let i = 0; i < filteredDrops[0]?.collectionIds?.length; i++) {
        const col = await getCollectionsDrop(
          filteredDrops[0]?.collectionIds[i]
        );
        colls.push(col?.data?.collectionMinteds[0]);
      }

      const coll = await Promise.all(
        colls.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );

          const collectionDrops = allDrops
            ?.filter((drop: Drop) =>
              drop.collectionIds?.includes(collection.collectionId)
            )
            ?.sort((a: any, b: any) => b.dropId - a.dropId);

          return {
            ...collection,
            uri: json,
            drop: {
              name: collectionDrops[0]?.uri?.name,
              image: collectionDrops[0]?.uri?.image,
              collectionIds: collectionDrops[0]?.collectionIds,
            },
          };
        })
      );

      const allColls = await getCollectionsProfile(prof?.ownedBy);
      const filteredCollsPromises = allColls?.data?.collectionMinteds?.map(
        async (collection: Collection) => {
          if (
            !coll[0]?.drop?.collectionIds?.includes(collection?.collectionId)
          ) {
            return collection;
          }
          return null;
        }
      );

      const filteredColls = (await Promise.all(filteredCollsPromises)).filter(
        Boolean
      );

      const otherDrops = await Promise.all(
        filteredColls?.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );

          return {
            ...collection,
            uri: json,
          };
        })
      );

      setOtherDrops(otherDrops);

      dispatch(
        setAutoDrop({
          actionDrop: filteredDrops[0],
          actionCollection: coll,
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  const getProfile = async (
    autograph: string
  ): Promise<Profile | undefined> => {
    try {
      let prof: any;
      if (lensProfile) {
        prof = await getOneProfileAuth({
          handle: (autograph as string) + ".lens",
        });
      } else {
        prof = await getOneProfile({
          handle: (autograph as string) + ".lens",
        });
      }

      if (!prof?.data) {
        return;
      }

      return prof?.data?.profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    dropLoading,
    getDrop,
    otherDrops,
  };
};

export default useAutoDrop;
