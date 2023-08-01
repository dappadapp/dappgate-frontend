import { Network } from "@/app/page";
import axios from "axios";
import { ethers } from "ethers";
import React, { use, useEffect, useState } from "react";
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
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  gasRefuelAmount: string;
};

const OFTRefuelButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  gasRefuelAmount,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [adapterParam, setAdapterParams] = useState("");
  const [gasEstimate, setGasEstimate] = useState(BigInt(0));

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "estimateGasBridgeFee",
    args: [`${targetChain.layerzeroChainId}`, false, adapterParam],
  });

  useEffect(() => {
    if (gasEstimateDataArray) {
      setGasEstimate(BigInt(gasEstimateDataArray[0]));
      if (gasEstimate) {
        const adapterParams = ethers.solidityPacked(
          ["uint16", "uint", "uint", "address"],
          [2, 200000, BigInt(Number(gasRefuelAmount) * 10 ** 18), account]
        );
        setAdapterParams(adapterParams);
      }
    }
  }, [gasEstimateData, gasRefuelAmount]);

  const gasEstimateDataArray = gasEstimateData as Array<bigint>;
  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "bridgeGas",
    value: gasEstimate,
    args: [
      targetChain.layerzeroChainId,
      "0x0000000000000000000000000000000000000000",
      adapterParam,
    ],
  });
  const { writeAsync: bridgeGas } = useContractWrite(sendFromConfig);

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
    if (!gasRefuelAmount) return toast("Please enter a valid amount");
    if (Number(gasRefuelAmount) <= 0)
      return toast("Please enter a valid amount");

    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!bridgeGas) {
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
      const { hash: txHash } = await bridgeGas();
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: gasRefuelAmount,
          walletAddress: account,
          ref: "",
          type: "refuel",
        });
      };
      postBridgeHistory();

      toast("Refuel transaction sent!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!gasRefuelAmount || loading}
      className={
        "self-center bg-blue-600 flex justify-center items-center px-4 w-1/3 text-xl mt-4 text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
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

export default OFTRefuelButton;
