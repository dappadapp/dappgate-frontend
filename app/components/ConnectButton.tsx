"use client";
import formatAddress from "@/utils/formatAddress";
import { useWeb3Modal } from "@web3modal/react";
import React, { use, useEffect } from "react";
import { useAccount } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import axios from "axios";

type Props = {
  pendingTxs: any;
};

const ConnectButton: React.FC<Props> = ({ pendingTxs }) => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const [pendingFilter, setPendingFilter] = React.useState<any[]>([]);

  const checkTxs = async () => {
    //const res = await waitForTransaction({hash:"0xce5a35acdd1ae2bcbcf6ac244dc1026f844eb2cd4f991ab25b63594f0641a666"});
    //console.log("res", res);
    /*
    pendingTxs.forEach(async(tx: string) => {
  
      const result = await waitForTransaction({hash:tx as `0x${string}`, confirmations: 5});
      console.log("result", result);
      if(result.status !== "success") {
        setPendingFilter((pendingFilter: any) => [...pendingFilter, tx]);
      }
    };*/

    const options = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "x-api-key": "gate_f6fc8a3115494dd7a7",
      },
    };

    await axios.get(
      `https://galxe.dappgate.app/mints/0x809c15739f1852b6339EBd7150d782eCa916087a`,
      options
    );
  };

  checkTxs();

  useEffect(() => {
    checkTxs();
  }, [pendingTxs, address, pendingFilter]);

  return (
    <button
      className={
        "rounded-lg bg-white tracking-wider duration-150 hover:bg-black hover:text-white hover:outline-white outline transition px-3 py-1 sm:px-5 sm:py-2 lg:px-8 lg:py-3.5 text-black font-semibold select-none text-sm sm:text-base"
      }
      onClick={open}
    >
      {pendingFilter.length > 0 ? (
        <span className="ml-2 text-sm text-black-500 flex justify-center items-center">
          {pendingTxs.length} Pending
          <div className="flex px-1 mt-1 justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </span>
      ) : address ? (
        formatAddress(address)
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

export default ConnectButton;