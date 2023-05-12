import { Publication } from "@/components/Home/types/lens.types";
import feedTimeline from "@/graphql/lens/queries/feedTimeline";
import { LENS_CREATORS } from "@/lib/constants";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { setCommentFeedCount } from "@/redux/reducers/commentFeedCountSlice";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import { setReactionFeedCount } from "@/redux/reducers/reactionFeedCountSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAllPosts = () => {
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const indexer = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const feedId = useSelector(
    (state: RootState) => state.app.feedReactIdReducer
  );
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeed = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const comments = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const dispatch = useDispatch();
  const [paginated, setPaginated] = useState<any>();
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      const data = await feedTimeline({
        profileIds: LENS_CREATORS,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 20,
      });
      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setPaginated(data?.data?.publications?.pageInfo);
      const hasReactedArr = await checkPostReactions(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 20,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      setFollowerOnly(
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
      dispatch(setFeedsRedux(sortedArr));
      dispatch(
        setReactionFeedCount({
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
          actionHasLiked: hasReactedArr,
          actionHasMirrored: hasMirroredArr,
          actionHasCollected: hasCollectedArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostsLoading(false);
  };

  const fetchMore = async () => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      const data = await feedTimeline({
        profileIds: LENS_CREATORS,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 20,
        cursor: paginated?.next,
      });

      const arr: any[] = [...data?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 20) {
        setHasMore(false);
      }
      {
        setHasMore(true);
      }
      dispatch(setFeedsRedux([...feedDispatch, ...sortedArr]));
      setPaginated(data?.data?.publications?.pageInfo);
      const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      const hasReactedArr = await checkPostReactions(
        {
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 20,
          cursor: paginated?.next,
        },
        lensProfile
      );
      const hasCollectedArr = sortedArr.map((obj: Publication) =>
        obj.__typename === "Mirror"
          ? obj.mirrorOf.hasCollectedByMe
          : obj.hasCollectedByMe
      );
      dispatch(
        setReactionFeedCount({
          actionLike: [
            ...reactionFeedCount.like,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalUpvotes
                : obj.stats.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionFeedCount.mirror,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfMirrors
                : obj.stats.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionFeedCount.collect,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfCollects
                : obj.stats.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionFeedCount.comment,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats.totalAmountOfComments
                : obj.stats.totalAmountOfComments
            ),
          ],
          actionHasLiked: [...reactionFeedCount.hasLiked, ...hasReactedArr],
          actionHasMirrored: [
            ...reactionFeedCount.hasMirrored,
            ...hasMirroredArr,
          ],
          actionHasCollected: [
            ...reactionFeedCount.hasCollected,
            ...hasCollectedArr,
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchInteractions = () => {
    try {
      const index = feedDispatch?.findIndex((feed) => feed.id === feedId.value);
      if (index > 0) {
        dispatch(
          setReactionFeedCount({
            actionLike:
              feedId.type === 0
                ? reactionFeedCount.like.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.like,
            actionMirror:
              feedId.type === 1
                ? reactionFeedCount.mirror.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.mirror,
            actionCollect:
              feedId.type === 2
                ? reactionFeedCount.collect.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.collect,
            actionComment:
              feedId.type === 3
                ? reactionFeedCount.comment.map((obj: number, number: number) =>
                    number === index ? obj + 1 : obj
                  )
                : reactionFeedCount.comment,
            actionHasLiked:
              feedId.type === 0
                ? reactionFeedCount.hasLiked.map(
                    (obj: boolean, number: number) =>
                      number === index ? true : obj
                  )
                : reactionFeedCount.hasLiked,
            actionHasMirrored:
              feedId.type === 1
                ? reactionFeedCount.hasMirrored.map(
                    (obj: boolean, number: number) =>
                      number === index ? true : obj
                  )
                : reactionFeedCount.mirror,
            actionHasCollected:
              feedId.type === 2
                ? reactionFeedCount.hasCollected.map(
                    (obj: boolean, number: number) =>
                      number === index ? true : obj
                  )
                : reactionFeedCount.collect,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchComments = () => {
    const index = comments?.findIndex((comment) => comment.id === feedId.value);
    if (index > 0) {
      dispatch(
        setCommentFeedCount({
          actionLike:
            feedId.type === 0
              ? commentFeed.like.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.like,
          actionMirror:
            feedId.type === 1
              ? commentFeed.mirror.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.mirror,
          actionCollect:
            feedId.type === 2
              ? commentFeed.collect.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.collect,
          actionComment:
            feedId.type === 3
              ? commentFeed.comment.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.comment,
          actionHasLiked:
            feedId.type === 0
              ? commentFeed.hasLiked.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.hasLiked,
          actionHasMirrored:
            feedId.type === 1
              ? commentFeed.hasMirrored.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.mirror,
          actionHasCollected:
            feedId.type === 2
              ? commentFeed.hasCollected.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.collect,
        })
      );
    }
  };

  useEffect(() => {
    if (indexer.message === "Successfully Indexed") {
      refetchInteractions();

      if (feedType !== "") {
        refetchComments();
      }
    }
  }, [indexer.message]);

  useEffect(() => {
    if (!feedDispatch || feedDispatch.length < 1) {
      getTimeline();
    }
  }, [auth]);

  return {
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
  };
};

export default useAllPosts;
