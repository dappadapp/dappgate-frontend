"use client";
import formatAddress from "@/utils/formatAddress";
import { useWeb3Modal } from "@web3modal/react";
import React from "react";
import { useAccount } from "wagmi";

const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  return (
    <button
      className={
        "rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-5 py-3.5 text-black font-semibold select-none"
      }
      onClick={open}
    >
      {address ? formatAddress(address) : "Connect Wallet"}
    </button>
  );
};

export default ConnectButton;
