import { Publication } from "@/components/Home/types/lens.types";
import getOneProfile from "@/graphql/lens/queries/getProfile";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { setProfileFeedCount } from "@/redux/reducers/profileFeedCountSlice";
import { setProfileFeedRedux } from "@/redux/reducers/profileFeedSlice";
import { setProfilePaginated } from "@/redux/reducers/profilePaginatedSlice";
import { setProfileScrollPosRedux } from "@/redux/reducers/profileScrollPosSlice";
import { setProfile } from "@/redux/reducers/profileSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

const useProfileFeed = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const profileRef = useRef<InfiniteScroll>(null);
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const profileId = useSelector((state: RootState) => state.app.profileReducer);
  const profilePageData = useSelector(
    (state: RootState) => state.app.profilePaginatedReducer.value
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );

  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: profileDispatch.length }, () => false)
  );
  const [collectProfileLoading, setCollectProfileLoading] = useState<boolean[]>(
    Array.from({ length: profileDispatch.length }, () => false)
  );
  const [mirrorProfileLoading, setMirrorProfileLoading] = useState<boolean[]>(
    Array.from({ length: profileDispatch.length }, () => false)
  );
  const [reactProfileLoading, setReactProfileLoading] = useState<boolean[]>(
    Array.from({ length: profileDispatch.length }, () => false)
  );
  const [profileLoading, setProfileLoading] = useState<boolean>(false);

  const getProfile = async () => {
    setProfileLoading(true);
    let data;
    try {
      if (!lensProfile?.id) {
        data = await profilePublications({
          profileId: profileId?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        });
      } else {
        data = await profilePublicationsAuth({
          profileId: profileId?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setProfileLoading(false);
        return;
      }

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreProfile(false);
      } else {
        setHasMoreProfile(true);
      }

      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.id,
            publicationTypes: ["POST", "COMMENT", "MIRROR"],
            limit: 10,
          },
          lensProfile
        );
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      }
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setFollowerOnlyProfile(
        sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo));
      dispatch(setProfileFeedRedux(sortedArr));
      dispatch(
        setProfileFeedCount({
          actionLike: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalUpvotes
              : obj.stats.totalUpvotes
          ),
          actionMirror: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfMirrors
              : obj.stats.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfCollects
              : obj.stats.totalAmountOfCollects
          ),
          actionComment: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfComments
              : obj.stats.totalAmountOfComments
          ),
          actionHasLiked: hasReactedArr ?? [],
          actionHasMirrored: hasMirroredArr ?? [],
          actionHasCollected: hasCollectedArr ?? [],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const fetchMoreProfile = async () => {
    let data;
    try {
      if (!profilePageData?.next) {
        setHasMoreProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await profilePublications({
          profileId: profileId?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: profilePageData?.next,
        });
      } else {
        data = await profilePublicationsAuth({
          profileId: profileId?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: profilePageData?.next,
        });
      }
      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 10) {
        setHasMoreProfile(false);
      }

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.id,
            publicationTypes: ["POST", "COMMENT", "MIRROR"],
            limit: 10,
            cursor: profilePageData?.next,
          },
          lensProfile
        );
      }

      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      dispatch(
        setProfileFeedCount({
          actionLike: [
            ...profileFeedCount.like,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalUpvotes
                : obj.stats.totalUpvotes
            ),
          ],
          actionMirror: [
            ...profileFeedCount.mirror,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfMirrors
                : obj.stats.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...profileFeedCount.collect,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfCollects
                : obj.stats.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...profileFeedCount.comment,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfComments
                : obj.stats.totalAmountOfComments
            ),
          ],
          actionHasLiked: [
            ...profileFeedCount.hasLiked,
            ...(hasReactedArr ?? []),
          ],
          actionHasMirrored: [
            ...profileFeedCount.hasMirrored,
            ...(hasMirroredArr ?? []),
          ],
          actionHasCollected: [
            ...profileFeedCount.hasCollected,
            ...(hasCollectedArr ?? []),
          ],
        })
      );
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo));
      dispatch(setProfileFeedRedux([...profileDispatch, ...sortedArr]));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const setProfileScroll = (e: MouseEvent) => {
    dispatch(setProfileScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  useEffect(() => {
    if (
      router.asPath.includes("#wavs") &&
      profileId.id !== "" &&
      profileId?.id &&
      profileId.handle !== "" &&
      profileId?.handle
    ) {
      getProfile();
    } else if (
      router.asPath.includes("#wavs") &&
      !router.asPath.includes("?profile=") &&
      profileId.id !== "" &&
      profileId?.id &&
      profileId.handle !== "" &&
      profileId?.handle
    ) {
      dispatch(
        setProfile({
          actionHandle: "",
          actionId: "",
        })
      );
    }
  }, [auth, profileId.id]);

  const getSingleProfile = async () => {
    try {
      const prof = await getOneProfile({
        handle: router.asPath.split("?profile=")[1] + ".lens",
      });
      dispatch(
        setProfile({
          actionHandle: prof?.data?.profile?.handle,
          actionId: prof?.data?.profile?.id,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (router.asPath.includes("?profile=")) {
      getSingleProfile();
    }
  }, [router.asPath]);

  return {
    hasMoreProfile,
    fetchMoreProfile,
    profileRef,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    setProfileScroll,
  };
};

export default useProfileFeed;
