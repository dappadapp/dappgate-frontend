import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { toast } from "react-toastify";
import ONFTAbi from "../../config/abi/ONFT.json";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  inputTokenId: string;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  balanceOfRefetch: () => Promise<any>;
};

const BridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  inputTokenId,
  setLayerZeroTxHashes,
  setEstimatedGas,
  balanceOfRefetch,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [mintTxHash, setMintTxHash] = useState("");

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "estimateSendFee",
    args: [
      `${targetChain.layerzeroChainId}`,
      "0x0000000000000000000000000000000000000000",
      "1",
      false,
      "0x00010000000000000000000000000000000000000000000000000000000000055730", // version: 1, value: 400000
    ],
    chainId: sourceChain.chainId,
  });

  const { data: bridgeFeeData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "bridgeFee",
    chainId: sourceChain.chainId,
  });

  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "sendFrom",
    value:
      BigInt(((gasEstimateData as any)?.[0] as string) || "0") +
      BigInt((bridgeFeeData as string) || "0") +
      BigInt("10000000000000"),
    args: [
      account,
      targetChain.layerzeroChainId,
      account,
      inputTokenId,
      account,
      "0x0000000000000000000000000000000000000000",
      "0x00010000000000000000000000000000000000000000000000000000000000055730",
    ],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if ((gasEstimateData as any)?.[0] && bridgeFeeData) {
      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${(
          Number(
            ((gasEstimateData as bigint[])?.[0] * BigInt(coefficient)) /
              BigInt(1e18)
          ) /
            coefficient +
          Number(
            ((bridgeFeeData as bigint) * BigInt(coefficient)) / BigInt(1e18)
          ) /
            coefficient
        ).toFixed(Math.log10(coefficient))} ${
          connectedChain?.nativeCurrency.symbol
        }`
      );
    }
  }, [
    gasEstimateData,
    bridgeFeeData,
    setEstimatedGas,
    connectedChain?.nativeCurrency.symbol,
    mintTxHash,
  ]);

  const onBridge = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!sendFrom) {
      console.log("error", error?.message);
      if (
        error?.message.includes(
          "LzApp: destination chain is not a trusted source"
        )
      ) {
        return toast(
          "It looks like the bridge between these chains are closed."
        );
      }

      if (
        error?.message.includes("Execution reverted for an unknown reason.")
      ) {
        return toast(
          "It looks like the bridge between these chains are not supported by LayerZero."
        );
      }
      return toast(
        "Make sure you have enough gas and you're on the correct network."
      );
    }
    if (!isSuccess) {
      return toast("An unknown error occured.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await sendFrom();
      setMintTxHash(txHash);
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: inputTokenId,
          walletAddress: account,
          ref: "",
          type: "onft",
        });
      };
      postBridgeHistory();

      toast("Bridge transaction sent!");

      await waitForTransaction({
        hash: txHash,
      });

      balanceOfRefetch();
      toast("Bridge successful!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!inputTokenId || loading}
      className={
        "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
      }
    >
      Bridge
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      )}
    </button>
  );
};

export default BridgeButton;
