import type { Network } from "@/utils/networks";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { toast } from "react-toastify";
import Bridge from "../../../../config/abi/WormholeBridge.json";
import WormNFT from "../../../../config/abi/WormholeNFT.json";
import { ethers } from "ethers";
import { useBlockNumber } from "wagmi";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  tokenId: any;
  refetchUserNftBalance: any;
};

const WormNFTGenericBridgeButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenId,
  refetchUserNftBalance,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [gas, setGas] = useState("");

  const { data: block, isError, isLoading } = useBlockNumber();

  const { data: isApproved, refetch: checkApprove } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    chainId: sourceChain.chainId,
    abi: WormNFT,
    functionName: "isApprovedForAll",
    args: [account, sourceChain.bridgeContract],
  });

  console.log("isApproved", isApproved);

  const { config: approveConfig, isSuccess: isApproveSuccess } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: WormNFT,
    functionName: "setApprovalForAll",
    value: BigInt(0),
    args: [sourceChain.bridgeContract, true],
  });

  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.bridgeContract as `0x${string}`,
    abi: Bridge,
    functionName: "transferNFT",
    value: BigInt(0),
    args: [
      sourceChain.nftContractAddress,
      tokenId,
      targetChain.wormholeChainId,
      `${"0x000000000000000000000000"}${account?.toString().replace("0x", "") + ""}`,
      block,
    ],
  });

  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  const { writeAsync: approve } = useContractWrite(approveConfig);

  const createWormholeBridge = async (txHash: string) => {
    await axios.post("/api/wormhole/create", {
      wallet: account,
      sourceTx: txHash,
      wormholeId: sourceChain.wormholeChainId,
      wormholeTargetId: targetChain.wormholeChainId,
    });
  };

  useEffect(() => {
    checkApprove();
  }, [tokenId, sourceChain, targetChain, isApproveSuccess, isApproved, account, block]);

  const onBridge = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }

    if (!sendFrom) {
      console.log("error", error?.message);
      if (error?.message.includes("Worm: destination chain is not a trusted source")) {
        return toast("It looks like the bridge between these chains are closed.");
      }

      if (error?.message.includes("Execution reverted for an unknown reason.")) {
        return toast(
          "It looks like the bridge between these chains are not supported by Wormhole."
        );
      }
      return toast(`Make sure you have more and you're on the correct network.`, {
        autoClose: 6000,
      });
    }
    if (!isSuccess) {
      return toast("Temporarly closed for maintenance.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await sendFrom();
      const data = await waitForTransaction({
        hash: txHash,
      });

      console.log("data hash", data);
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: tokenId,
          walletAddress: account,
          ref: "",
          type: "onft",
        });
      };
      postBridgeHistory();
      createWormholeBridge(txHash);

      toast("Bridge transaction sent!");
      setLoading(false);
      refetchUserNftBalance();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const onApprove = async () => {
    if (!account) {
      return toast("Please connect your wallet first.");
    }

    if (!approve) {
      console.log("error", error?.message);
      if (
        error?.message.includes("Wormhole: destination chain is not a trusted source")
      ) {
        return toast("It looks like the bridge between these chains are closed.");
      }

      if (error?.message.includes("Execution reverted for an unknown reason.")) {
        return toast(
          "It looks like the bridge between these chains are not supported by Wormhole."
        );
      }
      return toast(`Make sure you have more and you're on the correct network.`, {
        autoClose: 6000,
      });
    }

    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await approve();
      const data = await waitForTransaction({
        hash: txHash,
      });
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: tokenId,
          walletAddress: account,
          ref: "",
          type: "onft",
        });
      };
      postBridgeHistory();
    

      toast("Bridge transaction sent!");
      refetchUserNftBalance();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {isApproved ? (
        <button
          onClick={onBridge}
          disabled={!tokenId || loading}
          className={
            "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed mt-1"
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
      ) : (
        <button
          onClick={onApprove}
          disabled={!tokenId || loading}
          className={
            "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed mt-1"
          }
        >
          Approve
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
      )}
    </>
  );
};

export default WormNFTGenericBridgeButton;
