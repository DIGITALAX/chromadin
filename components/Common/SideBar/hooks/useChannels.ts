import { useEffect, useState } from "react";
import { UseChannelsResults } from "../types/sidebar.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { Publication } from "@/components/Home/types/lens.types";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import { ApolloQueryResult } from "@apollo/client";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { INFURA_GATEWAY } from "@/lib/constants";
import json from "./../../../../public/videos/local.json";

const useChannels = (): UseChannelsResults => {
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const dispatch = useDispatch();
  const [videos, setVideos] = useState<Publication[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [mirrored, setMirrored] = useState<boolean[]>([]);
  const [tab, setTab] = useState<number>(0);

  const getVideos = async (): Promise<void> => {
    try {
      let data: ApolloQueryResult<any>, hasReactedArr, hasMirroredArr;
      if (authStatus && lensProfile) {
        data = await profilePublicationsAuth({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      } else {
        data = await profilePublications({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setVideos(sortedArr.reverse());
      if (authStatus && lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: "0x01c6a9",
            publicationTypes: ["POST"],
            limit: 30,
          },
          lensProfile
        );
        setLiked(hasReactedArr);
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setMirrored(hasMirroredArr);
      }
      dispatch(
        setMainVideo({
          actionVideo: `${INFURA_GATEWAY}/ipfs/${
            sortedArr[
              sortedArr.length - 1
            ]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
          }`,
          actionCollected: sortedArr[-1]?.hasCollectedByMe,
          actionLiked: hasReactedArr?.hasReactedArr?.[sortedArr.length - 1],
          actionMirrored: hasMirroredArr?.[sortedArr.length - 1],
          actionId: sortedArr[sortedArr.length - 1].id,
          actionLocal: `${json[sortedArr.length - 1].link}`,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getVideos();
  }, [lensProfile]);

  return { videos, liked, mirrored, tab, setTab };
};

export default useChannels;
