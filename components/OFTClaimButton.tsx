import { Network } from "@/app/page";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
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
import OFTBridge from "../config/abi/OFTBridge.json";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  sourceChain: Network;
  refCode?: string;
  inputOFTAmount: string;
};

const OFTClaimButton: React.FC<Props> = ({
  sourceChain,
  refCode,
  inputOFTAmount,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "fee",
  });

  const { config: mintConfig, isSuccess } = usePrepareContractWrite({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "mint",
    value:
      BigInt((costData as string) || "500000000000000") *
      BigInt(inputOFTAmount),
    args: [account, inputOFTAmount],
  });
  const { writeAsync: mint } = useContractWrite(mintConfig);

  const { data: mintTxResultData } = useWaitForTransaction({
    hash: mintTxHash as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
  });

  useEffect(() => {
    if (!mintTxResultData) return;
    console.log("mintTxResultData", mintTxResultData);

    const postMint = async () => {
      await axios.post("/api/mint", {
        tokenId: inputOFTAmount,
      });
    };
    postMint();

    if (refCode?.length === 12) {
      const postReferenceMint = async () => {
        await axios.post("/api/referenceMint", {
          id: inputOFTAmount,
          walletAddress: account,
          chainId: sourceChain.chainId,
          ref: refCode,
          tx_id: mintTxHash,
        });
      };
      postReferenceMint();


      if (mintTxHash && sourceChain.chainId) {
        const postHashMint = async () => {
          await axios.post("/api/hash", {
            type: "mint",
            hash: mintTxHash,
            ref: refCode,
          });
        };
        postHashMint();
      }
    }

    ///bridge?tx=${data.tx}&srcChain=${data.srcChain}&dstChain=${data.dstChain}&tokenId=${data.tokenId}&walletAddress=${data.walletAddress}

    setMintTxHash("");
    toast(`Tokens minted!`);
  }, [mintTxResultData]);

  const getOwnRef = (paramsRefCode: string) => {
    let splitString = paramsRefCode.split("");
    let reverseArray = splitString.reverse();
    return reverseArray.join("").substring(0, 12);
  };

  const onMint = async () => {
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (!mint)
      return alert(
        "Make sure you have enough ETH and you're on the correct network."
      );
    if (!isSuccess) {
      return alert("An unknown error occured. Please try again.");
    }
    if (!inputOFTAmount) {
      return alert("Please enter a valid amount.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const result = await mint();
      setMintTxHash(result.hash);
      toast("Mint transaction sent, waiting confirmation...");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onMint}
      disabled={!inputOFTAmount || loading}
      className={
        "rounded-lg bg-blue-600 py-3 px-4 text-left text-sm text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-1 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
      }
    >
      OFT Claim
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

export default OFTClaimButton;
