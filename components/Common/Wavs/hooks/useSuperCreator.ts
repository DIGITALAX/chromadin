import createFollowTypedData from "@/graphql/lens/mutations/follow";
import { LENS_CREATORS, LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import createFollowModule from "@/lib/helpers/createFollowModule";
import splitSignature from "@/lib/helpers/splitSignature";
import { setModal } from "@/redux/reducers/modalSlice";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import { FollowArgs } from "../types/wavs.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import omit from "@/lib/helpers/omit";
import broadcast from "@/graphql/lens/mutations/broadcast";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { RootState } from "@/redux/store";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";
import { setRainRedux } from "@/redux/reducers/rainSlice";

const useSuperCreator = () => {
  const [superCreatorLoading, setSuperCreatorLoading] =
    useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<any>();
  const dispatch = useDispatch();
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<MutableRefObject<number | null>>(null);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const rain = useSelector((state: RootState) => state.app.rainReducer.value);

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "followWithSig",
    enabled: Boolean(followArgs),
    args: [followArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      dispatch(setLensProfile(profile?.data?.defaultProfile));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const followSuper = async () => {
    setSuperCreatorLoading(true);

    let followers = [];

    for (let i = 0; i < LENS_CREATORS.length - 1; i++) {
      const followModule = createFollowModule(
        quickProfiles[i]?.followModule?.type as any,
        (quickProfiles[i]?.followModule as any)?.amount?.value,
        (quickProfiles[i]?.followModule as any)?.amount?.asset?.address,
        quickProfiles[i].id
      );

      followers.push({
        profile: LENS_CREATORS[i],
        followModule,
      });
    }

    try {
      const response = await createFollowTypedData({
        follow: followers,
      });

      const typedData: any = response?.data?.createFollowTypedData?.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: response?.data?.createFollowTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const followArgs: FollowArgs = {
          follower: address as string,
          profileIds: typedData?.value?.profileIds,
          datas: typedData?.value?.datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData?.value?.deadline,
          },
        };
        setFollowArgs(followArgs);
      } else {
        setSuperCreatorLoading(false);
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
          await refetchProfile();
        }, 7000);
      }
    } catch (err: any) {
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Follow.",
          })
        );
      }
      console.error(err.message);
    }
    setSuperCreatorLoading(false);
  };

  const followWrite = async (): Promise<void> => {
    setSuperCreatorLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
      await refetchProfile();
    } catch (err: any) {
      console.error(err.message);
      dispatch(setIndexModal("Unsuccessful. Please Try Again."));
    }
    setSuperCreatorLoading(false);
    dispatch(setRainRedux(true));
    setTimeout(() => {
      dispatch(setRainRedux(false));
      dispatch(setSuperFollow(false));
    }, 4000);
  };

  useEffect(() => {
    if (rain) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const width = window.innerWidth;
      const height = window.innerHeight;
      const particles: any[] = [];

      if (canvas && context) {
        canvas.width = width;
        canvas.height = height;

        class Particle {
          constructor() {
            (this as any).x = Math.random() * width;
            (this as any).y = 0;
            (this as any).speed = 3 + Math.random() * 7;
            (this as any).length = 30 + Math.random() * 60;
            (this as any).opacity = Math.random();
          }

          update() {
            (this as any).y += (this as any).speed;
            if ((this as any).y > height) {
              (this as any).y = 0;
              (this as any).x = Math.random() * width;
            }
          }

          draw() {
            context?.beginPath();
            context?.moveTo((this as any).x, (this as any).y);
            context?.lineTo(
              (this as any).x,
              (this as any).y + (this as any).length
            );
            context!.strokeStyle = `rgba(255, 215, 0, ${
              (this as any).opacity
            })`;
            context?.stroke();
          }
        }
        const createParticles = (count: number) => {
          for (let i = 0; i < count; i++) {
            particles.push(new Particle());
          }
        };

        const updateParticles = () => {
          context.clearRect(0, 0, width, height);
          particles.forEach((particle) => {
            particle.update();
            particle.draw();
          });

          (animationRef.current as any) =
            requestAnimationFrame(updateParticles);
        };

        createParticles(200);

        (animationRef.current as any) = requestAnimationFrame(updateParticles);

        const fadeOut = () => {
          context.fillStyle = "rgba(0, 0, 0, 0.1)";
          context.fillRect(0, 0, width, height);
          setTimeout(() => {
            cancelAnimationFrame(animationRef.current as any);
          }, 4000);
        };

        fadeOut();

        return () => {
          cancelAnimationFrame(animationRef.current as any);
        };
      }
    }
  }, [rain]);

  useEffect(() => {
    if (isSuccess) {
      followWrite();
    }
  }, [isSuccess]);

  return { superCreatorLoading, followSuper, canvasRef };
};

export default useSuperCreator;
