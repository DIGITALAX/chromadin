import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  Publication,
} from "@/components/Home/types/lens.types";
import canCommentPub from "@/graphql/lens/queries/canComment";
import { setCanComment } from "@/redux/reducers/canCommentSlice";
import { setCommentsRedux } from "@/redux/reducers/commentSlice";
import { setCommentFeedCount } from "@/redux/reducers/commentFeedCountSlice";
import { useRouter } from "next/router";
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountReducer";
import { setFeedType } from "@/redux/reducers/feedTypeSlice";
import { useSigner, useAccount } from "wagmi";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useIndividual = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeedCount = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const commentors = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [mainPost, setMainPost] = useState<Publication>();
  const [mainPostLoading, setMainPostLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean>(false);
  const [followerOnlyComments, setFollowerOnlyComments] = useState<boolean[]>(
    []
  );
  const [reactCommentLoading, setReactCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectPostLoading, setCollectPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [mirrorPostLoading, setMirrorPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [reactPostLoading, setReactPostLoading] = useState<boolean[]>([false]);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: any;

      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: feedType,
          limit: 10,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 10,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      }
      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: any[] = [...comments?.data?.publications?.items];
      if (sortedArr?.length < 10) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      dispatch(setCommentsRedux(sortedArr));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments(
        sortedArr?.map((obj: Publication) =>
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
      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 10,
            commentsOfOrdering: CommentOrderingTypes.Ranking,
            commentsRankingFilter: CommentRankingFilter.Relevant,
          },
          lensProfile,
          undefined,
          true
        );
      }
      const hasCollectedArr = sortedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      dispatch(
        setCommentFeedCount({
          actionLike: sortedArr.map(
            (obj: Publication) => obj.stats.totalUpvotes
          ),
          actionMirror: sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfCollects
          ),
          actionComment: sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfComments
          ),
          actionHasLiked: hasReactedArr ? hasReactedArr : [],
          actionHasMirrored: hasMirroredArr ? hasMirroredArr : [],
          actionHasCollected: hasCollectedArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMoreComments(false);
        return;
      }
      let comments: any;
      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: feedType,
          limit: 10,
          cursor: paginated?.next,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: feedType,
          limit: 10,
          cursor: paginated?.next,
          commentsOfOrdering: CommentOrderingTypes.Ranking,
          commentsRankingFilter: CommentRankingFilter.Relevant,
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: any[] = [...comments?.data?.publications?.items];
      if (sortedArr?.length < 10) {
        setHasMoreComments(false);
      }
      dispatch(setCommentsRedux([...commentors, ...sortedArr]));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments([
        ...followerOnlyComments,
        ...sortedArr?.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        const hasReactedArr = await checkPostReactions(
          {
            commentsOf: feedType,
            limit: 10,
            cursor: paginated?.next,
            commentsOfOrdering: CommentOrderingTypes.Ranking,
            commentsRankingFilter: CommentRankingFilter.Relevant,
          },
          lensProfile,
          undefined,
          true
        );
        const hasCollectedArr = sortedArr.map(
          (obj: Publication) => obj.hasCollectedByMe
        );
        dispatch(
          setCommentFeedCount({
            actionLike: [
              ...commentFeedCount.like,
              ...sortedArr.map((obj: Publication) => obj.stats.totalUpvotes),
            ],
            actionMirror: [
              ...commentFeedCount.mirror,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfMirrors
              ),
            ],
            actionCollect: [
              ...commentFeedCount.collect,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfCollects
              ),
            ],
            actionComment: [
              ...commentFeedCount.comment,
              ...sortedArr.map(
                (obj: Publication) => obj.stats.totalAmountOfComments
              ),
            ],
            actionHasLiked: [...commentFeedCount.hasLiked, ...hasReactedArr],
            actionHasMirrored: [
              ...commentFeedCount.hasMirrored,
              ...hasMirroredArr,
            ],
            actionHasCollected: [
              ...commentFeedCount.hasCollected,
              ...hasCollectedArr,
            ],
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const canComment = async () => {
    try {
      const res = await canCommentPub(
        {
          publicationId: feedType,
        },
        lensProfile
      );
      if (!res.data.publication.canComment.result) {
        dispatch(setCanComment(false));
      } else {
        dispatch(setCanComment(true));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostInfo = async () => {
    setMainPostLoading(true);
    try {
      let pubData;
      if (lensProfile) {
        const { data } = await getPublicationAuth(
          {
            publicationId: feedType,
          },
          lensProfile
        );

        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: feedType,
        });
        pubData = data;
      }

      let decryptedData;

      if (signer && address) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        if (
          pubData?.publication.canDecrypt &&
          pubData?.publication.canDecrypt.result
        ) {
          try {
            const data = await fetchIPFSJSON(
              pubData?.publication.onChainContentURI
                ?.split("ipfs://")[1]
                .replace(/"/g, "")
                .trim()
            );
            const { decrypted, error } = await sdk.gated.decryptMetadata(data);
            if (decrypted) {
              decryptedData = {
                ...pubData?.publication,
                decrypted,
              };
            } else {
              decryptedData = {
                ...pubData?.publication,
                gated: true,
              };
            }
          } catch (err: any) {
            console.error(err.message);
            decryptedData = {
              ...pubData?.publication,
              gated: true,
            };
          }
        } else if (
          pubData?.publication?.metadata?.content?.includes(
            "This publication is gated"
          ) ||
          (pubData?.publication?.__typename === "Mirror" &&
            pubData?.publication?.mirrorOf.metadata.content.includes(
              "This publication is gated"
            ))
        ) {
          decryptedData = {
            ...pubData?.publication,
            gated: true,
          };
        } else {
          decryptedData = pubData?.publication;
        }
      } else {
        if (
          pubData?.publication.metadata.content.includes(
            "This publication is gated"
          ) ||
          (pubData?.publication?.__typename === "Mirror" &&
            pubData?.publication?.mirrorOf.metadata.content.includes(
              "This publication is gated"
            ))
        ) {
          decryptedData = {
            ...pubData?.publication,
            gated: true,
          };
        } else {
          decryptedData = pubData?.publication;
        }
      }

      setMainPost(decryptedData);
      setFollowerOnly(
        decryptedData?.__typename === "Mirror"
          ? decryptedData?.mirrorOf.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
            ? true
            : false
          : decryptedData?.referenceModule?.type ===
            "FollowerOnlyReferenceModule"
          ? true
          : false
      );
      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored([decryptedData], lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            publicationId: feedType,
          },
          lensProfile,
          true
        );
      }
      dispatch(
        setIndividualFeedCount({
          actionLike: decryptedData?.stats.totalUpvotes,
          actionMirror: decryptedData?.stats.totalAmountOfMirrors,
          actionCollect: decryptedData?.stats.totalAmountOfCollects,
          actionComment: decryptedData?.stats.totalAmountOfComments,
          actionHasLiked: hasReactedArr ? hasReactedArr?.[0] : false,
          actionHasMirrored: hasMirroredArr ? hasMirroredArr?.[0] : false,
          actionHasCollected: decryptedData?.hasCollectedByMe,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMainPostLoading(false);
  };

  useEffect(() => {
    if (feedType !== "") {
      canComment();
      getPostInfo();
      getPostComments();
    }
  }, [feedType]);

  useEffect(() => {
    if (feedType !== "" && router.asPath?.includes("#chat")) {
      if (index.message === "Successfully Indexed") {
        getPostComments();
      }
    }
  }, [index.message]);

  useEffect(() => {
    if (router.asPath.includes("&post=") && router.asPath.includes("#chat")) {
      dispatch(setFeedType(router.asPath.split("&post=")[1]));
    } else if (
      router.asPath.includes("#chat") &&
      !router.asPath.includes("&post=")
    ) {
      dispatch(setFeedType(""));
    }
  }, [router.asPath]);

  return {
    getMorePostComments,
    hasMoreComments,
    commentsLoading,
    mainPostLoading,
    followerOnly,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
  };
};

export default useIndividual;
