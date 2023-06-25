import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import { getCollectionsDrop } from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutoDrop } from "@/redux/reducers/autoDropSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
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
    dropLoading,
    getDrop,
    handleShareCollection,
  };
};

export default useAutoDrop;
