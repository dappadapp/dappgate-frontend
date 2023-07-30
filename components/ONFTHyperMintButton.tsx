import { Network } from "@/app/page";
import { ethers } from "ethers";
import { fetchTransaction } from "@wagmi/core";
import React, { use, useEffect, useState } from "react";
import { waitForTransaction } from "@wagmi/core";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setInputTokenId: any;
  tokenIds: any;
  setTokenIds: any;
  refCode?: string;
  logIndex?: number;
  selectedHyperBridges: any;
  setHyperBridgeNFTIds: any;
  hyperBridgeNFTIds: any;
};

const ONFTHyperMintButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setInputTokenId,
  tokenIds,
  setTokenIds,
  refCode,
  logIndex,
  selectedHyperBridges,
  setHyperBridgeNFTIds,
  hyperBridgeNFTIds,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "cost",
  });

  const {
    config: mintConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "mint",
    value: BigInt((costData as string) || "500000000000000"),
  });

  const { data: mintResult, writeAsync: mint } = useContractWrite(mintConfig);
  /*
  const { data: mintTxResultData, refetch } = useWaitForTransaction({
    hash: mintResult?.hash as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
  });*/

  const addNftId = async (nftId: string) => {
    setHyperBridgeNFTIds((hyperBridgeNFTIds: any) => [
      ...hyperBridgeNFTIds,
      nftId,
    ]);
  };

  const getOwnRef = (paramsRefCode: string) => {
    let splitString = paramsRefCode.split("");
    let reverseArray = splitString.reverse();
    return reverseArray.join("").substring(0, 12);
  };

  const onMint = async () => {
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (
      selectedHyperBridges.every((v: any, i: any, arr: any) => v === arr[0])
    ) {
      return alert("You didn't choose any destination chains.");
    }
    if (!mint)
      return alert(
        "Make sure you have enough ETH and you're on the correct network."
      );
    if (!isSuccess) {
      return alert("An unknown error occured. Please try again.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      selectedHyperBridges
        .filter((x: any) => x !== 0)
        .forEach(async () => {
          const result = await mint();
          setMintTxHash(result.hash);
          toast("Mint transaction sent, waiting confirmation...");

          const data = await waitForTransaction({
            hash: result?.hash,
          });

          const tokenId = BigInt(
            data?.logs[logIndex || 0].topics[3] as string
          ).toString();

          if (tokenId) {
            await addNftId(tokenId);
          }
          console.log("nftIds", hyperBridgeNFTIds);
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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    console.log("nftIds", hyperBridgeNFTIds);
  };

  return (
    <button
      onClick={onMint}
      disabled={ !(selectedHyperBridges.filter((x: any) => x !== 0)) || loading}
      className={
        "flex items-center gap-1 bg-white/10 border-white border-[1px] justify-center  rounded-lg px-16 py-3 mt-5"
      }
      
    >
      Mint {"(" + selectedHyperBridges.filter((x: any) => x !== 0).length + ")"}
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
