import type { Network } from "@/utils/networks";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import OFTBridge from "../../config/abi/OFTBridge.json";
import { toast } from "react-toastify";
import axios from "axios";
import { waitForTransaction } from "@wagmi/core";

type Props = {
  sourceChain: Network;
  refCode?: string;
  inputOFTAmount: string;
  refetchDlgateBalance: any;
  setPendingTxs: any;
};

const OFTClaimButton: React.FC<Props> = ({
  sourceChain,
  refCode,
  inputOFTAmount,
  refetchDlgateBalance,
  setPendingTxs,
}) => {
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData } = useContractRead({
    address: sourceChain.tokenContractAddress as `0x${string}`,
    abi: OFTBridge,
    functionName: "mintFee",
    chainId: sourceChain.chainId,
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

  const addTx = async (txHash: string) => {
    setPendingTxs((pendingTxs: any) => [...pendingTxs, txHash]);
  };

  const onMint = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!mint)
      return toast(
        "Make sure you have enough ETH and you're on the correct network."
      );
    if (!isSuccess) {
      return toast("An unknown error occured. Please try again.");
    }
    if (!inputOFTAmount) {
      return toast("Please enter a valid amount.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await mint();
      addTx(txHash);
      toast("Mint transaction sent, waiting confirmation...");

      await waitForTransaction({
        hash: txHash,
      });

      const postMint = async () => {
        await axios.post("/api/mint", {
          tokenId: inputOFTAmount,
        });
      };
      postMint();



        const postReferenceMint = async () => {
          const result = await axios.post("/api/referenceMintOFT", {
           
            address: account,
            chain: sourceChain.chainId,
            ref: refCode,
            tx: txHash,
            amount: inputOFTAmount,
           
          });
        };
        postReferenceMint();

        const mintPost = async () => {
          await axios.post("/api/newCreate", {
            hash: txHash,
            from: account,
            to: sourceChain.tokenContractAddress,
            function: "mint",
            chainId: sourceChain.chainId,
            status: 0,
            metadata: {
              "type": "oft",
              "ref": refCode,
            }
            
          });
        };
        mintPost();
    

        if (txHash && sourceChain) {
          const postHashMint = async () => {
            await axios.post("/api/hash", {
              type: "mint",
              hash: txHash,
              ref: refCode,
              chainId: sourceChain.chainId,
            });
          };
          postHashMint();
        }
      
      refetchDlgateBalance();
      toast(`Tokens minted!`);
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
        "bg-blue-600 text-sm text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-1 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
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
