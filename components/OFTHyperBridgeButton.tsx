import { Network } from "@/app/page";
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
import { toast } from "react-toastify";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";
import OFTBridge from "../config/abi/OFTBridge.json";
import { ethers } from "ethers";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  tokenAmountHyperBridge: number;
  selectedHyperBridges: any;
  setBridgeCostData: any;
  estimatedGas: any;
};

const OFTHyperBridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenAmountHyperBridge,
  selectedHyperBridges,
  setBridgeCostData,
  estimatedGas,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [lzTargetChainId, setLzTargetChainId] = useState(
    selectedHyperBridges ? selectedHyperBridges[0]?.layerzeroChainId : 0
  );

  const { data: gasEstimateData, refetch } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "estimateSendFee",
    args: [lzTargetChainId, account, "1000000000000000000", false, "0x"],
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
      lzTargetChainId,
      account,
      ethers.parseEther(selectedHyperBridges.length.toString()).toString(),
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      "",
    ],
  });

  useEffect(() => {
    if (connectedChain?.id !== sourceChain.chainId) {
       switchNetworkAsync?.(sourceChain.chainId);
    }

  }, [account, sourceChain.chainId]);

  useEffect(() => {
    refetch();
    setLzTargetChainId(
      selectedHyperBridges ? selectedHyperBridges[0]?.layerzeroChainId : 0
    );
  }, [account, selectedHyperBridges]);

  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if (gasEstimateDataArray) {

      console.log("gasEstimateDataArray", gasEstimateDataArray);
      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            (BigInt(gasEstimateDataArray[0] as bigint) * BigInt(coefficient)) /
              BigInt(1e18)
          ) / coefficient
        } `
      );
    }
    setLzTargetChainId(
      selectedHyperBridges ? selectedHyperBridges[0]?.layerzeroChainId : 0
    );

    console.log("estimatedGas", estimatedGas);
    setBridgeCostData(estimatedGas);
    refetch();
  }, [gasEstimateData, tokenAmountHyperBridge, selectedHyperBridges]);

  const onBridge = async () => {
    if (connectedChain?.id !== sourceChain.chainId) {
      await switchNetworkAsync?.(sourceChain.chainId);
    }

    if (!account) {
      return toast("Please connect your wallet first.");
    }

    if (!selectedHyperBridges.length) {
      return toast("You didn't choose any destination chains.");
    }

    if (!sendFrom) {
      if (
        error?.message.includes(
          "ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)"
        )
      ) {
        return toast("Insufficient token balance, first claim your tokens.");
      }
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

      selectedHyperBridges?.forEach(async (transaction: any) => {
        setLzTargetChainId(transaction?.layerzeroChainId);
        await refetch();

        const { hash: txHash } = await sendFrom();
        setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

        // post bridge history
        const postBridgeHistory = async () => {
          await axios.post("/api/history", {
            tx: txHash,
            srcChain: sourceChain.chainId,
            dstChain: targetChain.chainId,
            tokenId: tokenAmountHyperBridge,
            walletAddress: account,
            ref: "",
            type: "oft",
          });
        };
        postBridgeHistory();
      });
      toast("Bridge transaction sent!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!tokenAmountHyperBridge || loading}
      className={
        "rounded-lg bg-blue-600 py-3 px-4 text-xl mt-4 text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
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

export default OFTHyperBridgeButton;
