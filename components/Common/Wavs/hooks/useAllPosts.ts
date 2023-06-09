import { Publication } from "@/components/Home/types/lens.types";
import {
  feedTimeline,
  feedTimelineAuth,
} from "@/graphql/lens/queries/feedTimeline";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { LENS_CREATORS } from "@/lib/constants";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { setCommentFeedCount } from "@/redux/reducers/commentFeedCountSlice";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountReducer";
import { setPaginated } from "@/redux/reducers/paginatedSlice";
import { setProfileFeedCount } from "@/redux/reducers/profileFeedCountSlice";
import { setReactionFeedCount } from "@/redux/reducers/reactionFeedCountSlice";
import { setScrollPosRedux } from "@/redux/reducers/scrollPosSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { useSigner, useAccount } from "wagmi";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDecryptFeedRedux } from "@/redux/reducers/decryptFeedSlice";
import { setDecryptFeedCount } from "@/redux/reducers/decryptFeedCountSlice";
import { setDecryptPaginated } from "@/redux/reducers/decryptPaginatedSlice";
import { setDecryptScrollPosRedux } from "@/redux/reducers/decryptScrollPosSlice";
import { setDecryptProfileFeedCount } from "@/redux/reducers/decryptProfileCountSlice";
import { Collection } from "@/components/Home/types/home.types";
import { getCollectionsDecrypt } from "@/graphql/subgraph/queries/getAllCollections";

const useAllPosts = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const decryptFeed = useSelector(
    (state: RootState) => state.app.decryptFeedReducer.value
  );
  const filterDecrypt = useSelector(
    (state: RootState) => state.app.filterDecryptReducer.value
  );
  const decryptFeedCount = useSelector(
    (state: RootState) => state.app.decryptFeedCountReducer
  );
  const indexer = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const decrypt = useSelector((state: RootState) => state.app.decryptReducer);
  const feedId = useSelector(
    (state: RootState) => state.app.feedReactIdReducer
  );
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
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
  const paginated = useSelector(
    (state: RootState) => state.app.paginatedReducer.value
  );
  const individual = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const decryptPaginated = useSelector(
    (state: RootState) => state.app.decryptPaginatedReducer.value
  );
  const decryptProfileFeedCount = useSelector(
    (state: RootState) => state.app.decryptProfileFeedCountReducer
  );

  const scrollRef = useRef<InfiniteScroll>(null);
  const scrollRefDecrypt = useRef<InfiniteScroll>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [followerOnly, setFollowerOnly] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [followerOnlyDecrypt, setFollowerOnlyDecrypt] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [decryptLoading, setDecryptLoading] = useState<boolean>(false);
  const [hasMoreDecrypt, setHasMoreDecrypt] = useState<boolean>(true);
  const [decryptCollections, setDecryptCollections] = useState<Collection[]>(
    []
  );

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      let data;

      if (lensProfile) {
        data = await feedTimelineAuth(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST", "MIRROR"],
            limit: 10,
          },
          lensProfile
        );
      } else {
        data = await feedTimeline({
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "MIRROR"],
          limit: 10,
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setPostsLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (signer && address) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        sortedArr = await Promise.all(
          sortedArr.map(async (post) => {
            if (post?.canDecrypt && post?.canDecrypt.result) {
              try {
                const data = await fetchIPFSJSON(
                  post.onChainContentURI
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    .trim()
                );
                const { decrypted, error } = await sdk.gated.decryptMetadata(
                  data
                );
                if (decrypted) {
                  return {
                    ...post,
                    decrypted,
                  };
                } else {
                  return {
                    ...post,
                    gated: true,
                  };
                }
              } catch (err: any) {
                console.error(err.message);
                return {
                  ...post,
                  gated: true,
                };
              }
            } else if (
              post?.metadata?.content?.includes("This publication is gated") ||
              (post.__typename === "Mirror" &&
                post.mirrorOf.metadata.content.includes(
                  "This publication is gated"
                ))
            ) {
              return {
                ...post,
                gated: true,
              };
            } else {
              return post;
            }
          })
        );
      } else {
        sortedArr = sortedArr.map((post) => {
          if (
            post.metadata.content.includes("This publication is gated") ||
            (post.__typename === "Mirror" &&
              post.mirrorOf.metadata.content.includes(
                "This publication is gated"
              ))
          ) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        });
      }

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setPaginated(data?.data?.publications?.pageInfo));
      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST", "MIRROR"],
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
          actionHasLiked: hasReactedArr ?? [],
          actionHasMirrored: hasMirroredArr ?? [],
          actionHasCollected: hasCollectedArr ?? [],
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
      let data;

      if (lensProfile) {
        data = await feedTimelineAuth(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST", "MIRROR"],
            limit: 10,
            cursor: paginated?.next,
          },
          lensProfile
        );
      } else {
        data = await feedTimeline({
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST", "MIRROR"],
          limit: 10,
          cursor: paginated?.next,
        });
      }

      const arr: any[] = [...data?.data?.publications?.items];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (signer && address) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        sortedArr = await Promise.all(
          sortedArr.map(async (post) => {
            if (post.canDecrypt && post.canDecrypt.result) {
              try {
                const data = await fetchIPFSJSON(
                  post.onChainContentURI
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    .trim()
                );
                const { decrypted, error } = await sdk.gated.decryptMetadata(
                  data
                );
                if (decrypted) {
                  return {
                    ...post,
                    decrypted,
                  };
                } else {
                  return {
                    ...post,
                    gated: true,
                  };
                }
              } catch (err: any) {
                console.error(err.message);
                return {
                  ...post,
                  gated: true,
                };
              }
            } else if (
              post?.metadata?.content?.includes("This publication is gated")
            ) {
              return {
                ...post,
                gated: true,
              };
            } else {
              return post;
            }
          })
        );
      } else {
        sortedArr = sortedArr.map((post) => {
          if (post.metadata.content.includes("This publication is gated")) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        });
      }

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setFeedsRedux([...feedDispatch, ...sortedArr]));
      dispatch(setPaginated(data?.data?.publications?.pageInfo));
      setFollowerOnly([
        ...followerOnly,
        ...sortedArr.map((obj: Publication) =>
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
      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST", "MIRROR"],
            limit: 10,
            cursor: paginated?.next,
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
        setReactionFeedCount({
          actionLike: [
            ...reactionFeedCount.like,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats?.totalUpvotes
                : obj.stats?.totalUpvotes
            ),
          ],
          actionMirror: [
            ...reactionFeedCount.mirror,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats?.totalAmountOfMirrors
                : obj.stats?.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...reactionFeedCount.collect,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats?.totalAmountOfCollects
                : obj.stats?.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...reactionFeedCount.comment,
            ...sortedArr.map((obj: Publication) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOf.stats?.totalAmountOfComments
                : obj.stats?.totalAmountOfComments
            ),
          ],
          actionHasLiked: [
            ...reactionFeedCount.hasLiked,
            ...(hasReactedArr ?? []),
          ],
          actionHasMirrored: [
            ...reactionFeedCount.hasMirrored,
            ...(hasMirroredArr ?? []),
          ],
          actionHasCollected: [
            ...reactionFeedCount.hasCollected,
            ...(hasCollectedArr ?? []),
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getDecryptFeed = async () => {
    setDecryptLoading(true);
    try {
      let data;

      if (lensProfile) {
        data = await feedTimelineAuth(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST"],
            limit: 10,
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          lensProfile
        );
      } else {
        data = await feedTimeline({
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST"],
          limit: 10,
          metadata: {
            tags: {
              all: ["encrypted", "chromadin", "labyrinth"],
            },
          },
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setDecryptLoading(false);
        return;
      }
      const arr: any[] = [...data?.data.publications?.items];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (signer && address) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        sortedArr = await Promise.all(
          sortedArr.map(async (post) => {
            if (post?.canDecrypt && post?.canDecrypt.result) {
              try {
                const data = await fetchIPFSJSON(
                  post.onChainContentURI
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    .trim()
                );
                const { decrypted, error } = await sdk.gated.decryptMetadata(
                  data
                );
                if (decrypted) {
                  return {
                    ...post,
                    decrypted,
                  };
                } else {
                  return {
                    ...post,
                    gated: true,
                  };
                }
              } catch (err: any) {
                console.error(err.message);
                return {
                  ...post,
                  gated: true,
                };
              }
            } else {
              return {
                ...post,
                gated: true,
              };
            }
          })
        );
      } else {
        sortedArr = sortedArr.map((post) => {
          if (post.metadata.content.includes("This publication is gated")) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        });
      }

      if (sortedArr?.length < 10) {
        setHasMoreDecrypt(false);
      } else {
        setHasMoreDecrypt(true);
      }
      dispatch(setDecryptPaginated(data?.data?.publications?.pageInfo));
      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST"],
            limit: 10,
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          lensProfile
        );
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      }
      const hasCollectedArr = sortedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      setFollowerOnlyDecrypt(
        sortedArr.map((obj: Publication) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setDecryptFeedRedux(sortedArr));
      dispatch(
        setDecryptFeedCount({
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
          actionHasLiked: hasReactedArr ?? [],
          actionHasMirrored: hasMirroredArr ?? [],
          actionHasCollected: hasCollectedArr ?? [],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading(false);
  };

  const fetchMoreDecrypt = async () => {
    try {
      if (!decryptPaginated?.next) {
        // fix apollo duplications on null next
        setHasMoreDecrypt(false);
        return;
      }
      let data;

      if (lensProfile) {
        data = await feedTimelineAuth(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
            cursor: decryptPaginated?.next,
          },
          lensProfile
        );
      } else {
        data = await feedTimeline({
          profileIds: LENS_CREATORS,
          publicationTypes: ["POST"],
          metadata: {
            tags: {
              all: ["encrypted", "chromadin", "labyrinth"],
            },
          },
          limit: 10,
          cursor: decryptPaginated?.next,
        });
      }

      const arr: any[] = [...data?.data?.publications?.items];
      let sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (signer && address) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        sortedArr = await Promise.all(
          sortedArr.map(async (post) => {
            if (post.canDecrypt && post.canDecrypt.result) {
              try {
                const data = await fetchIPFSJSON(
                  post.onChainContentURI
                    ?.split("ipfs://")[1]
                    ?.replace(/"/g, "")
                    .trim()
                );
                const { decrypted, error } = await sdk.gated.decryptMetadata(
                  data
                );
                if (decrypted) {
                  return {
                    ...post,
                    decrypted,
                  };
                } else {
                  return {
                    ...post,
                    gated: true,
                  };
                }
              } catch (err: any) {
                console.error(err.message);
                return {
                  ...post,
                  gated: true,
                };
              }
            } else if (
              post?.metadata?.content?.includes("This publication is gated")
            ) {
              return {
                ...post,
                gated: true,
              };
            } else {
              return post;
            }
          })
        );
      } else {
        sortedArr = sortedArr.map((post) => {
          if (post.metadata.content.includes("This publication is gated")) {
            return {
              ...post,
              gated: true,
            };
          } else {
            return post;
          }
        });
      }

      if (sortedArr?.length < 10) {
        setHasMoreDecrypt(false);
      } else {
        setHasMoreDecrypt(true);
      }
      dispatch(setDecryptFeedRedux([...decryptFeed, ...sortedArr]));
      dispatch(setDecryptPaginated(data?.data?.publications?.pageInfo));
      setFollowerOnlyDecrypt([
        ...followerOnlyDecrypt,
        ...sortedArr.map((obj: Publication) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileIds: LENS_CREATORS,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
            cursor: decryptPaginated?.next,
          },
          lensProfile
        );
      }

      const hasCollectedArr = sortedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      dispatch(
        setDecryptFeedCount({
          actionLike: [
            ...decryptFeedCount.like,
            ...sortedArr.map((obj: Publication) => obj.stats?.totalUpvotes),
          ],
          actionMirror: [
            ...decryptFeedCount.mirror,
            ...sortedArr.map(
              (obj: Publication) => obj.stats?.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...decryptFeedCount.collect,
            ...sortedArr.map(
              (obj: Publication) => obj.stats?.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...decryptFeedCount.comment,
            ...sortedArr.map(
              (obj: Publication) => obj.stats?.totalAmountOfComments
            ),
          ],
          actionHasLiked: [
            ...decryptFeedCount.hasLiked,
            ...(hasReactedArr ?? []),
          ],
          actionHasMirrored: [
            ...decryptFeedCount.hasMirrored,
            ...(hasMirroredArr ?? []),
          ],
          actionHasCollected: [
            ...decryptFeedCount.hasCollected,
            ...(hasCollectedArr ?? []),
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchInteractions = () => {
    try {
      const index = (
        profile?.id === "" || !profile?.id ? feedDispatch : profileDispatch
      )?.findIndex(
        (feed) =>
          (feed.__typename === "Mirror" ? feed.mirrorOf.id : feed.id) ===
          feedId.value
      );
      if (index !== -1) {
        dispatch(
          setIndividualFeedCount({
            actionLike:
              feedId.type === 0 ? individual.like + 1 : individual.like,
            actionMirror:
              feedId.type === 1 ? individual.mirror + 1 : individual.mirror,
            actionCollect:
              feedId.type === 2 ? individual.collect + 1 : individual.collect,
            actionComment:
              feedId.type === 3 ? individual.comment + 1 : individual.comment,
            actionHasLiked: feedId.type === 0 ? true : individual.hasLiked,
            actionHasMirrored: feedId.type === 1 ? true : individual.mirror,
            actionHasCollected: feedId.type === 2 ? true : individual.collect,
          })
        );
        if (profile?.id === "" || !profile?.id) {
          if (filterDecrypt) {
            dispatch(
              setDecryptFeedCount({
                actionLike:
                  feedId.type === 0
                    ? decryptFeedCount.like.map((obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? decryptFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? decryptFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? decryptFeedCount.comment.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.comment,
                actionHasLiked:
                  feedId.type === 0
                    ? decryptFeedCount.hasLiked.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.hasLiked,
                actionHasMirrored:
                  feedId.type === 1
                    ? decryptFeedCount.hasMirrored.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.mirror,
                actionHasCollected:
                  feedId.type === 2
                    ? decryptFeedCount.hasCollected.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.collect,
              })
            );
          } else {
            dispatch(
              setReactionFeedCount({
                actionLike:
                  feedId.type === 0
                    ? reactionFeedCount.like.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : reactionFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? reactionFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : reactionFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? reactionFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : reactionFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? reactionFeedCount.comment.map(
                        (obj: number, number: number) =>
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
        } else {
          if (filterDecrypt) {
            dispatch(
              setDecryptProfileFeedCount({
                actionLike:
                  feedId.type === 0
                    ? decryptProfileFeedCount.like.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? decryptProfileFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? decryptProfileFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? decryptProfileFeedCount.comment.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.comment,
                actionHasLiked:
                  feedId.type === 0
                    ? decryptProfileFeedCount.hasLiked.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.hasLiked,
                actionHasMirrored:
                  feedId.type === 1
                    ? decryptProfileFeedCount.hasMirrored.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.mirror,
                actionHasCollected:
                  feedId.type === 2
                    ? decryptProfileFeedCount.hasCollected.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.collect,
              })
            );
          } else {
            dispatch(
              setProfileFeedCount({
                actionLike:
                  feedId.type === 0
                    ? profileFeedCount.like.map((obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                      )
                    : profileFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? profileFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : profileFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? profileFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : profileFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? profileFeedCount.comment.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : profileFeedCount.comment,
                actionHasLiked:
                  feedId.type === 0
                    ? profileFeedCount.hasLiked.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : profileFeedCount.hasLiked,
                actionHasMirrored:
                  feedId.type === 1
                    ? profileFeedCount.hasMirrored.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : profileFeedCount.mirror,
                actionHasCollected:
                  feedId.type === 2
                    ? profileFeedCount.hasCollected.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : profileFeedCount.collect,
              })
            );
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchComments = () => {
    const index = comments?.findIndex((comment) => comment.id === feedId.value);

    if (index !== -1) {
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

  const setScrollPos = (e: MouseEvent) => {
    dispatch(setScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const setScrollPosDecrypt = (e: MouseEvent) => {
    dispatch(setDecryptScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const getDecryptCollections = async (): Promise<void> => {
    try {
      let collections: Collection[] = [];

      for (let name = 0; name <= decrypt.collections.length - 1; name++) {
        const collection = await getCollectionsDecrypt(
          decrypt.collections[name],
          decrypt.owner as string
        );
        const json = await fetchIPFSJSON(
          (collection?.data?.collectionMinteds[0].uri as any)
            ?.split("ipfs://")[1]
            ?.replace(/"/g, "")
            ?.trim()
        );

        if (collection?.data?.collectionMinteds?.length > 0) {
          const newCollections = {
            ...collection?.data?.collectionMinteds[0],
            uri: json,
          };
          collections.push(newCollections);
        }
      }

      const newCols = collections.filter((obj) => obj.collectionId !== "104");

      setDecryptCollections(newCols);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (router.asPath?.includes("#chat")) {
      if (indexer.message === "Successfully Indexed") {
        refetchInteractions();

        if (feedType !== "") {
          refetchComments();
        }
      }
    }
  }, [indexer.message]);

  useEffect(() => {
    if (router.asPath.includes("#chat")) {
      if (filterDecrypt) {
        if (decryptFeed.length < 1 || !decryptFeed) {
          getDecryptFeed();
        }
      } else {
        if (!feedDispatch || feedDispatch.length < 1) {
          getTimeline();
        }
      }
    }
  }, [filterDecrypt, auth]);

  useEffect(() => {
    if (
      postSent &&
      !router.asPath.includes("&post=") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setPostSent(false));

      if (filterDecrypt) {
        getDecryptFeed();
      } else {
        getTimeline();
      }
    }
  }, [postSent]);

  useEffect(() => {
    if (decrypt.open) {
      getDecryptCollections();
    }
  }, [decrypt.open]);

  return {
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
    scrollRef,
    setScrollPos,
    fetchMoreDecrypt,
    decryptLoading,
    hasMoreDecrypt,
    scrollRefDecrypt,
    setScrollPosDecrypt,
    followerOnlyDecrypt,
    decryptCollections,
  };
};

export default useAllPosts;
