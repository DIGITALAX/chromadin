import {
  ACCEPTED_TOKENS,
  CHROMADIN_MARKETPLACE_CONTRACT,
  CHROMADIN_MARKETPLACE_CONTRACT_NEW,
} from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { waitForTransaction } from "@wagmi/core";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { ethers } from "ethers";
import ChromadinMarketplaceABI from "./../../../../abis/ChromadinMarketplace.json";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setSuccess } from "@/redux/reducers/successSlice";
import { setError } from "@/redux/reducers/errorSlice";

const useFulfillment = () => {
  const dispatch = useDispatch();
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const { address } = useAccount();
  const [approved, setApproved] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>();
  const [selectSize, setSelectSize] = useState<number>(0);
  const [baseColor, setBaseColor] = useState<number>(0);
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() === mainNFT?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0]
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [posterSize, setPosterSize] = useState<number>(0);
  const [stickerPack, setStickerPack] = useState<number>(0);
  const [posterAmount, setPosterAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(mainNFT?.price?.[0]) && isFinite(Number(mainNFT?.price?.[0]))
      ? Number(mainNFT?.price?.[0]) /
          (mainNFT?.acceptedTokens?.[0] ===
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
            ? 10 ** 6
            : 10 ** 18)
      : 0
  );

  const { data } = useContractRead({
    address: ACCEPTED_TOKENS.filter(
      (token) => token[0].toLowerCase() === currency?.toLowerCase()
    )?.[0]?.[1] as `0x${string}`,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      mainNFT?.contractType === "primary"
        ? CHROMADIN_MARKETPLACE_CONTRACT
        : CHROMADIN_MARKETPLACE_CONTRACT_NEW,
    ],
    // enabled: Boolean(address) || Boolean(approved),
  });

  const { config } = usePrepareContractWrite({
    address: ACCEPTED_TOKENS.filter(
      (token) => token[0].toLowerCase() === currency?.toLowerCase()
    )?.[0]?.[1] as `0x${string}`,
    abi: [
      ACCEPTED_TOKENS.filter(
        (token) => token[0].toLowerCase() === currency?.toLowerCase()
      )?.[0]?.[1] === "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
        ? {
            constant: false,
            inputs: [
              { name: "guy", type: "address" },
              { name: "wad", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          }
        : {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
    ],
    functionName: "approve",
    args: [
      mainNFT?.contractType === "primary"
        ? CHROMADIN_MARKETPLACE_CONTRACT
        : CHROMADIN_MARKETPLACE_CONTRACT_NEW,
      ethers.utils.parseEther(totalAmount.toString()),
    ],
    enabled: Boolean(!Number.isNaN(totalAmount)),
  });

  const { config: buyNFTConfig } = usePrepareContractWrite({
    address:
      mainNFT?.contractType === "primary"
        ? CHROMADIN_MARKETPLACE_CONTRACT
        : CHROMADIN_MARKETPLACE_CONTRACT_NEW,
    abi: ChromadinMarketplaceABI,
    args: [
      [Number(tokenId)],
      ACCEPTED_TOKENS.filter(
        (token) => token[0].toLowerCase() === currency?.toLowerCase()
      )?.[0]?.[1] as `0x${string}`,
    ],
    functionName: "buyTokens",
    enabled: Boolean(tokenId),
  });

  const { writeAsync } = useContractWrite(config);
  const { writeAsync: buyNFTAsync } = useContractWrite(buyNFTConfig);

  const getTotalAmount = () => {
    let number;
    if (
      mainNFT?.acceptedTokens.find(
        (token) =>
          token ===
          ACCEPTED_TOKENS.find(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[1]!
      )
    ) {
      number =
        Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              ACCEPTED_TOKENS.find(
                (token) => token[0].toLowerCase() === currency?.toLowerCase()
              )?.[1]!
            )
          ]
        ) / (currency === "USDT" ? 10 ** 6 : 10 ** 18);
    } else {
      setCurrency(
        ACCEPTED_TOKENS.find(
          (token) =>
            token[0]?.toLowerCase() ===
            mainNFT?.acceptedTokens[0]?.toLowerCase()
        )?.[0]!
      );
      number =
        Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              ACCEPTED_TOKENS.find(
                (token) =>
                  token[1].toLowerCase() ===
                  mainNFT?.acceptedTokens[0].toLowerCase()
              )?.[1]?.toLowerCase()!
            )
          ]
        ) / (currency === "USDT" ? 10 ** 6 : 10 ** 18);
    }
    setTotalAmount(number);
  };

  const getTokenId = (): void => {
    if (!mainNFT?.tokensSold || mainNFT?.tokensSold.length == 0) {
      setTokenId(mainNFT?.tokenIds[0]);
    } else {
      for (let i = 0; i < mainNFT?.tokenIds.length; i++) {
        if (!mainNFT?.tokensSold.includes(mainNFT?.tokenIds[i])) {
          setTokenId(mainNFT?.tokenIds[i]);
        }
      }
    }
  };

  const approveSpend = async () => {
    setPurchaseLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === 1) {
        setApproved(true);
      }
    } catch (err: any) {
      setPurchaseLoading(false);
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const buyNFT = async (): Promise<void> => {
    if (!tokenId) return;
    setPurchaseLoading(true);
    try {
      const tx = await buyNFTAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
      });
      dispatch(
        setSuccess({
          actionOpen: true,
          actionMedia: success.media,
          actionName: success.name,
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Purchase Successful",
          })
        );
      }, 5000);
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 8000);
    } catch (err: any) {
      setPurchaseLoading(false);
      if (!err.message.includes("User rejected request")) {
        dispatch(setError(true));
      }
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  useEffect(() => {
    if (mainNFT?.acceptedTokens) {
      getTotalAmount();
    }
  }, [currency, mainNFT]);

  useEffect(() => {
    if (address) {
      if (
        Number(data?.toBigInt()?.toString()) /
          (currency === "USDT" ? 10 ** 6 : 10 ** 18) >=
        totalAmount
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  }, [address, totalAmount, mainNFT, data]);

  useEffect(() => {
    if (mainNFT) {
      getTokenId();
    }
    dispatch(
      setSuccess({
        actionOpen: false,
        actionMedia: mainNFT?.media,
        actionName: mainNFT?.name,
      })
    );
  }, [mainNFT]);

  return {
    baseColor,
    selectSize,
    setBaseColor,
    setSelectSize,
    currency,
    setCurrency,
    stickerPack,
    setStickerPack,
    posterSize,
    setPosterSize,
    posterAmount,
    setPosterAmount,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  };
};

export default useFulfillment;
