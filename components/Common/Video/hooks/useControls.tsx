import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { UseControlsResults } from "../types/controls.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import { mirror, mirrorDispatcher } from "@/graphql/lens/mutations/mirror";
import checkDispatcher from "@/lib/helpers/checkDispatcher";
import collect from "@/graphql/lens/mutations/collect";
import useInteractions from "../../Interactions/hooks/useInteractions";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { ApprovedAllowanceAmount } from "@/components/Home/types/lens.types";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkApproved from "@/lib/helpers/checkApproved";
import { setPostCollectValues } from "@/redux/reducers/postCollectSlice";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import ReactPlayer from "react-player";
import { waitForTransaction } from "@wagmi/core";
import { setReactId } from "@/redux/reducers/reactIdSlice";
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";
import { setVideoSync } from "@/redux/reducers/videoSyncSlice";
import { setSeek } from "@/redux/reducers/seekSecondSlice";

const useControls = (): UseControlsResults => {
  const { commentors } = useInteractions();
  const streamRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fullVideoRef = useRef<ReactPlayer>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [likeCommentLoading, setLikeCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );

  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "mirrorWithSig",
    enabled: Boolean(mirrorArgs),
    args: [mirrorArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: collectConfig, isSuccess: isSuccessCollect } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "collectWithSig",
      enabled: Boolean(collectArgs),
      args: [collectArgs],
    });
  const { writeAsync: collectWriteAsync } = useContractWrite(collectConfig);

  const handleHeart = () => {
    dispatch(
      setVideoSync({
        actionHeart: true,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: videoSync.likedArray,
        actionMirroredArray: videoSync.mirroredArray,
        actionCollectedArray: videoSync.collectedArray,
        actionVideosLoading: videoSync.videosLoading,
      })
    );
    setTimeout(() => {
      dispatch(
        setVideoSync({
          actionHeart: false,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: videoSync.isPlaying,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
    }, 3000);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  const likeVideo = async (id?: string): Promise<void> => {
    let index: any, react: any;
    if (!id) {
      setLikeLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors?.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
      setLikeLoading(true);
    }
    if (!profileId && !authStatus) {
      setLikeLoading(false);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      react = await addReaction({
        profileId: profileId,
        reaction: "UPVOTE",
        publicationId: id ? id : mainVideo.id,
      });
    } catch (err: any) {
      setLikeLoading(false);
      console.error(err.message);
    }
    if (!id) {
      setLikeLoading(false);
    } else {
      setLikeCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Successfully Indexed",
      })
    );
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 4000);
  };

  const mirrorVideo = async (id?: string): Promise<void> => {
    let index: any;

    if (!id) {
      setMirrorLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profileId && !authStatus) {
      setMirrorLoading(false);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: profileId,
          publicationId: id ? id : mainVideo.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            mirrorPost?.data?.createMirrorViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        mirrorPost = await mirror({
          profileId: profileId,
          publicationId: id ? id : mainVideo.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: mirrorPost?.data?.createMirrorTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);
          const mirrorArgs = {
            profileId: typedData.value.profileId,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setMirrorArgs(mirrorArgs);
        } else {
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: "Indexing Interaction",
            })
          );
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    if (!id) {
      setMirrorLoading(false);
    } else {
      setMirrorCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err: any) {
      setMirrorLoading(false);
      console.error(err.message);
    }
    setMirrorLoading(false);
  };

  const collectVideo = async (id?: string): Promise<void> => {
    let index: any;
    if (!id) {
      setCollectLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profileId && !authStatus) {
      setCollectLoading(false);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      const collectPost = await collect({
        publicationId: id ? id : mainVideo.id,
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: collectPost?.data?.createCollectTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const collectArgs = {
          collector: address,
          profileId: typedData.value.profileId,
          pubId: typedData.value.pubId,
          data: typedData.value.data,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        setCollectArgs(collectArgs);
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
        }, 7000);
      }
    } catch (err: any) {
      setCollectLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      console.error(err.message);
    }
    if (!id) {
      setCollectLoading(false);
    } else {
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
    }
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await collectWriteAsync?.();
      dispatch(
        setPurchase({
          actionOpen: false,
          actionId: "",
          actionIndex: undefined,
        })
      );
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err: any) {
      console.error(err.message);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      setCollectLoading(false);
    }
    setCollectLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      mirrorWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessCollect) {
      collectWrite();
    }
  }, [isSuccessCollect]);

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (profileId) {
        const { data } = await getPublicationAuth(
          {
            publicationId: purchase.id,
          },
          profileId
        );
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: purchase.id,
        });
        pubData = data;
      }
      const collectModule = pubData?.publication?.collectModule;

      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        address,
        profileId
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionCanCollect: pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  const { config: approvalConfig } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync, isSuccess: approvalSuccess } =
    useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await pollUntilIndexed(res?.transactionHash as string, false);
      await getCollectInfo();
    } catch (err: any) {
      setApprovalLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setApprovalLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    // setCurrentTime(seekPosition * duration);
    dispatch(setSeek(seekPosition));
    streamRef.current?.seekTo(seekPosition, "fraction");
  };

  useEffect(() => {
    if (seek !== 0) {
      fullVideoRef?.current?.seekTo(seek, "fraction");
    }
  }, [seek]);

  useEffect(() => {
    if (fullScreenVideo.value) {
      dispatch(
        setVideoSync({
          actionHeart: videoSync.heart,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: false,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
      streamRef?.current?.seekTo(videoSync.currentTime, "seconds");
      fullVideoRef?.current?.seekTo(videoSync.currentTime, "seconds");
      setTimeout(() => {
        dispatch(
          setVideoSync({
            actionHeart: videoSync.heart,
            actionDuration: videoSync.duration,
            actionCurrentTime: videoSync.currentTime,
            actionIsPlaying: true,
            actionLikedArray: videoSync.likedArray,
            actionMirroredArray: videoSync.mirroredArray,
            actionCollectedArray: videoSync.collectedArray,
            actionVideosLoading: videoSync.videosLoading,
          })
        );
      }, 1000);
    }
  }, [fullScreenVideo.value]);

  useEffect(() => {
    if (purchase.open) {
      getCollectInfo();
    }
  }, [purchase.open]);

  return {
    streamRef,
    formatTime,
    volume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirrorLoading,
    collectLoading,
    likeLoading,
    collectVideo,
    mirrorVideo,
    likeVideo,
    mainVideo,
    authStatus,
    profileId,
    mirrorCommentLoading,
    likeCommentLoading,
    collectCommentLoading,
    approvalLoading,
    collectInfoLoading,
    approveCurrency,
    handleVolumeChange,
    wrapperRef,
    progressRef,
    handleSeek,
    fullVideoRef,
  };
};

export default useControls;
