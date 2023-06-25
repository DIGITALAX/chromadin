import { Publication } from "@/components/Home/types/lens.types";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSigner, useAccount } from "wagmi";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import { Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDecrypt } from "@/redux/reducers/decryptSlice";

const useAutoProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autographReducer
  );
  const auth = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );

  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [profileFeedCount, setProfileFeedCount] = useState<{
    like: number[];
    mirror: number[];
    collect: number[];
    comment: number[];
    hasLiked: boolean[];
    hasMirrored: boolean[];
    hasCollected: boolean[];
  }>({
    like: [],
    mirror: [],
    collect: [],
    comment: [],
    hasLiked: [],
    hasMirrored: [],
    hasCollected: [],
  });
  const [decryptLoading, setDecryptLoading] = useState<boolean>(false);
  const [profileFeed, setProfileFeed] = useState<Publication[]>([]);
  const [profilePageData, setProfilePageData] = useState<any>();
  const [decryptProfileFeedCount, setDecryptProfileFeedCount] = useState<{
    like: number[];
    mirror: number[];
    collect: number[];
    comment: number[];
    hasLiked: boolean[];
    hasMirrored: boolean[];
    hasCollected: boolean[];
  }>({
    like: [],
    mirror: [],
    collect: [],
    comment: [],
    hasLiked: [],
    hasMirrored: [],
    hasCollected: [],
  });
  const [decryptProfileFeed, setDecryptProfileFeed] = useState<Publication[]>(
    []
  );
  const [decryptProfilePageData, setDecryptProfilePageData] = useState<any>();
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

  const getProfile = async () => {
    setProfileLoading(true);
    let data;
    try {
      if (!lensProfile) {
        data = await profilePublications({
          profileId: autoDispatch?.profile?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: autoDispatch?.profile?.id,
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

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreProfile(false);
      } else {
        setHasMoreProfile(true);
      }

      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: autoDispatch?.profile?.id,
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
      setProfilePageData(data?.data?.publications?.pageInfo);
      setProfileFeed(sortedArr);
      setProfileFeedCount({
        like: sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.stats?.totalUpvotes
            : obj.stats?.totalUpvotes
        ),
        mirror: sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.stats?.totalAmountOfMirrors
            : obj.stats?.totalAmountOfMirrors
        ),
        collect: sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.stats?.totalAmountOfCollects
            : obj.stats?.totalAmountOfCollects
        ),
        comment: sortedArr.map((obj: Publication) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOf.stats?.totalAmountOfComments
            : obj.stats?.totalAmountOfComments
        ),
        hasLiked: hasReactedArr ?? [],
        hasMirrored: hasMirroredArr ?? [],
        hasCollected: hasCollectedArr ?? [],
      });
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
          profileId: autoDispatch?.profile?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 10,
          cursor: profilePageData?.next,
        });
      } else {
        data = await profilePublicationsAuth(
          {
            profileId: autoDispatch?.profile?.id,
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

      if (sortedArr?.length < 10) {
        setHasMoreProfile(false);
      }

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileId: autoDispatch?.profile?.id,
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
      setProfileFeedCount({
        like: [
          ...profileFeedCount?.like,
          ...sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalUpvotes
              : obj.stats.totalUpvotes
          ),
        ],
        mirror: [
          ...profileFeedCount?.mirror,
          ...sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfMirrors
              : obj.stats.totalAmountOfMirrors
          ),
        ],
        collect: [
          ...profileFeedCount?.collect,
          ...sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfCollects
              : obj.stats.totalAmountOfCollects
          ),
        ],
        comment: [
          ...profileFeedCount?.comment,
          ...sortedArr.map((obj: Publication) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOf.stats.totalAmountOfComments
              : obj.stats.totalAmountOfComments
          ),
        ],
        hasLiked: [...profileFeedCount?.hasLiked, ...(hasReactedArr ?? [])],
        hasMirrored: [
          ...profileFeedCount?.hasMirrored,
          ...(hasMirroredArr ?? []),
        ],
        hasCollected: [
          ...profileFeedCount?.hasCollected,
          ...(hasCollectedArr ?? []),
        ],
      });
      setProfilePageData(data?.data?.publications?.pageInfo);
      setProfileFeed([...profileFeed, ...sortedArr]);
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
          profileId: autoDispatch?.profile?.id,
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
            profileId: autoDispatch?.profile?.id,
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

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      } else {
        setHasMoreDecryptProfile(true);
      }

      let hasReactedArr, hasMirroredArr;
      if (lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: autoDispatch?.profile?.id,
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
      setDecryptProfilePageData(data?.data?.publications?.pageInfo);
      setDecryptProfileFeed(sortedArr);
      setDecryptProfileFeedCount({
        like: sortedArr.map((obj: Publication) => obj.stats?.totalUpvotes),
        mirror: sortedArr.map(
          (obj: Publication) => obj.stats?.totalAmountOfMirrors
        ),
        collect: sortedArr.map(
          (obj: Publication) => obj.stats?.totalAmountOfCollects
        ),
        comment: sortedArr.map(
          (obj: Publication) => obj.stats?.totalAmountOfComments
        ),
        hasLiked: hasReactedArr ?? [],
        hasMirrored: hasMirroredArr ?? [],
        hasCollected: hasCollectedArr ?? [],
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptProfileLoading(false);
  };

  const decryptPost = async (post: Publication) => {
    setDecryptLoading(true);
    try {
      let newPost: any;
      if (
        signer &&
        address &&
        (post as any).canDecrypt &&
        (post as any).canDecrypt.result
      ) {
        const sdk = await LensGatedSDK.create({
          provider: new Web3Provider(window?.ethereum as any),
          signer: signer as Signer,
          env: LensEnvironment.Polygon,
        });

        try {
          const data = await fetchIPFSJSON(
            post.onChainContentURI
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );
          const { decrypted } = await sdk.gated.decryptMetadata(data);
          if (decrypted) {
            newPost = {
              ...post,
              decrypted,
              gated: false,
            };
          } else {
            newPost = {
              ...post,
              gated: true,
            };
          }
        } catch (err: any) {
          console.error(err.message);
          newPost = {
            ...post,
            gated: true,
          };
        }

        const newProfileFeed = [...profileFeed]?.map((item) =>
          item?.id === post?.id ? newPost : item
        );
        const newDecryptFeed = [...decryptProfileFeed]?.map((item) =>
          item?.id === post?.id ? newPost : item
        );

        setProfileFeed(newProfileFeed);
        setDecryptProfileFeed(newDecryptFeed);
      } else {
        dispatch(
          setDecrypt({
            actionOpen: true,
            actionCollections: (post?.__typename === "Mirror"
              ? post?.mirrorOf?.metadata?.description
              : post?.metadata?.description
            )
              ?.split("gate.")[1]
              ?.split("are ready to collect")[0]
              .split(",")
              .map((word: string) => word.trim()),
            actionName: post?.profile?.ownedBy,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading(false);
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
          profileId: autoDispatch?.profile?.id,
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
            profileId: autoDispatch?.profile?.id,
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

      if (sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      }

      let hasMirroredArr, hasReactedArr;
      if (lensProfile) {
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        hasReactedArr = await checkPostReactions(
          {
            profileId: autoDispatch?.profile?.id,
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
      setDecryptProfileFeedCount({
        like: [
          ...decryptProfileFeedCount?.like,
          ...sortedArr.map((obj: Publication) => obj.stats.totalUpvotes),
        ],
        mirror: [
          ...decryptProfileFeedCount?.mirror,
          ...sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfMirrors
          ),
        ],
        collect: [
          ...decryptProfileFeedCount?.collect,
          ...sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfCollects
          ),
        ],
        comment: [
          ...decryptProfileFeedCount?.comment,
          ...sortedArr.map(
            (obj: Publication) => obj.stats.totalAmountOfComments
          ),
        ],
        hasLiked: [
          ...decryptProfileFeedCount?.hasLiked,
          ...(hasReactedArr ?? []),
        ],
        hasMirrored: [
          ...decryptProfileFeedCount?.hasMirrored,
          ...(hasMirroredArr ?? []),
        ],
        hasCollected: [
          ...decryptProfileFeedCount?.hasCollected,
          ...(hasCollectedArr ?? []),
        ],
      });

      setFollowerOnlyProfileDecrypt([
        ...followerOnlyProfileDecrypt,
        ...sortedArr.map((obj: Publication) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      setDecryptProfilePageData(data?.data?.publications?.pageInfo);

      setDecryptProfileFeed([...decryptProfileFeed, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router.asPath.includes("autograph") &&
      !router.asPath.includes("collection") &&
      !router.asPath.includes("drop") &&
      autoDispatch?.profile?.id
    ) {
      getProfile();
      getProfileDecrypt();
    }
  }, [auth, autoDispatch?.profile?.id, router.asPath]);

  return {
    hasMoreProfile,
    fetchMoreProfile,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    hasMoreDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileFeed,
    profileFeedCount,
    decryptProfileFeed,
    decryptProfileFeedCount,
    decryptPost,
    decryptLoading,
  };
};

export default useAutoProfile;
