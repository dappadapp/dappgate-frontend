import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useNetwork, useSwitchNetwork } from "wagmi";
import { waitForTransaction,writeContract, readContract } from "@wagmi/core";

import { toast } from "react-toastify";
import OFTBridge from "../../config/abi/OFTBridge.json";
import { ethers } from "ethers";

type Props = {
  sourceChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  tokenAmountHyperBridge: number;
  selectedHyperBridges: any;
  setBridgeCostData: any;
};

const OFTHyperBridgeButton: React.FC<Props> = ({
  sourceChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenAmountHyperBridge,
  selectedHyperBridges,
  setBridgeCostData,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [lzTargetChainId, setLzTargetChainId] = useState(
    selectedHyperBridges ? selectedHyperBridges.filter((network: any) => network.isGrayscale !== true)[0]?.layerzeroChainId : 0
  );
  const [adapterParam, setAdapterParams] = useState("");

  const { data: gasEstimateData, refetch } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "estimateSendFee",
    args: [
      lzTargetChainId,
      account,
      selectedHyperBridges.filter((network: any) => network.isGrayscale !== true).length,
      false,
      adapterParam, // version: 1, value: 400000
    ],
    chainId: sourceChain.chainId,
  });


  useEffect(() => {
    if (account) {
      const adapterParams = ethers.solidityPacked(
        ["uint16", "uint", "uint", "address"],
        [2, 200000, BigInt(Number(selectedHyperBridges.filter((network: any) => network.isGrayscale !== true)?.length)), account]
      );
      setAdapterParams(adapterParams);
    }
  }, [account, selectedHyperBridges, connectedChain?.nativeCurrency.symbol]);

  useEffect(() => {
    refetch();
    setLzTargetChainId(
      selectedHyperBridges ? selectedHyperBridges.filter((network: any) => network.isGrayscale !== true)[0]?.layerzeroChainId : 0
    );
  }, [selectedHyperBridges, refetch]);

  useEffect(() => {
    if (gasEstimateData) {
      const coefficient = connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            (BigInt((gasEstimateData as bigint[])?.[0]) * BigInt(coefficient)) /
              BigInt(1e18)
          ) / coefficient
        } ${connectedChain?.nativeCurrency.symbol}`
      );
    }
    var totalCost: bigint = 0n;
    selectedHyperBridges?.map(async (network: Network) => {
      const gasEstimateArray: any = await readContract({
        address: sourceChain.tokenContractAddress as `0x${string}`,
        abi: OFTBridge,
        functionName: "estimateSendFee",
        args: [
          network.layerzeroChainId,
          account ? account : "0x0000000000000000000000000000000000000000",
          ethers.parseEther(tokenAmountHyperBridge.toString()),
          false,
          "",
        ],
      });

      if (gasEstimateArray) {
        totalCost =
          totalCost +
          (BigInt(((gasEstimateArray as any)[0] as string) || "0") +
            BigInt("10000000000000"));
      }

      setBridgeCostData(ethers.formatEther(totalCost.toString()));

    });
  }, [
    gasEstimateData,
    connectedChain?.nativeCurrency.symbol,
    account,
    selectedHyperBridges,
  ]);

  const onBridge = async () => {

    if (connectedChain?.id !== sourceChain.chainId) {
      await switchNetworkAsync?.(sourceChain.chainId);
    }

    if (!account) {
      return toast("Please connect your wallet first.");
    }

    if (!selectedHyperBridges.filter((network: any) => network.isGrayscale !== true).length) {
      return toast("You didn't choose any destination chains.");
    }

    try {


      selectedHyperBridges.filter((network: any) => network.isGrayscale !== true)?.map(async (network: Network) => {
        setLzTargetChainId(network?.layerzeroChainId);

        setLoading(true);
        const gasEstimateArray: any = await readContract({
          address: sourceChain.tokenContractAddress as `0x${string}`,
          abi: OFTBridge,
          functionName: "estimateSendFee",
          args: [
            network.layerzeroChainId,
            account ? account : "0x0000000000000000000000000000000000000000",
            ethers.parseEther(tokenAmountHyperBridge.toString()),
            false,
            "",
          ],
        });

        const { hash: txHash } = await writeContract({
          address: sourceChain.tokenContractAddress as `0x${string}`,
          abi: OFTBridge,
          functionName: "sendFrom",
          value:
            BigInt(((gasEstimateArray as any)[0] as string) || "0") +
            BigInt("10000000000000"),
          args: [
            account,
            network?.layerzeroChainId,
            account,
            ethers.parseEther(tokenAmountHyperBridge.toString()),
            account,
            "0x0000000000000000000000000000000000000000",
            "",
          ],
        });

        await waitForTransaction({
          hash: txHash,
        });

        if (!txHash) {

          return  toast("Temporarly closed for maintenance.");
        }

        if (!txHash) {
          return  toast("Temporarly closed for maintenance.");
        }
        setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

        toast("Bridge transaction sent!");

        const mintPost = async () => {
          await axios.post("/api/newCreate", {
            hash: txHash,
            from: account,
            to: sourceChain.tokenContractAddress,
            function: "sendFrom",
            chainId: sourceChain.chainId,
            status: 0,
            metadata: {
              type: "oft",
            },
          });
        };
        mintPost();

        // post bridge history
        const postBridgeHistory = async () => {
          await axios.post("/api/history", {
            tx: txHash,
            srcChain: sourceChain.chainId,
            dstChain: network.chainId,
            tokenId: tokenAmountHyperBridge,
            walletAddress: account,
            ref: "",
            type: "oft",
          });
        };
        postBridgeHistory();
        setLoading(false);
      });
    } catch (error: any) {
      if(error?.message.includes("User rejected the request")) {
        return toast(
          "Transaction rejected."
        );
      }

      if(error?.message.includes("Not enough gas to send")) {
        return toast(
          "Please select at least two destination chain."
        );
      }

      if(error?.message.includes("every destination should exactly have one token ID")) {
        return toast(
          "Not enough NFTs to bridge."
        );
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
          `Make sure you have more than ${( Number(ethers.formatUnits((gasEstimateData as bigint) )?.toString())?.toFixed(4))} ${sourceChain.symbol} and you're on the correct network.`, {autoClose: 6000}
        );
      }
      return toast(
        `Make sure you have more than ${( Number(ethers.formatUnits((gasEstimateData as bigint) )?.toString())?.toFixed(4))} ${sourceChain.symbol} and you're on the correct network.`, {autoClose: 6000}
      );
      
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <button
      onClick={onBridge}
      disabled={ loading}
      className={
        "bg-blue-600 text-xl mt-4 text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
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
          className="w-4 h-4 animate-spin inline-block ml-2"
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
