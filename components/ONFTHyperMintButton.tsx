import { Network } from "@/app/page";
import { ethers } from "ethers";
import { fetchTransaction } from "@wagmi/core";
import React, { use, useEffect, useState } from "react";
import { waitForTransaction, writeContract } from "@wagmi/core";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import ONFTAbi from "../config/abi/ONFT.json";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  sourceChain: Network;
  refCode?: string;
  selectedHyperBridges: Network[];
  setMintCostData: any;
  setLoader: any;
  refetchUserONFTBalance: any;
};

const ONFTHyperMintButton: React.FC<Props> = ({
  sourceChain,
  refCode,
  selectedHyperBridges,
  setMintCostData,
  setLoader,
  refetchUserONFTBalance,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData, refetch } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "mintFee",
    chainId: sourceChain.chainId,
  });

  const { config: mintConfig, isSuccess } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "batchMint",
    value:
      BigInt((costData as string) || "500000000000000") *
      BigInt(selectedHyperBridges.length),
    args: [selectedHyperBridges.length],
  });

  const { writeAsync: mint } = useContractWrite(mintConfig);

  const updateMintCostData = async () => {
    if (costData) {
      setMintCostData(Number(costData) * selectedHyperBridges?.length);
    }
  };

  useEffect(() => {
    refetch();
    updateMintCostData();
  }, [selectedHyperBridges, sourceChain, costData, refetch]);
  const onMint = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!selectedHyperBridges.length) {
      return toast("You didn't choose any destination chains.");
    }
    if (!mint)
      return toast(
        "Make sure you have enough ETH and you're on the correct network."
      );
    if (!isSuccess) {
      return toast("An unknown error occured. Please try again.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }

      const { hash: batchMintTxHash } = await mint();
      const batchMintTxResult = await waitForTransaction({
        hash: batchMintTxHash,
      });

      console.log("batchMintTxResult", batchMintTxResult);

      const tokenIds = batchMintTxResult.logs
        .map((log, i) =>
          i >= (sourceChain.logIndex || 0) &&
          i < (sourceChain.logIndex || 0) + selectedHyperBridges.length &&
          log.topics.length === 4
            ? BigInt(log.topics[3]).toString()
            : "0"
        )
        .filter((value) => value !== "0");

      tokenIds.forEach((tokenId, i) => {
        const postMintHistory = async () => {
          await axios.post("/api/history", {
            tx: mintTxHash,
            srcChain: sourceChain.chainId,
            dstChain: selectedHyperBridges[i].chainId,
            tokenId,
            walletAddress: account,
            ref: "",
            type: "mint",
          });
        };
        postMintHistory();
      });

      if (refCode?.length === 12) {
        const postReferenceMint = async () => {
          await axios.post("/api/referenceMint", {
            id: 0,
            walletAddress: account,
            chainId: sourceChain.chainId,
            ref: refCode,
            tx_id: mintTxHash,
          });
        };
        postReferenceMint();
      }

      if (mintTxHash && sourceChain) {
        const postHashMint = async () => {
          await axios.post("/api/hash", {
            type: "mint",
            hash: mintTxHash,
            ref: refCode,
            chainId: sourceChain?.chainId,
          });
        };
        postHashMint();
      }

      setLoader(false);
      refetchUserONFTBalance();
    } catch (error) {
      console.log(error);
      setLoader(false);
    } finally {
      setLoading(false);
      setLoader(false);
    }
  };

  return (
    <button
      onClick={onMint}
      disabled={!selectedHyperBridges || loading}
      className={
        "flex items-center gap-1 bg-white/10 border-white border-[1px] justify-center  rounded-lg px-16 py-3 mt-5"
      }
    >
      Mint {"(" + selectedHyperBridges.length + ")"}
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

export default ONFTHyperMintButton;
