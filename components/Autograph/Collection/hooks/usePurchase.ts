import {
  ACCEPTED_TOKENS,
  CHROMADIN_MARKETPLACE_CONTRACT,
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
import { BigNumber, ethers } from "ethers";
import ChromadinMarketplaceABI from "./../../../../abis/ChromadinMarketplace.json";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setSuccess } from "@/redux/reducers/successSlice";
import { setError } from "@/redux/reducers/errorSlice";

const usePurchase = () => {
  const dispatch = useDispatch();
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoCollectionReducer
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const { address } = useAccount();
  const [approved, setApproved] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>();
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() ===
        autoDispatch.collection?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [posterSize, setPosterSize] = useState<number>(0);
  const [stickerPack, setStickerPack] = useState<number>(0);
  const [posterAmount, setPosterAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(autoDispatch.collection?.basePrices?.[0]) &&
      isFinite(Number(autoDispatch.collection?.basePrices?.[0]))
      ? Number(autoDispatch.collection?.basePrices?.[0]) /
          (autoDispatch.collection?.acceptedTokens?.[0] ===
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
    args: [address as `0x${string}`, CHROMADIN_MARKETPLACE_CONTRACT],
    // enabled: Boolean(address) || Boolean(approved),
  });

  const { config } = usePrepareContractWrite({
    address: ACCEPTED_TOKENS.filter(
      (token) => token[0].toLowerCase() === currency?.toLowerCase()
    )?.[0]?.[1] as `0x${string}`,
    abi: [
      currency === "MONA"
        ? {
            inputs: [
              { internalType: "address", name: "spender", type: "address" },
              { internalType: "uint256", name: "tokens", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          }
        : currency === "WMATIC"
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
      CHROMADIN_MARKETPLACE_CONTRACT,
      ethers.utils.parseEther(totalAmount.toString()),
    ],
    enabled: Boolean(!Number.isNaN(totalAmount)),
  });

  const { config: buyNFTConfig } = usePrepareContractWrite({
    address: CHROMADIN_MARKETPLACE_CONTRACT,
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

  const { writeAsync } = useContractWrite(config as any);
  const { writeAsync: buyNFTAsync } = useContractWrite(buyNFTConfig);

  const getTotalAmount = () => {
    let number;
    if (
      autoDispatch.collection?.acceptedTokens.find(
        (token) =>
          token ===
          ACCEPTED_TOKENS.find(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[1]!
      )
    ) {
      number = Number(
        autoDispatch.collection?.basePrices[
          autoDispatch.collection?.acceptedTokens.indexOf(
            ACCEPTED_TOKENS.find(
              (token) => token[0].toLowerCase() === currency?.toLowerCase()
            )?.[1]!
          )
        ]
      );
    } else {
      setCurrency(
        ACCEPTED_TOKENS.find(
          (token) =>
            token[1]?.toLowerCase() ===
            autoDispatch.collection?.acceptedTokens[0]?.toLowerCase()
        )?.[0]!
      );
      number = Number(
        autoDispatch.collection?.basePrices[
          autoDispatch.collection?.acceptedTokens.indexOf(
            ACCEPTED_TOKENS.find(
              (token) =>
                token[1].toLowerCase() ===
                autoDispatch.collection?.acceptedTokens[0].toLowerCase()
            )?.[1]?.toLowerCase()!
          )
        ]
      );
    }
    setTotalAmount(
      currency === "USDT"
        ? Number((number / 10 ** 6).toFixed(2))
        : Number((number / 10 ** 18).toFixed(2))
    );
  };

  const getTokenId = (): void => {
    if (
      !autoDispatch.collection?.soldTokens ||
      autoDispatch.collection?.soldTokens.length == 0
    ) {
      setTokenId(autoDispatch.collection?.tokenIds[0]);
    } else {
      for (let i = 0; i < autoDispatch.collection?.tokenIds.length; i++) {
        if (
          !autoDispatch.collection?.soldTokens.includes(
            autoDispatch.collection?.tokenIds[i]
          )
        ) {
          setTokenId(autoDispatch.collection?.tokenIds[i]);
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
    setCurrency(currency);
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
    if (autoDispatch.collection?.acceptedTokens) {
      getTotalAmount();
    }
  }, [currency, autoDispatch.collection]);

  useEffect(() => {
    if (address) {
      if (
        Number((data as BigNumber)?.toBigInt()?.toString()) /
          (currency === "USDT" ? 10 ** 6 : 10 ** 18) >=
        totalAmount
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  }, [address, totalAmount, autoDispatch.collection, data]);

  useEffect(() => {
    if (autoDispatch.collection) {
      getTokenId();
    }
    dispatch(
      setSuccess({
        actionOpen: false,
        actionMedia: autoDispatch.collection?.uri?.image,
        actionName: autoDispatch.collection?.name,
      })
    );
  }, [autoDispatch.collection]);

  return {
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

export default usePurchase;
