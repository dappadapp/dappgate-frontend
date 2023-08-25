import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { useState,useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { toast } from "react-toastify";
import OFTBridge from "../../config/abi/OFTBridge.json";
import { ethers } from "ethers";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  dlgateBridgeAmount: string;
};

const OFTBridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  dlgateBridgeAmount,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [adapterParam, setAdapterParams] = useState("");

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "estimateSendFee",
    args: [
      `${targetChain.layerzeroChainId}`,
      "0x0000000000000000000000000000000000000000",
      "1000000000000000000",
      false,
      adapterParam,
    ],
    chainId: sourceChain.chainId,
  });
  const gasEstimateDataArray = gasEstimateData as Array<bigint>;


  const { data: bridgeFeeData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "bridgeFee",
    chainId: sourceChain.chainId,
  });

  useEffect(() => {
    if (gasEstimateDataArray && account) {
      const adapterParams = ethers.solidityPacked(
        ["uint16", "uint", "uint", "address"],
        [2, 200000, BigInt(Number(dlgateBridgeAmount) * 10 ** 18), account]
      );
      setAdapterParams(adapterParams);
    }
  }, [
    gasEstimateDataArray,
    account,
    dlgateBridgeAmount,
    connectedChain?.nativeCurrency.symbol,

  ]);


  
  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "sendFrom",
    value:
      BigInt(((gasEstimateData as any)?.[0] as string) || "0") +
      BigInt((bridgeFeeData as string) || "0") +
      BigInt("10000000000000"),
    args: [
      account,
      targetChain.layerzeroChainId,
      account,
      ethers.parseEther(dlgateBridgeAmount?.toString() || "0"),
      account,
      "0x0000000000000000000000000000000000000000",
      "",
    ],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

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
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: dlgateBridgeAmount,
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

export default OFTBridgeButton;
