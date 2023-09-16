"use client";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../apps/dappgate/components/Footer";
import Navbar from "../apps/dappgate/components/Navbar";
import { useAccount, useContractRead, useNetwork, useSwitchNetwork } from "wagmi";
import ListboxSourceMenu from "../apps/dappgate/components/ListboxSourceMenu";
import { Network, networks } from "@/utils/networks";
// import abi
import SetContract from "../../config/abi/SetContract.json";
import { ethers } from "ethers";
import { writeContract } from "@wagmi/core";
import { waitForTransaction } from "@wagmi/core";

const Dashboard: React.FC = ({}) => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const [mintFee, setMintFee] = useState("");
  const [bridgeFee, setBridgeFee] = useState("");
  const [currentMintFee, setCurrentMintFee] = useState("");
  const [onftBridgeFee, setONFTBridgeFee] = useState("");
  const [onftMintFee, setONFTMintFee] = useState("");
  const [currentBridgeFee, setCurrentBridgeFee] = useState("");
  const [currentONFTMintFee, setCurrentONFTMintFee] = useState("");
  const [currentONFTBridgeFee, setCurrentONFTBridgeFee] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState(networks[1]);

  const { address: account } = useAccount();

  useEffect(() => {
    if (
      account === "0x3D6a34D8ECe4640adFf2f38a5bD801E51B07e49C" ||
      account === "0x3772f434d796A1B974E9B2cD37055a075F3450be"
    ) {
      // redirect homepage
    } else {
      return;
    }
  }, [account]);

  const { data: currentOFTMint, refetch: refechOFTMint } = useContractRead({
    address: sourceChain?.setOFTContractAddress as `0x${string}`,
    abi: SetContract,
    functionName: "getMintFee",
    args: [sourceChain?.tokenContractAddress],
    chainId: sourceChain.chainId,
  });

  const { data: currentOFTBridge, refetch: refechOFTBridge } = useContractRead({
    address: sourceChain?.setOFTContractAddress as `0x${string}`,
    abi: SetContract,
    functionName: "getBridgeFee",
    args: [sourceChain?.tokenContractAddress],
    chainId: sourceChain.chainId,
  });

  const { data: currentONFTMint, refetch: refechONFTMint } = useContractRead({
    address: sourceChain?.setOFTContractAddress as `0x${string}`,
    abi: SetContract,
    functionName: "getMintFee",
    args: [sourceChain?.nftContractAddress],
    chainId: sourceChain.chainId,
  });

  const { data: currentONFTBridge, refetch: refechONFTBridge } = useContractRead({
    address: sourceChain?.setOFTContractAddress as `0x${string}`,
    abi: SetContract,
    functionName: "getBridgeFee",
    args: [sourceChain?.nftContractAddress],
    chainId: sourceChain.chainId,
  });

  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
    if (chain) {
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }
        if (chain.name === targetChain.name) {
          setTargetChain(sourceChain);
        }
        setSourceChain(chain);
        toast("Chain changed!");
      } catch (error: any) {
        if (error.code === 4001) {
          toast("You need to confirm the Metamask request in order to switch network.");
          return;
        }
        console.log(error.code);
        toast("An error occured.");
        return;
      }
    }
  };

  const handleOFTMintFeeUpdate = async () => {
    const res = await writeContract({
      address: sourceChain.setOFTContractAddress as `0x${string}`,
      abi: SetContract,
      functionName: "updateMintFee",
      args: [ethers.parseEther(mintFee), sourceChain?.tokenContractAddress],
      chainId: sourceChain.chainId,
    });

    if (res?.hash) {
      console.log("res", res);
      toast("Mint Fee Update sent, WAIT!");

      const data = await waitForTransaction({
        hash: res?.hash,
      });
      if (data?.status === "success") {
        toast("Mint Fee Updated!");
        setMintFee("");
        refechOFTMint();
      }
    }
  };

  const handleOFTBridgeFeeUpdate = async () => {
    const res = await writeContract({
      address: sourceChain?.setOFTContractAddress as `0x${string}`,
      abi: SetContract,
      functionName: "updateBridgeFee",
      args: [ethers.parseEther(bridgeFee), sourceChain?.tokenContractAddress],
      chainId: sourceChain.chainId,
    });

    if (res?.hash) {
      console.log("res", res);
      toast("Bridge Fee Update sent, WAIT!");

      const data = await waitForTransaction({
        hash: res?.hash,
      });
      if (data?.status === "success") {
        toast("Bridge Fee Updated!");
        setBridgeFee("");
        refechOFTMint();
      }
    }
  };

  const handleONFTMintFeeUpdate = async () => {
    const res = await writeContract({
      address: sourceChain.setOFTContractAddress as `0x${string}`,
      abi: SetContract,
      functionName: "updateMintFee",
      args: [ethers.parseEther(onftMintFee), sourceChain?.nftContractAddress],
      chainId: sourceChain.chainId,
    });

    if (res?.hash) {
      console.log("res", res);
      toast("Mint Fee Update sent, WAIT!");

      const data = await waitForTransaction({
        hash: res?.hash,
      });
      if (data?.status === "success") {
        toast("Mint Fee Updated!");
        setONFTMintFee("");
        refechOFTMint();
      }
    }
  };

  const handleONFTBridgeFeeUpdate = async () => {
    const res = await writeContract({
      address: sourceChain?.setOFTContractAddress as `0x${string}`,
      abi: SetContract,
      functionName: "updateBridgeFee",
      args: [ethers.parseEther(onftBridgeFee), sourceChain?.nftContractAddress],
      chainId: sourceChain.chainId,
    });

    if (res?.hash) {
      console.log("res", res);
      toast("Bridge Fee Update sent, WAIT!");

      const data = await waitForTransaction({
        hash: res?.hash,
      });
      if (data?.status === "success") {
        toast("Bridge Fee Updated!");
        setONFTBridgeFee("");
        refechOFTMint();
      }
    }
  };

  useEffect(() => {
    refechOFTBridge();
    refechOFTMint();
    refechONFTMint();
    refechONFTBridge();

    console.log("currentOFTMint", currentOFTMint);
    if (currentOFTMint) {
      setCurrentMintFee(ethers.formatEther(currentOFTMint.toString()));
    }
    if (currentOFTBridge) {
      setCurrentBridgeFee(ethers.formatEther(currentOFTBridge.toString()));
    }
    if (currentONFTMint) {
      setCurrentONFTMintFee(ethers.formatEther(currentONFTMint.toString()));
    }
    if (currentONFTBridge) {
      setCurrentONFTBridgeFee(ethers.formatEther(currentONFTBridge.toString()));
    }
  }, [
    currentOFTMint,
    currentOFTBridge,
    currentONFTMint,
    currentONFTBridge,
    sourceChain,
    onftBridgeFee,
    onftMintFee,
    mintFee,
    bridgeFee,
  ]);

  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

  return (
    <div className={"relative w-full h-[100vh] min-h-[800px] overflow-x-hidden"}>
      <div
        className={
          "relative overflow-y-scroll z-10 w-full min-h-[800px] h-full flex flex-col p-2 align-middle justify-center items-center"
        }
      >
        <ListboxSourceMenu
          value={sourceChain}
          onChange={onChangeSourceChain}
          options={networks.filter(
            (network) => network.setOFTContractAddress !== undefined
          )}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          className="mb-10"
        />
        <div className="bg-black shadow-md rounded-lg p-6 mb-4 mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Contract: <strong className="text-red-600">OFT</strong> Token SET{" "}
          </h2>
          <div className="mb-2">
            <label className="block text-white-600 mb-2 mt-3">
              Current Mint Fee:{" "}
              <strong>
                {currentMintFee} {sourceChain?.symbol}{" "}
              </strong>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={mintFee}
                onChange={(e) => setMintFee(e.target.value)}
                className="text-black border rounded px-2 py-1 w-50"
              />
              <button
                onClick={handleOFTMintFeeUpdate}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Mint Fee
              </button>
            </div>
          </div>
          <div>
            <label className="block text-white-600 mb-2 mt-3">
              Current Bridge Fee:{" "}
              <strong>
                {currentBridgeFee} {sourceChain?.symbol}{" "}
              </strong>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={bridgeFee}
                onChange={(e) => setBridgeFee(e.target.value)}
                className="text-black border rounded px-2 py-1 w-50"
              />
              <button
                onClick={handleOFTBridgeFeeUpdate}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Bridge Fee
              </button>
            </div>
          </div>
        </div>
        <div className="bg-black shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Contract: <strong className="text-red-600">ONFT</strong> Contract SET{" "}
          </h2>
          <div className="mb-2">
            <label className="block text-white-600">
              Mint Fee:{" "}
              <strong>
                {currentONFTMintFee} {sourceChain.symbol}
              </strong>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={onftMintFee}
                onChange={(e) => setONFTMintFee(e.target.value)}
                className="text-black border rounded px-2 py-1 w-50"
              />
              <button
                onClick={handleONFTMintFeeUpdate}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Mint Fee
              </button>
            </div>
          </div>
          <div>
            <label className="block text-white-600">
              Bridge Fee:{" "}
              <strong>
                {currentONFTBridgeFee} {sourceChain.symbol}
              </strong>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={onftBridgeFee}
                onChange={(e) => setONFTBridgeFee(e.target.value)}
                className="text-black border rounded px-2 py-1 w-50"
              />
              <button
                onClick={handleONFTBridgeFeeUpdate}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Bridge Fee
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Dashboard;
