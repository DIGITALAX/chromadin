import { useConnectModal } from "@rainbow-me/rainbowkit";
import { UseConnectResults } from "../types/sidebar.types";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "@/redux/reducers/authStatusSlice";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "@/lib/lens/utils";
import authenticate from "@/graphql/lens/mutations/authenticate";
import { useEffect, useState } from "react";
import generateChallenge from "@/graphql/lens/queries/generateChallenge";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";
import { useContractRead } from "wagmi";
import { CHROMADIN_ACCESS_CONTROLS } from "@/lib/constants";
import { setIsCreator } from "@/redux/reducers/isCreatorSlice";
import { useRouter } from "next/router";

const useConnect = (): UseConnectResults => {
  const { openConnectModal } = useConnectModal();
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const router = useRouter();

  const { data } = useContractRead({
    address: CHROMADIN_ACCESS_CONTROLS,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_writer",
            type: "address",
          },
        ],
        name: "isWriter",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "isWriter",
    args: [address as `0x${string}`],
    enabled: connected,
  });

  const { signMessageAsync } = useSignMessage({
    onError() {
      dispatch(setAuthStatus(false));
    },
  });

  const handleConnect = (): void => {
    openConnectModal && openConnectModal();
    dispatch(
      setNoHandle({
        actionValue: false,
        actionMessage: "",
      })
    );
  };

  const handleLensSignIn = async (): Promise<void> => {
    setSignInLoading(true);
    try {
      const challengeResponse = await generateChallenge(address);
      const signature = await signMessageAsync({
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        setAddress(address as string);
        const profile = await getDefaultProfile(address?.toLowerCase());

        if (profile?.data?.defaultProfile) {
          dispatch(
            setNoHandle({
              actionValue: false,
              actionMessage: "",
            })
          );
          dispatch(setLensProfile(profile?.data?.defaultProfile));
          dispatch(setAuthStatus(true));
        } else {
          dispatch(
            setNoHandle({
              actionValue: true,
              actionMessage:
                "Own Your Digital Roots. Claim A Lens Handle to Sign In & Collect.",
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setLensProfile(profile?.data?.defaultProfile));
        dispatch(setAuthStatus(true));
      } else {
        dispatch(setAuthStatus(false));
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      setConnected(isConnected);
      const newAddress = getAddress();

      if (
        (newAddress && newAddress?.replace(/^"|"$/g, "") === address) ||
        (!newAddress && address)
      ) {
        const token = getAuthenticationToken();
        setAddress(address as string);
        if (isConnected && !token) {
          dispatch(setLensProfile(undefined));
          removeAuthenticationToken();
        } else if (isConnected && token) {
          if (isAuthExpired(token?.exp)) {
            const refreshedAccessToken = await refreshAuth(); // await the refreshAuth promise
            if (!refreshedAccessToken) {
              dispatch(setLensProfile(undefined));
              removeAuthenticationToken();
            }
          }
          await handleRefreshProfile(); // await the handleRefreshProfile promise
        }
      } else if (isConnected && address !== newAddress) {
        dispatch(setLensProfile(undefined));
        removeAuthenticationToken();
      }
    };

    handleAuthentication(); // Call the inner async function
  }, [isConnected]);

  useEffect(() => {
    if (data && router) {
      dispatch(setIsCreator(data as boolean));
    }
  }, [data]);

  return {
    handleConnect,
    handleLensSignIn,
    handleRefreshProfile,
    connected,
    signInLoading,
  };
};

export default useConnect;
