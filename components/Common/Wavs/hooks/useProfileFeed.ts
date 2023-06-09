import { Profile, Publication } from "@/components/Home/types/lens.types";
import { getFollowingAuth } from "@/graphql/lens/queries/getFollowing";
import {
  getOneProfileAuth,
  getOneProfile,
} from "@/graphql/lens/queries/getProfile";
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
import { useSigner, useAccount } from "wagmi";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDecryptProfileScrollPosRedux } from "@/redux/reducers/decryptProfileScrollPosSlice";
import { setDecryptProfilePaginated } from "@/redux/reducers/decryptProfilePaginatedSlice";
import { setDecryptProfileFeedRedux } from "@/redux/reducers/decryptProfileFeedSlice";
import { setDecryptProfileFeedCount } from "@/redux/reducers/decryptProfileCountSlice";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";

const useProfileFeed = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const profileRef = useRef<InfiniteScroll>(null);
  const scrollRefDecryptProfile = useRef<InfiniteScroll>(null);
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const filterDecrypt = useSelector(
    (state: RootState) => state.app.filterDecryptReducer.value
  );
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
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
  const decryptProfilePageData = useSelector(
    (state: RootState) => state.app.decryptProfilePaginatedReducer.value
  );
  const decryptProfileFeedCount = useSelector(
    (state: RootState) => state.app.decryptProfileFeedCountReducer
  );
  const decryptProfileFeed = useSelector(
    (state: RootState) => state.app.decryptProfileFeedReducer.value
  );

  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [hasMoreDecryptProfile, setHasMoreDecryptProfile] =
    useState<boolean>(true);
  const [followerOnlyProfileDecrypt, setFollowerOnlyProfileDecrypt] = useState<
    boolean[]
  >(Array.from({ length: 10 }, () => false));
  const [collectProfileLoading, setCollectProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [mirrorProfileLoading, setMirrorProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [reactProfileLoading, setReactProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [decryptProfileLoading, setDecryptProfileLoading] =
    useState<boolean>(false);
  const [profileCollections, setProfileCollections] = useState<Collection[]>(
    []
  );
  const [profileCollectionsLoading, setProfileCollectionsLoading] =
    useState<boolean>(false);

  const getProfile = async () => {
    setProfileLoading(true);
    let data;
    try {
      if (!lensProfile) {
        data = await profilePublications({
          profileId: profileId?.profile?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST", "COMMENT", "MIRROR"],
            limit: 10,
          },
          lensProfile
        );
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setProfileLoading(false);
        return;
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
                    ?.trim()
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

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreProfile(false);
      } else {
        setHasMoreProfile(true);
      }

      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.profile?.id,
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
              ? obj.mirrorOf.stats?.totalUpvotes
              : obj.stats?.totalUpvotes
          ),
          actionMirror: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats?.totalAmountOfMirrors
              : obj.stats?.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats?.totalAmountOfCollects
              : obj.stats?.totalAmountOfCollects
          ),
          actionComment: sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats?.totalAmountOfComments
              : obj.stats?.totalAmountOfComments
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
          profileId: profileId?.profile?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: profilePageData?.next,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST", "COMMENT", "MIRROR"],
            limit: 10,
            cursor: profilePageData?.next,
          },
          lensProfile
        );
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
                    ?.trim()
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
        setHasMoreProfile(false);
      }

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.profile?.id,
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
      setFollowerOnlyProfile([
        ...followerOnlyProfile,
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

  const getProfileDecrypt = async () => {
    setDecryptProfileLoading(true);
    let data;
    try {
      if (!lensProfile) {
        data = await profilePublications({
          profileId: profileId?.profile?.id,
          publicationTypes: ["POST"],
          metadata: {
            tags: {
              all: ["encrypted", "chromadin", "labyrinth"],
            },
          },
          limit: 10,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
          },
          lensProfile
        );
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setDecryptProfileLoading(false);
        return;
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
                    ?.trim()
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

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      } else {
        setHasMoreDecryptProfile(true);
      }

      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
          },
          lensProfile
        );
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
      }
      const hasCollectedArr = sortedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      setFollowerOnlyProfileDecrypt(
        sortedArr.map((obj: Publication) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setDecryptProfilePaginated(data?.data?.publications?.pageInfo));
      dispatch(setDecryptProfileFeedRedux(sortedArr));
      dispatch(
        setDecryptProfileFeedCount({
          actionLike: sortedArr.map(
            (obj: Publication) => obj.stats?.totalUpvotes
          ),
          actionMirror: sortedArr.map(
            (obj: Publication) => obj.stats?.totalAmountOfMirrors
          ),
          actionCollect: sortedArr.map(
            (obj: Publication) => obj.stats?.totalAmountOfCollects
          ),
          actionComment: sortedArr.map(
            (obj: Publication) => obj.stats?.totalAmountOfComments
          ),
          actionHasLiked: hasReactedArr ?? [],
          actionHasMirrored: hasMirroredArr ?? [],
          actionHasCollected: hasCollectedArr ?? [],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptProfileLoading(false);
  };

  const fetchMoreProfileDecrypt = async () => {
    let data;
    try {
      if (!decryptProfilePageData?.next) {
        setHasMoreDecryptProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await profilePublications({
          profileId: profileId?.profile?.id,
          publicationTypes: ["POST"],
          metadata: {
            tags: {
              all: ["encrypted", "chromadin", "labyrinth"],
            },
          },
          limit: 10,
          cursor: decryptProfilePageData?.next,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
            cursor: decryptProfilePageData?.next,
          },
          lensProfile
        );
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
                    ?.trim()
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
        setHasMoreDecryptProfile(false);
      }

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileId: profileId?.profile?.id,
            publicationTypes: ["POST"],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            limit: 10,
            cursor: decryptProfilePageData?.next,
          },
          lensProfile
        );
      }

      const hasCollectedArr = sortedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      dispatch(
        setDecryptProfileFeedCount({
          actionLike: [
            ...decryptProfileFeedCount.like,
            ...sortedArr.map((obj: Publication) => obj.stats.totalUpvotes),
          ],
          actionMirror: [
            ...decryptProfileFeedCount.mirror,
            ...sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfMirrors
            ),
          ],
          actionCollect: [
            ...decryptProfileFeedCount.collect,
            ...sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfCollects
            ),
          ],
          actionComment: [
            ...decryptProfileFeedCount.comment,
            ...sortedArr.map(
              (obj: Publication) => obj.stats.totalAmountOfComments
            ),
          ],
          actionHasLiked: [
            ...decryptProfileFeedCount.hasLiked,
            ...(hasReactedArr ?? []),
          ],
          actionHasMirrored: [
            ...decryptProfileFeedCount.hasMirrored,
            ...(hasMirroredArr ?? []),
          ],
          actionHasCollected: [
            ...decryptProfileFeedCount.hasCollected,
            ...(hasCollectedArr ?? []),
          ],
        })
      );
      setFollowerOnlyProfileDecrypt([
        ...followerOnlyProfileDecrypt,
        ...sortedArr.map((obj: Publication) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      dispatch(setDecryptProfilePaginated(data?.data?.publications?.pageInfo));
      dispatch(
        setDecryptProfileFeedRedux([...decryptProfileFeed, ...sortedArr])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router.asPath.includes("#chat") &&
      router.asPath.includes("&profile=") &&
      profileId?.profile
    ) {
      if (filterDecrypt) {
        getProfileDecrypt();
      } else {
        getProfile();
      }
    } else if (
      router.asPath.includes("#chat") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setProfile(undefined));
    }
  }, [auth, profileId.profile, router.asPath, filterDecrypt]);

  useEffect(() => {
    if (
      postSent &&
      !router.asPath.includes("&post=") &&
      router.asPath.includes("&profile=")
    ) {
      dispatch(setPostSent(false));
      getProfile();
    }
  }, [postSent]);

  const getSingleProfile = async () => {
    let prof, follow;
    try {
      if (lensProfile) {
        prof = await getOneProfileAuth({
          handle:
            router.asPath.split("&profile=")[1] === "lensprotocol"
              ? router.asPath.split("&profile=")[1]
              : router.asPath.split("&profile=")[1] + ".lens",
        });
      } else {
        prof = await getOneProfile({
          handle:
            router.asPath.split("&profile=")[1] === "lensprotocol"
              ? router.asPath.split("&profile=")[1]
              : router.asPath.split("&profile=")[1] + ".lens",
        });
      }

      if (lensProfile) {
        follow = await getFollowingAuth(
          { profileId: lensProfile },
          prof?.data?.profile?.id
        );
      }

      if (
        quickProfiles
          .map((profile) => profile.handle)
          .includes(router?.asPath?.split("profile=")[1] + ".lens")
      ) {
        await getProfileCollections(prof?.data?.profile);
      } else {
        setProfileCollections([]);
      }

      dispatch(
        setProfile({
          ...prof?.data?.profile,
          isFollowing: follow ? follow?.data?.profile?.isFollowing : false,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const setProfileScroll = (e: MouseEvent) => {
    dispatch(setProfileScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const setScrollPosDecryptProfile = (e: MouseEvent) => {
    dispatch(
      setDecryptProfileScrollPosRedux((e.target as HTMLDivElement)?.scrollTop)
    );
  };

  const getProfileCollections = async (prof: Profile) => {
    setProfileCollectionsLoading(true);
    try {
      const colls = await getCollectionsProfile(prof.ownedBy);

      if (colls?.data?.collectionMinteds?.length < 1 || !colls?.data) {
        setProfileCollectionsLoading(false);
        setProfileCollections([]);
        return;
      }

      const collections = await Promise.all(
        colls?.data?.collectionMinteds?.map(async (collection: Collection) => {
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

      const drops = await getAllDrops();

      if (drops?.data?.dropCreateds?.length > 0) {
        const fullDrops = await Promise.all(
          drops?.data?.dropCreateds?.map(async (drop: Drop) => {
            const dropjson = await fetchIPFSJSON(
              (drop as any)?.dropURI
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            return {
              ...drop,
              uri: {
                name: dropjson.name,
                image: dropjson.image,
              },
            };
          })
        );

        const validCollections = collections?.filter(
          (collection: Collection) => {
            const collectionDrops = [...fullDrops]?.filter((drop: any) =>
              drop?.collectionIds?.includes(collection?.collectionId)
            );
            return collectionDrops.length > 0;
          }
        );

        const newCols = validCollections.filter(
          (obj) => obj.collectionId !== "104"
        );

        setProfileCollections(newCols);
      } else {
        setProfileCollections([]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileCollectionsLoading(true);
  };

  useEffect(() => {
    if (
      router.asPath.includes("&profile=") &&
      router.asPath.includes("#chat") &&
      quickProfiles?.length > 0
    ) {
      getSingleProfile();
    }
  }, [router.asPath, auth, lensProfile, quickProfiles]);

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
    hasMoreDecryptProfile,
    setScrollPosDecryptProfile,
    scrollRefDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileCollectionsLoading,
    profileCollections,
  };
};

export default useProfileFeed;
