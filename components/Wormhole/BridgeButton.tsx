import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
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
import ONFTAbi from "../../config/abi/ZKONFTBridge.json";
import { ethers } from "ethers";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  tokenId: any;
  refetchUserNftBalance?: any;
  setTokenIds?: any;
  tokenIds?: any;
};

const WormholeBridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenId,
  refetchUserNftBalance,
  setTokenIds,
  tokenIds,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [gas, setGas] = useState("");

  const { data: gasEstimateData, refetch } = useContractRead({
    address: sourceChain.zkNFTContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "estimateGasBridgeFee",
    args: [
      `${sourceChain.layerzeroChainId}`,
      false,
      "0x00010000000000000000000000000000000000000000000000000000000000061a80", // version: 1, value: 400000
    ],
    chainId: sourceChain.chainId,
  });

  useEffect(() => {
    refetch();
  }, [tokenId, sourceChain, targetChain, gasEstimateData]);

  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.zkNFTContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "sendFrom",
    value: gasEstimateData
      ? BigInt((gasEstimateData as any)?.[0] as string) +
        (sourceChain.symbol === "ETH"
          ? BigInt("555555555")
          : BigInt("1210555555555555555"))
      : BigInt("0"),
    args: [
      account,
      targetChain.layerzeroChainId,
      account,
      tokenIds,
      account,
      "0x0000000000000000000000000000000000000000",
      "0x00010000000000000000000000000000000000000000000000000000000000061a80",
    ],
  });

  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if ((gasEstimateData as any)?.[0]) {
      const coefficient = connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${(
          Number(
            ((gasEstimateData as bigint[])?.[0] * BigInt(coefficient)) / BigInt(1e18)
          ) / coefficient
        ).toFixed(Math.log10(coefficient))} ${connectedChain?.nativeCurrency.symbol}`
      );

      setGas(
        `${(
          Number(
            ((gasEstimateData as bigint[])?.[0] * BigInt(coefficient)) / BigInt(1e18)
          ) / coefficient
        ).toFixed(Math.log10(coefficient))}`
      );
    }
  }, [gasEstimateData, setEstimatedGas, connectedChain?.nativeCurrency.symbol]);

  const onBridge = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }

    if (!sendFrom) {
      console.log("error", error?.message);

      if (error?.message.includes("ZkBridgeOracle:Unsupported dest chain")) {
        return toast(
          "It looks like the bridge between these chains are not supported by PolyHedra."
        );
      }
      if (error?.message.includes("LzApp: destination chain is not a trusted source")) {
        return toast("It looks like the bridge between these chains are closed.");
      }

      if (error?.message.includes("Execution reverted for an unknown reason.")) {
        return toast(
          "It looks like the bridge between these chains are not supported by LayerZero."
        );
      }
      return toast(
        `Make sure you have more than ${sourceChain.symbol} and you're on the correct network.`,
        { autoClose: 6000 }
      );
    }
    if (!isSuccess) {
      return toast("Temporarly closed for maintenance.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await sendFrom();
      const data = await waitForTransaction({
        hash: txHash,
      });
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
      });

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: tokenId,
          walletAddress: account,
          ref: "",
          type: "onft",
        });
      };
      postBridgeHistory();

      toast("Bridge transaction sent!");
      refetchUserNftBalance();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!tokenId || loading}
      className={
        "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed mt-1"
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

export default WormholeBridgeButton;
