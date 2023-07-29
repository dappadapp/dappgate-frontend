import { Network } from "../utils/networks";
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
import { toast } from "react-toastify";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";
import OFTBridge from "../config/abi/OFTBridge.json";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  tokenIds: any;
  inputTokenId: string;
  setInputTokenId: any;
  setTokenIds: any;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  dlgateBridgeAmount: string;
};

const OFTBridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  tokenIds,
  inputTokenId,
  setInputTokenId,
  setTokenIds,
  setLayerZeroTxHashes,
  setEstimatedGas,
  dlgateBridgeAmount,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "estimateSendFee",
    args: [
      `${targetChain.layerzeroChainId}`,
      account,
      "1000000000000000000",
      false,
      "0x",
    ],
  });

  const gasEstimateDataArray = gasEstimateData as Array<bigint>;

  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "sendFrom",
    value:
      BigInt(
        gasEstimateDataArray ? gasEstimateDataArray[0] : "13717131402195452"
      ) + BigInt("10000000000000"),
    args: [
      account,
      targetChain.layerzeroChainId,
      account,
      1000000000000000000,
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      "",
    ],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if (gasEstimateDataArray) {
      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            (BigInt(gasEstimateDataArray[0] as bigint) * BigInt(coefficient)) /
              BigInt(1e18)
          ) / coefficient
        } ${connectedChain?.nativeCurrency.symbol}`
      );
    }
  }, [
    gasEstimateDataArray,
    setEstimatedGas,
    connectedChain?.nativeCurrency.symbol,
  ]);

  const onBridge = async () => {
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (!sendFrom) {
      console.log("error", error?.message);
      if (
        error?.message.includes(
          "LzApp: destination chain is not a trusted source"
        )
      ) {
        return alert(
          "It looks like the bridge between these chains are closed."
        );
      }

      if (
        error?.message.includes("Execution reverted for an unknown reason.")
      ) {
        return alert(
          "It looks like the bridge between these chains are not supported by LayerZero."
        );
      }
      return alert(
        "Make sure you have enough gas and you're on the correct network."
      );
    }
    if (!isSuccess) {
      return alert("An unknown error occured.");
    }
    if (tokenIds.length === 0) return alert("No tokenIds");
    try {
      setLoading(true);
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
          type: "oft",
        });
      };
      postBridgeHistory();

      toast("Bridge transaction sent!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!dlgateBridgeAmount || loading}
      className={
        " bg-blue-600 py-3 px-4 flex items-center text-xl mt-4 w-1/3 self-center justify-center text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg  relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
      }
    >
      Bridge
      {true && (
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

export default OFTBridgeButton;
