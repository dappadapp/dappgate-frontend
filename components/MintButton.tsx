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
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  sourceChain: Network;
  setInputTokenId: any;
  setTokenIds: any;
};

const MintButton: React.FC<Props> = ({
  sourceChain,
  setInputTokenId,
  setTokenIds,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: costData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "cost",
  });

  const { config: mintConfig } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "mint",
    value: BigInt((costData as string) || "500000000000000"),
  });
  const { writeAsync: mint } = useContractWrite(mintConfig);

  const { data: mintTxResultData } = useWaitForTransaction({
    hash: mintTxHash as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
  });

  useEffect(() => {
    if (!mintTxResultData) return;
    const tokenId = BigInt(
      mintTxResultData.logs[0].topics[3] as string
    ).toString();

    const postMint = async () => {
      await axios.post("/api/mint", {
        tokenId,
      });
    };
    postMint();
    setInputTokenId(tokenId);
    setTokenIds((prev: any) => {
      const newArray = prev?.[sourceChain.chainId]?.[account as string]
        ? [...prev?.[sourceChain.chainId]?.[account as string], tokenId].filter(
            (value, index, self) => self.indexOf(value) === index
          )
        : [tokenId];
      const tokenIdData = {
        ...prev,
        [sourceChain.chainId]: {
          ...prev?.[sourceChain.chainId],
          [account as string]: newArray,
        },
      };
      localStorage.setItem("tokenIds", JSON.stringify(tokenIdData));
      return tokenIdData;
    });

    setMintTxHash("");
    toast(`NFT minted with the id of ${tokenId}!`);
  }, [mintTxResultData]);

  const onMint = async () => {
    if (!mint)
      return alert(
        "Make sure you have enough ETH and you're on the correct network."
      );
    try {
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const result = await mint();
      setMintTxHash(result.hash);
      toast("Mint transaction sent, waiting confirmation...");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={onMint}
      className={"bg-white/10 border-white border-[1px] rounded-lg px-16 py-2"}
    >
      Mint
    </button>
  );
};

export default MintButton;
