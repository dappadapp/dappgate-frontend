import { Network } from "@/app/page";
import axios from "axios";
import React, { useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { toast } from "react-toastify";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  tokenIds: any;
  inputTokenId: string;
  setInputTokenId: any;
  setTokenIds: any;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
};

const OFTClaimButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  tokenIds,
  inputTokenId,
  setInputTokenId,
  setTokenIds,
  setLayerZeroTxHashes,
  setEstimatedGas,
}) => {
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "estimateFees",
    args: [`${targetChain.layerzeroChainId}`, inputTokenId],
  });

  const { config: sendFromConfig } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "crossChain",
    value:
      BigInt((gasEstimateData as string) || "13717131402195452") +
      BigInt("10000000000000"),
    args: [
      targetChain.layerzeroChainId,
      inputTokenId || tokenIds?.[sourceChain.chainId]?.[account as string]?.[0],
    ],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if (gasEstimateData) {
      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            ((gasEstimateData as bigint) * BigInt(coefficient)) / BigInt(1e18)
          ) / coefficient
        } ${connectedChain?.nativeCurrency.symbol}`
      );
    }
  }, [gasEstimateData, setEstimatedGas, connectedChain?.nativeCurrency.symbol]);

  const onBridge = async () => {
    if (!sendFrom || !account)
      return alert(
        "Make sure you have enough gas and you're on the correct network."
      );
    if (tokenIds.length === 0) return alert("No tokenIds");
    try {
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await sendFrom();
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);
      setTokenIds((prev: any) => {
        const newArray = prev?.[sourceChain.chainId]?.[account as string]
          ? [...prev?.[sourceChain.chainId]?.[account as string]]
              .slice(1)
              .filter((value, index, self) => self.indexOf(value) === index)
          : [];
        const tokenIdData = {
          ...prev,
          [sourceChain.chainId]: {
            ...prev?.[sourceChain.chainId],
            [account as string]: newArray,
          },
        };
        localStorage.setItem("tokenIds", JSON.stringify(tokenIdData));
        return tokenIdData;
      });
      setInputTokenId(tokenIds[sourceChain.chainId][account][1] || "");

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: tokenIds,
          walletAddress: account,
          ref: "",
        });
      };
      postBridgeHistory();

      toast("Bridge transaction sent!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!inputTokenId}
      className={
        "bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 transition-all disabled:bg-red-500/20"
      }
    >
      Bridge
    </button>
  );
};

export default OFTClaimButton;
