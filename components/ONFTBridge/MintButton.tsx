import type { Network } from "@/utils/networks";
import React, { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import ONFTAbi from "../../config/abi/ONFT.json";
import { toast } from "react-toastify";
import axios from "axios";
import { waitForTransaction } from "@wagmi/core";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  refCode?: string;
  balanceOfRefetch: () => Promise<any>;
};

const MintButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  refCode,
  balanceOfRefetch,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "mintFee",
    chainId: sourceChain.chainId,
  });

  const { config: mintConfig, isSuccess } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: ONFTAbi,
    functionName: "mint",
    value: BigInt((costData as string) || "500000000000000"),
  });
  const { writeAsync: mint } = useContractWrite(mintConfig);

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
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await mint();
      setMintTxHash(txHash);
      toast("Mint transaction sent, waiting confirmation...");

      const mintTxResultData = await waitForTransaction({
        hash: txHash,
      });

      const tokenId = BigInt(
        mintTxResultData.logs[sourceChain.logIndex || 0].topics[3] as string
      ).toString();

      const postMint = async () => {
        await axios.post("/api/mint", {
          tokenId,
        });
      };
      postMint();
      const postMintHistory = async () => {
        await axios.post("/api/history", {
          tx: mintTxHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: tokenId,
          walletAddress: account,
          ref: "",
          type: "mint",
        });
      };
      postMintHistory();

        const postReferenceMint = async () => {
          await axios.post("/api/referenceMint", {
            id: tokenId,
            walletAddress: account,
            chainId: sourceChain.chainId,
            ref: refCode,
            tx_id: mintTxHash,
          });
        };
        postReferenceMint();

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


      ///bridge?tx=${data.tx}&srcChain=${data.srcChain}&dstChain=${data.dstChain}&tokenId=${data.tokenId}&walletAddress=${data.walletAddress}

      balanceOfRefetch();
      toast(`NFT minted with the id of ${tokenId}!`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onMint}
      disabled={loading}
      className={
        "flex items-center gap-1 bg-white/10 border-white border-[1px] rounded-lg px-16 py-2"
      }
    >
      Mint
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

export default MintButton;
