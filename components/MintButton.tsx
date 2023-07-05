import { Network } from "@/app/page";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";

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

  const { config: mintConfig } = usePrepareContractWrite({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "mint",
    value: ethers.parseEther("0.0005"),
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={onMint}
      className={"bg-white/10 border-white border-[1px] rounded-lg px-10 py-2"}
    >
      Mint
    </button>
  );
};

export default MintButton;
