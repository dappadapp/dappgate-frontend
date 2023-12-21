"use client";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../apps/dappgate/components/Footer";
import Navbar from "../apps/dappgate/components/Navbar";
import { useAccount, useBalance, useContractRead, useNetwork, useSwitchNetwork } from "wagmi";
import ListboxSourceMenu from "../apps/dappgate/components/ListboxSourceMenu";
import { Network, networks } from "@/utils/networks";
// import abi
import BridgeAbi from "../../config/abi/ScrollBridge.json";
import Withdraw from "../../config/abi/L2Withdraw.json";
import Bridge from "../../config/abi/Bridge.json";
import { ethers } from "ethers";
import { writeContract, readContract } from '@wagmi/core'
import { waitForTransaction } from '@wagmi/core'
import CircleSvg from "../apps/dappgate/components/CircleSvg";


const ScrollBridge: React.FC = ({


}) => {

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const [amount, setAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceChain, setSourceChain] = useState(networks.filter((network) => network.chainId === 1)[0]);
  const [targetChain, setTargetChain] = useState(networks.filter((network) => network.chainId === 534352)[0]);

  const [balance, setBalance] = useState("");


  const { address: account } = useAccount();

  const [loading, setLoading] = useState(false);

  const { data: balanceOfUser } = useBalance({
    address: account as `0x${string}`,
    chainId: connectedChain?.id,
  });

  const [userBalance, setUserBalance] = useState<number | string>("");

  useEffect(() => {
    if (balanceOfUser) {
      setUserBalance(balanceOfUser?.formatted || 0);
    }
    handleSwitch();

  }, [balanceOfUser, account]);


  const handleSwitch = async () => {
    if (connectedChain?.id !== 1 && connectedChain?.id !== 534352) {
      await switchNetworkAsync?.(1);
      setTargetChain(networks.filter((network) => network.chainId === 534352)[0]);
      setSourceChain(networks.filter((network) => network.chainId === 1)[0]);
    }
  }

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
        toast("Temporarly closed for maintenance.");
        return;
      }
    }



  };

  const onArrowClick = async () => {
    try {
      if (connectedChain?.id !== targetChain.chainId) {
        await switchNetworkAsync?.(targetChain.chainId);
      }
      setSourceChain(targetChain);
      setTargetChain(sourceChain);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBridge = async () => {

    console.log("connectedChain", connectedChain);
    setLoading(true);

    if (connectedChain?.id !== 1) {
      setLoading(false);
      toast("Please connect to Ethereum Mainnet.");
      await switchNetworkAsync?.(1);
      setTargetChain(networks.filter((network) => network.chainId === 1)[0]);
      setSourceChain(networks.filter((network) => network.chainId === 534352)[0]);
      return;
    }

    if (account === undefined) {
      setLoading(false);
      return toast("Please connect your wallet.");
    }

    if (amount === "") {
      toast("Please enter an amount.");
      setLoading(false);
      return;
    }

    if (Number(amount) <= 0) {
      toast("Please enter an amount greater than 0.");
      setLoading(false);
      return;
    }

    if (balanceOfUser && +(amount) > +(balanceOfUser?.formatted)) {
      toast("You don't have enough balance.");
      setLoading(false);
      return;
    }
    try {

      const fee = await readContract({
        address: "0xf356A469C0142c62c53bF72025bd847EF846dD54" as `0x${string}`,
        abi: BridgeAbi,
        functionName: "fee",
      });

      if (fee) {


        const { hash: txHash } = await writeContract({
          address: "0xf8b1378579659d8f7ee5f3c929c2f3e332e41fd6" as `0x${string}`,
          abi: Bridge,
          functionName: "depositETH",
          value: BigInt(ethers.parseEther(amount)) + BigInt("1000000000000000"),
          args: [

            BigInt(ethers.parseEther(amount)),
            "400000",
          ],
          chainId: 1,
        });


        if (txHash) {
          console.log("txHash", txHash);
          toast("Bridge Transaction sent, PLEASE WAIT!");


          const data = await waitForTransaction({
            hash: txHash,
          })
          if (data?.status === "success") {
            toast("Bridge Transaction Sent Successfully!");
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      }

    } catch (e) {
      console.log("e", e);
      toast("Not Enough Ether!");
      setLoading(false);
      return;
    }
  };

  const handleWithdraw = async () => {

    console.log("connectedChain", connectedChain);
    setLoading(true);

    if (connectedChain?.id !== 534352) {
      setLoading(false);
      toast("Please connect to Scroll Mainnet.");
      await switchNetworkAsync?.(534352);
      setTargetChain(networks.filter((network) => network.chainId === 534352)[0]);
      setSourceChain(networks.filter((network) => network.chainId === 1)[0]);
      return;
    }

    if (account === undefined) {
      setLoading(false);
      return toast("Please connect your wallet.");
    }


    if (amount === "") {
      toast("Please enter an amount.");
      setLoading(false);
      return;
    }

    if (Number(amount) <= 0) {
      toast("Please enter an amount greater than 0.");
      setLoading(false);
      return;
    }

    if (balanceOfUser && +(amount) > +(balanceOfUser?.formatted)) {
      toast("You don't have enough balance.");
      setLoading(false);
      return;
    }

    const { hash: txHash } = await writeContract({
      address: "0x4C0926FF5252A435FD19e10ED15e5a249Ba19d79" as `0x${string}`,
      abi: Withdraw,
      functionName: "withdrawETH",
      value: BigInt(ethers.parseEther(amount)),
      args: [
        account,
        BigInt(ethers.parseEther(amount)),
        "400000",
      ],
      chainId: 534352,
    });


    if (txHash) {
      console.log("txHash", txHash);
      toast("Withdraw Transaction sent, PLEASE WAIT!");


      const data = await waitForTransaction({
        hash: txHash,
      })
      if (data?.status === "success") {
        toast("Withdraw Transaction Sent Successfully!");
        setLoading(false);
        return;
      }
    }

    setLoading(false);



  }

  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

  return (
    <div className="relative w-full h-auto min-h-[800px] overflow-x-hidden">
      <div className="relative z-10 w-full min-h-[800px] h-full flex flex-col p-2 align-middle justify-center items-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-2 md:mb-5 text-white">
          Welcome to Scroll
        </h2>
        <h2 className="text-5xl md:text-7xl font-bold mb-5 md:mb-5 text-white">
          Native Bridge Tool
        </h2>
        <div className="flex mb-5 w-full md:w-full items-center justify-center mt-5 mb-5">
          <ListboxSourceMenu
            value={sourceChain}
            onChange={onChangeSourceChain}
            options={networks.filter((network) => network.chainId === 534352 || network.chainId === 1)}
            searchValue={searchTerm}
            setSearchValue={setSearchTerm}
            className="w-full "
          />
          <CircleSvg onArrowClick={onArrowClick} isClickable={true} />
          <ListboxSourceMenu
            value={targetChain}
            onChange={onChangeSourceChain}
            options={networks.filter((network) => network.chainId === 1 || network.chainId === 534352)}
            searchValue={searchTerm}
            setSearchValue={setSearchTerm}
            className="w-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center mb-4 md:mb-10">
          <div className="shadow-md rounded-lg p-10 w-full md:w-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-2">
              <h2 className="text-lg md:text-xl text-white font-semibold mb-2 md:mb-0">
                {connectedChain?.id == 1 ? "Deposit" : "Withdraw"} ETH Amount
              </h2>
              <span className="text-lg md:text-xl text-white md:ml-4">
                Balance: {Number(balanceOfUser?.formatted).toFixed(4)} ETH
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center mt-4 md:mt-5">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em] mb-2 md:mb-0"
                placeholder="Enter ETH amount"
              />
              {connectedChain?.id === 1 ? (

                <button
                  onClick={handleBridge}
                  className="flex items-center ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded disabled:bg-red-500/20 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Bridge ETH
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
                  onClick={() => handleWithdraw()}
                  className="flex items-center ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded disabled:bg-red-500/20 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Withdraw ETH
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
              )


              }
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