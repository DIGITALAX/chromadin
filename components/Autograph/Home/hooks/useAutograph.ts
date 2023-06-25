import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutograph } from "@/redux/reducers/autographSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAutograph = () => {
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
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

  const handleShareCollection = async (collection: Collection) => {
    dispatch(setImageLoadingRedux(true));
    try {
      dispatch(setMakePost(true));

      if (!collection?.uri?.image) {
        dispatch(setImageLoadingRedux(false));
        return;
      }
      const response = await fetch(
        `${INFURA_GATEWAY}/ipfs/${collection?.uri?.image?.split("ipfs://")[1]}`
      );
      const blob = await response.blob();
      const file = new File([blob], collection?.uri?.name, {
        type: "image/png",
        lastModified: Date.now(),
      });

      if (file) {
        await uploadImage([file], true);
        dispatch(setImageLoadingRedux(false));
      } else {
        dispatch(setImageLoadingRedux(false));
      }
    } catch (err: any) {
      dispatch(setImageLoadingRedux(false));
      console.error(err.message);
    }
  };

  return {
    autographLoading,
    getAllCollections,
    getProfileFeed,
    handleShareCollection,
  };
};

export default useAutograph;
