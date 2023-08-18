"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import DappLetterAbi from "@/config/abi/Message.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Network } from "@/utils/networks";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  receiverAddress: string;
  messageContent: string;
};

const SendButton: React.FC<Props> = ({ sourceChain, targetChain, receiverAddress, messageContent }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { address: account } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { data: costData } = useContractRead({
    address: sourceChain.messageContractAddress as `0x${string}`,
    abi: DappLetterAbi,
    functionName: "cost",
    chainId: sourceChain.chainId,
  });

  const { data: feeData } = useContractRead({
    address: sourceChain.messageContractAddress as `0x${string}`,
    abi: DappLetterAbi,
    functionName: "estimateFees",
    args: [
      targetChain.layerzeroChainId,
      "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000",
      messageContent?.toString(),
    ],
    chainId: sourceChain.chainId,
  });

  const {
    config: mintConfig,
    isSuccess,
    refetch: refetchSendMessage,
  } = usePrepareContractWrite({
    address: sourceChain.messageContractAddress as `0x${string}`,
    abi: DappLetterAbi,
    functionName: "sendMessage",
    value: ((costData as bigint) || BigInt(0)) + ((feeData as bigint) || BigInt(0)) + BigInt(1),
    args: [receiverAddress, messageContent, targetChain.layerzeroChainId, false],
    chainId: sourceChain.chainId,
  });
  const { writeAsync: sendMessage } = useContractWrite(mintConfig);

  useEffect(() => {
    if (messageContent && ethers.isAddress(receiverAddress)) {
      setDisabled(false);
      refetchSendMessage();
    } else {
      setDisabled(true);
    }
  }, [receiverAddress, messageContent, refetchSendMessage]);

  const onSendMessage = async () => {
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (!sendMessage) return alert("Make sure you have enough ETH and you're on the correct network.");
    if (!isSuccess) {
      return alert("An unknown error occured. Please try again.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const result = await sendMessage();
      console.log("result", result);
      toast("Message transaction sent, waiting confirmation...");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onSendMessage}
      disabled={disabled}
      className={"flex items-center gap-1 bg-white/10 border-white border-[1px] rounded-lg px-16 py-2 self-center mt-5"}
    >
      Send!
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

export default SendButton;
