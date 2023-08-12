import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { toast } from "react-toastify";
import ONFTAbi from "../../config/abi/ONFT.json";
import { waitForTransaction, writeContract } from "@wagmi/core";

type Props = {
  sourceChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  estimatedGas: any;
  selectedHyperBridges: Network[];
  userONFTBalanceOfData: bigint;
  refetchUserONFTBalance: any;
};

const ONFTHyperBridgeButton: React.FC<Props> = ({
  sourceChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  estimatedGas,
  selectedHyperBridges,
  userONFTBalanceOfData,
  refetchUserONFTBalance,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const dstChainIds = selectedHyperBridges.map(
    (bridge) => bridge.layerzeroChainId
  );

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "estimateBatchBridgeFee",
    args: [
      dstChainIds,
      "0x0000000000000000000000000000000000000000",
      Array.from(Array(selectedHyperBridges.length).keys()),
    ],
    chainId: sourceChain.chainId,
  });

  const { data: userTokenIdData } = useContractReads({
    contracts: Array.from(Array(Number(userONFTBalanceOfData || 0)).keys()).map(
      (i) => {
        return {
          address: sourceChain.nftContractAddress as `0x${string}`,
          abi: ONFTAbi as any,
          functionName: "tokenOfOwnerByIndex",
          args: [account!, i],
          chainId: sourceChain.chainId,
        };
      }
    ),
  });

  const tokenIds = userTokenIdData?.map((data) => `${data.result}`);
  const tokenIdsSliced = tokenIds?.slice(0, dstChainIds.length);

  const { data: bridgeFeeData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "bridgeFee",
    chainId: sourceChain.chainId,
  });

  useEffect(() => {
    if ((gasEstimateData as any)?.[0]) {
      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            ((gasEstimateData as bigint[])?.[0] * BigInt(coefficient)) /
              BigInt(1e18)
          ) /
            coefficient +
          Number(
            ((bridgeFeeData as bigint) * BigInt(coefficient)) / BigInt(1e18)
          ) /
            coefficient
        } ${connectedChain?.nativeCurrency.symbol}`
      );
    }
  }, [
    gasEstimateData,
    bridgeFeeData,
    connectedChain?.nativeCurrency.symbol,
    estimatedGas,
    setEstimatedGas,
  ]);

  const onBridge = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!tokenIds || tokenIds.length === 0) {
      return toast("You don't have any tokens in your wallet.");
    }

    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: batchBridgeTxHash } = await writeContract({
        address: sourceChain.nftContractAddress as `0x${string}`,
        abi: ONFTAbi,
        functionName: "batchBridge",
        value: (gasEstimateData as bigint) + (bridgeFeeData as bigint),
        args: [
          account,
          dstChainIds,
          account,
          tokenIdsSliced,
          account,
          "0x0000000000000000000000000000000000000000",
          "0x00010000000000000000000000000000000000000000000000000000000000055730",
        ],
      });
      await waitForTransaction({
        hash: batchBridgeTxHash,
      });

      setLayerZeroTxHashes((prev: any) => [...prev, batchBridgeTxHash]);

      tokenIds.forEach((tokenId, i) => {
        // post bridge history
        const postBridgeHistory = async () => {
          await axios.post("/api/history", {
            tx: batchBridgeTxHash,
            srcChain: sourceChain.chainId,
            dstChain: selectedHyperBridges[i].chainId,
            tokenId: tokenId,
            walletAddress: account,
            ref: "",
            type: "onft",
          });
        };
        postBridgeHistory();
      });

      toast("Bridge transaction sent!");
      refetchUserONFTBalance();
    } catch (error: any) {
      console.log(error);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={loading}
      className={
        "flex items-center gap-1 bg-white/10 border-white border-[1px] justify-center  rounded-lg px-16 py-3 mt-5"
      }
    >
      Bridge {"(" + selectedHyperBridges.length + ")"}{" "}
      {"[Your balance: " + Number(userONFTBalanceOfData) + "]"}
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

export default ONFTHyperBridgeButton;