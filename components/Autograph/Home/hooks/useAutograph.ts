import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutograph } from "@/redux/reducers/autographSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAutograph = () => {
  const dispatch = useDispatch();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const [autographLoading, setAutographLoading] = useState<boolean>(false);

  const getProfileFeed = async (autograph: string) => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getAllCollections = async (autograph: string) => {
    setAutographLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setAutographLoading(false);
        return;
      }

      const drops = allDrops.filter((dropValue: Drop) => {
        if (
          dropValue?.creator?.toLowerCase() === prof?.ownedBy?.toLowerCase()
        ) {
          return dropValue;
        }
      });

      const allColls = await getCollectionsProfile(prof?.ownedBy);

      const collections = await Promise.all(
        allColls?.data?.collectionMinteds?.map(
          async (collection: Collection) => {
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
              },
            };
          }
        )
      );

      dispatch(
        setAutograph({
          actionDrops: drops,
          actionCollections: collections,
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setAutographLoading(false);
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
    autographLoading,
    getAllCollections,
    getProfileFeed,
  };
};

export default useAutograph;
