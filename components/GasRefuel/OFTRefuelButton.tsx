import type { Network } from "@/utils/networks";
import axios from "axios";
import { ethers } from "ethers";
import React, { use, useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useFeeData,
} from "wagmi";
import { toast } from "react-toastify";
import ONFTAbi from "../../config/abi/ONFT.json";
import OFTBridge from "../../config/abi/OFTBridge.json";
import GasRefuel from "../../config/abi/GasRefuelOnly.json";
import { parseGwei } from "viem";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
  gasRefuelAmount: string;
  balanceOfData: any;
};

const OFTRefuelButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setLayerZeroTxHashes,
  setEstimatedGas,
  gasRefuelAmount,
  balanceOfData,
}) => {
  const [loading, setLoading] = useState(false);
  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [adapterParam, setAdapterParams] = useState("");

  const { data: gasEstimateData, refetch } = useContractRead({
    address: sourceChain.gasRefuelContractAddress as `0x${string}`,
    abi: GasRefuel,
    functionName: "estimateSendFee",
    args: [`${targetChain.layerzeroChainId}`, "", adapterParam],
  });

  const gasEstimateDataArray = gasEstimateData as Array<bigint>;


  const {
    config: sendFromConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.gasRefuelContractAddress as `0x${string}`,
    abi: GasRefuel,
    functionName: "bridgeGas",
    gas: 1_000_000n,
    value: gasEstimateDataArray && BigInt(
        gasEstimateDataArray?.[0] 
    )+ (sourceChain.symbol === "ETH" ?  BigInt("5005640000000") :  BigInt("50056400000000")),
    args: [
      targetChain.layerzeroChainId,
      account?.replace(
        "0x",
        ""
      ),
      adapterParam,
      1,
      0,
    ],
  });

  const { writeAsync: bridgeGas } = useContractWrite(sendFromConfig);

  useEffect(() => {
    if (gasRefuelAmount) {
      refetch();
    }
  }, [gasRefuelAmount]);

  useEffect(() => {
    if (gasEstimateDataArray && account) {

 
      const adapterParams = ethers.solidityPacked(
        ["uint16", "uint", "uint", "address"],
        [2, 200000, BigInt(Number(gasRefuelAmount) * 10 ** 18), account]
      );
      setAdapterParams(adapterParams);

      const coefficient =
        connectedChain?.nativeCurrency.symbol === "ETH" ? 100000 : 100;
      setEstimatedGas(
        `${
          Number(
            (BigInt(gasEstimateDataArray[0] as bigint) * BigInt(coefficient)) /
              BigInt(1e18)
          ) / coefficient
        } ${connectedChain?.nativeCurrency.symbol}`
      );
    }

    
  }, [
    gasEstimateDataArray,
    account,
    setEstimatedGas,
    connectedChain?.nativeCurrency.symbol,
    gasRefuelAmount,
    sourceChain.symbol,

  ]);

  const onBridge = async () => {
    if (Number(balanceOfData?.formatted) === 0)
      return toast(
        "Layerzero relayer dont have enough gas to bridge, try again later."
      );
    if (!gasRefuelAmount) return toast("Please enter a valid amount");
    if (Number(gasRefuelAmount) <= 0)
      return toast("Please enter a valid amount");

    if (!account) {
      return toast("Please connect your wallet first.");
    }
    if (!bridgeGas) {
      console.log("error", error?.message);
      if (
        error?.message.includes(
          "LzApp: destination chain is not a trusted source"
        )
      ) {
        return toast(
          "It looks like the bridge between these chains are closed."
        );
      }

      if (
        error?.message.includes("Execution reverted for an unknown reason.")
      ) {
        return toast(
          "It looks like the bridge between these chains are not supported by LayerZero."
        );
      }
      if(error?.message.includes("insufficient funds for gas * price + value")){
      return toast(
        "You don't have enough balance for this transaction."
      );
      }

      if(error?.message.includes("RPC Request failed")){

      return toast(
        `Please connect your wallet to correct network and try again.`
      );
      }
      return toast("An unknown error occured.");
    }
    if (!isSuccess) {
      return toast("An unknown error occured.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const { hash: txHash } = await bridgeGas();
      setLayerZeroTxHashes((prev: any) => [...prev, txHash]);

      // post bridge history
      const postBridgeHistory = async () => {
        await axios.post("/api/history", {
          tx: txHash,
          srcChain: sourceChain.chainId,
          dstChain: targetChain.chainId,
          tokenId: gasRefuelAmount,
          walletAddress: account,
          ref: "",
          type: "refuel",
        });
      };
      postBridgeHistory();

      toast("Refuel transaction sent!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onBridge}
      disabled={!gasRefuelAmount || loading}
      className={
        "self-center bg-blue-600 flex justify-center items-center px-4 w-1/3 text-xl mt-4 text-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
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
  );
};

export default OFTRefuelButton;
