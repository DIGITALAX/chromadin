import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsDecrypt,
  getCollectionsProfile,
} from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutoCollection } from "@/redux/reducers/autoCollectionSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAutoCollection = () => {
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
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [otherCollectionsDrop, setOtherCollectionsDrop] = useState<
    Collection[]
  >([]);

  const getCollection = async (autograph: string, collection: string) => {
    setCollectionLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setCollectionLoading(false);
        return;
      }

      const colls = await getCollectionsDecrypt(
        collection?.replaceAll("-", " ") as string,
        prof?.ownedBy
      );

      const coll = await Promise.all(
        colls?.data?.collectionMinteds.map(async (collection: Collection) => {
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
        (collectionValue: Collection) => {
          if (
            coll[0]?.drop?.collectionIds?.includes(
              collectionValue?.collectionId
            ) &&
            collectionValue?.name?.toLowerCase() !==
              collection?.replace("-", " ")?.toLowerCase()
          ) {
            return collectionValue;
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

      setOtherCollectionsDrop(otherDrops);
      dispatch(
        setAutoCollection({
          actionCollection: coll[0],
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
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

  const handleShareCollection = async () => {
    dispatch(setImageLoadingRedux(true));
    try {
      dispatch(setMakePost(true));

      if (!actionCollection?.uri?.image) {
        dispatch(setImageLoadingRedux(false));
        return;
      }
      const response = await fetch(
        `${INFURA_GATEWAY}/ipfs/${
          actionCollection?.uri?.image?.split("ipfs://")[1]
        }`
      );
      const blob = await response.blob();
      const file = new File([blob], actionCollection?.uri?.name, {
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
    collectionLoading,
    getCollection,
    otherCollectionsDrop,
    handleShareCollection,
  };
};

export default useAutoCollection;
