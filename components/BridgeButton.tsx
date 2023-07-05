import { Network } from "@/app/page";
import React from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  tokenIds: any;
  showInput: boolean;
  inputTokenId: string;
  setInputTokenId: any;
  setTokenIds: any;
  setLayerZeroTxHash: any;
  setIsAnimationStarted: any;
  animationTime: number;
};

const BridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  tokenIds,
  showInput,
  inputTokenId,
  setInputTokenId,
  setTokenIds,
  setLayerZeroTxHash,
  setIsAnimationStarted,
  animationTime
}) => {
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();

  const { data: gasEstimateData } = useContractRead({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "estimateFees",
    args: [`${targetChain.layerzeroChainId}`, inputTokenId],
  });

  const { config: sendFromConfig } = usePrepareContractWrite({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "crossChain",
    value:
      BigInt((gasEstimateData as string) || "13717131402195452") +
      BigInt("10000000000000"),
    args: [
      targetChain.layerzeroChainId,
      inputTokenId || tokenIds?.[sourceChain.chainId]?.[account as string]?.[0],
    ],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  const onBridge = async () => {
    if (!sendFrom || !account)
      return alert(
        "Make sure you have enough gas and you're on the correct network."
      );
    if (tokenIds.length === 0) return alert("No tokenIds");
    try {
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      await sendFrom();
      setTokenIds((prev: any) => {
        const newArray = prev?.[sourceChain.chainId]?.[account as string]
          ? [...prev?.[sourceChain.chainId]?.[account as string]]
            .slice(1)
            .filter((value, index, self) => self.indexOf(value) === index)
          : [];
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
      setInputTokenId(tokenIds[sourceChain.chainId][account][1] || "");

      // hide card
      setIsAnimationStarted(true);

      setTimeout(() => {
        setIsAnimationStarted(false);
      }, animationTime);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={tokenIds.length === 0}
      className={"bg-white/10 border-white border-[1px] rounded-lg px-8 py-2"}
    >
      Bridge
    </button>
  );
};

export default BridgeButton;
