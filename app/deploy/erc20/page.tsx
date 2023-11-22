"use client";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAccount,
  useBalance,
  useContractRead,
  useFeeData,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import ListboxSourceMenu from "../../apps/dappgate/components/ListboxSourceMenu";
import { Network, networks } from "@/utils/networks";
// import abi
import CircleSvg from "../../apps/dappgate/components/CircleSvg";
import erc20Json from "../../../config/deployErc20.json";

import { MockConnector } from "@wagmi/core/connectors/mock";
import { mainnet } from "@wagmi/core/chains";
import { createWalletClient } from "viem";
import { ethers } from "ethers";

const ScrollBridge: React.FC = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceChain, setSourceChain] = useState(networks[2]);
  const [targetChain, setTargetChain] = useState(networks[2]);
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<string>("");
  const [fee, setFee] = useState<string>("0.0001277"); // Set an initial fee
  const [hash, setHash] = useState<undefined | `0x${string}`>();
  console.log("connectedChain", connectedChain);
  const [chainId, setChainId] = useState<number>(connectedChain?.id || 534352); // Set the desired chain ID
  const { data: walletClient  } = useWalletClient({ chainId: chainId  });
  const {
    data: deployTx,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash,
  });
  const feeData = useFeeData({
    chainId: chainId,
  });

  console.log("chainIsssd", chainId);
  const [balance, setBalance] = useState("");

  const { address: account } = useAccount();

  const [loading, setLoading] = useState(false);

  const { data: balanceOfUser } = useBalance({
    address: account as `0x${string}`,
    chainId: connectedChain?.id,
  });

  console.log("feeData", feeData);
  const [userBalance, setUserBalance] = useState<number | string>("");

  useEffect(() => {
    if (balanceOfUser) {
      setUserBalance(balanceOfUser?.formatted || 0);
    }
  }, [balanceOfUser, account, connectedChain?.id, sourceChain, targetChain, hash]);

  useEffect(() => {
    if (connectedChain) {
      
      setChainId(connectedChain?.id);

    }
  }
  , [connectedChain,sourceChain,targetChain,hash,chainId,account,feeData,deployTx,isLoading,isError,loading]);

  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
    if (chain) {
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }

        setSourceChain(chain || networks[2]);
        toast("Chain changed!");
      } catch (error: any) {
        if (error.code === 4001) {
          toast("You need to confirm the Metamask request in order to switch network.");
          return;
        }
        console.log(error.code);
        toast("Temporarly closed for maintenance.");
        return;
      }
    }
  };

  async function onSubmit() {
    try {
      if (!name || !symbol || !initialSupply || !fee) {
        toast("Please fill in all required fields.");
        return;
      }

      setLoading(true);
      // Convert fee to wei
      const feeWei = ethers.parseEther(fee);

      console.log("feeWei", feeWei);

      const weiInitialSupply = `${parseFloat(initialSupply)}`;

      const abi = erc20Json?.abi;
      const bytecode = erc20Json?.data?.bytecode?.object as `0x${string}`;

      console.log("bytecode", bytecode);

      const args = [name, symbol, feeWei];

      const hash = await walletClient?.deployContract({
        abi: abi as any,
        account: account as `0x${string}`,
        bytecode: bytecode as any,
        args: args as any,
        value: feeWei as any,
        gasPrice: feeData.data?.gasPrice || BigInt(0),
       
      });
      setHash(hash);
      toast("Contract deployed!");
      setLoading(false);

      const res = await axios.post(
        "/api/deployContract",
        {
          wallet: account,
          type: "erc20",
          contract: hash,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setName("");
      setSymbol("");
      setInitialSupply("");
    } catch (error) {
      console.log("err", error);
      setLoading(false);
      toast("Error deploying contract.");
    }
  }

  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

  return (
    <div className="relative w-full h-auto min-h-[1000px] overflow-x-hidden">
      <div className="relative z-10 w-full min-h-[1000px] h-full flex flex-col p-2 align-middle justify-center items-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-2 md:mb-5 mt-10 text-white">
          Welcome to
        </h2>
        <h2 className="text-5xl md:text-6xl font-bold mb-5 md:mb-5 text-white">
          Contract Deploy Tool
        </h2>
        <div className="flex mb-5 w-full md:w-full items-center justify-center mt-5 mb-5">
          <ListboxSourceMenu
            value={sourceChain}
            onChange={onChangeSourceChain}
            options={networks.filter(
              (network) =>
                network.chainId === 534352 ||
                network.chainId === 1101 ||
                network.chainId === 42161 ||
                network.chainId === 8453 ||
                network.chainId === 59144 ||
                network.chainId === 10
            )}
            searchValue={searchTerm}
            setSearchValue={setSearchTerm}
            className="w-full "
          />
        </div>
        <div className="flex flex-col items-center justify-center mb-4 md:mb-10 w-min-[700px]">
          <h1 className="text-5xl md:text-3xl text-white font-semibold mb-2 md:mb-0 text-center mb-10 mt-5">
            ERC20 Token Contract Tool
          </h1>

          <div className="shadow-md rounded-lg p-10 md:w-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-2">
              <h2 className="text-lg md:text-xl text-white font-semibold mb-2 md:mb-0">
                Enter name and symbol
              </h2>
              <span className="text-lg md:text-xl text-white md:ml-4">
                Balance: {Number(balanceOfUser?.formatted).toFixed(4)} ETH
              </span>
            </div>
            <div className="flex flex-col items-center mt-4 md:mt-5 w-full">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em]"
                  placeholder="Enter Token Name"
                />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em] mt-1"
                  placeholder="Enter Token Symbol"
                />
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em] mt-1"
                  placeholder="Enter Token Initial Supply e.g (100)"
                />
              </div>

              <button
                onClick={onSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded disabled:bg-red-500/20 disabled:cursor-not-allowed mt-4"
                disabled={loading}
              >
                Deploy ERC20 Contract
                {loading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 animate-spin ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-base md:text-lg font-semibold mb-1 mt-4 md:mt-10 text-grey-400">
            <strong className="text-blue-300 ml-2 md:ml-5">Powered by Scroll</strong>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default ScrollBridge;
