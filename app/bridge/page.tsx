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
    const [sourceChain, setSourceChain] = useState(networks[0]);
    const [targetChain, setTargetChain] = useState(networks[1]);

    const [balance, setBalance] = useState("");


    const { address: account } = useAccount();
  
    const [loading, setLoading] = useState(false);

    const { data: balanceOfUser } = useBalance({
        address: account as `0x${string}`,
        chainId: 1,
      });

      console.log("balanceOfUser",balanceOfUser);

    const [userBalance, setUserBalance] = useState<number | string>("");

    useEffect(() => {
        if (balanceOfUser){
            setUserBalance(balanceOfUser?.formatted || 0);
        }
    }, [balanceOfUser,account]);



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


    const handleBridge = async () => {

        console.log("connectedChain",connectedChain);
        setLoading(true);

        if (connectedChain?.id !== 1) {
            setLoading(false);
            toast("Please connect to Ethereum Mainnet.");
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
        
        
  
        try{

          const fee = await readContract({
            address: "0xf356A469C0142c62c53bF72025bd847EF846dD54" as `0x${string}`,
            abi: BridgeAbi,
            functionName: "fee",
          });
  
          console.log("fee",fee);

          if(fee){

            console.log("fee",BigInt(ethers.parseEther(amount) ) +  BigInt("220000000000000") + BigInt(fee?.toString()));

        const { hash: txHash } = await writeContract({
            address: "0xf356A469C0142c62c53bF72025bd847EF846dD54" as `0x${string}`,
            abi: BridgeAbi,
            functionName: "depositETH",
            value: BigInt(ethers.parseEther(amount) ) +  BigInt("220000000000000") + BigInt(fee?.toString()),
            args: [
                account,
                BigInt(ethers.parseEther(amount)),
                "400000",
                BigInt(ethers.parseEther(amount))  +  BigInt("200000000000000"),
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

    }catch(e){
        console.log("e",e);
        toast("Not Enough Ether!");
        setLoading(false);
        return;
    }


    };




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
                    "relative  z-10 w-full min-h-[800px] h-full flex flex-col p-2 align-middle justify-center items-center"
                }
            >
 <h2 className="text-7xl font-bold mb-10 text-white">Welcome to Scroll Bridge</h2>


 <div className="flex space-x-4 mb-5 w-full items-center justify-center mt-5">
  <ListboxSourceMenu
    value={networks.filter((network) => network.chainId === 1)[0]}
    onChange={onChangeSourceChain}
    options={networks.filter((network) => network.chainId === 5343521)}
    searchValue={searchTerm}
    setSearchValue={setSearchTerm}
    className=" w-full"
  />

<CircleSvg onArrowClick={() => {}} isClickable={true} />

  <ListboxSourceMenu
    value={networks.filter((network) => network.chainId === 534352)[0]}
    onChange={onChangeSourceChain}
    options={networks.filter((network) => network.chainId === 1111111111111)}
    searchValue={searchTerm}
    setSearchValue={setSearchTerm}
  />


  
</div>

<div className="flex items-center justify-center mb-10 mt-5">
  <div className=" shadow-md rounded-lg p-6 w-full">
  <div className="flex items-center justify-between mb-2">
  <h2 className="text-xl text-white font-semibold">Deposit ETH Amount</h2>
  <span className="text-xl text-white">Balance: {Number(balanceOfUser?.formatted).toFixed(4)} ETH</span>
</div>
    <div className="flex items-center mt-5">
  
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-black border rounded w-[30em] px-4 py-4 text-white text-[18px] mr-2"
        placeholder="Enter ETH amount"
      />
      <button
        onClick={handleBridge}
        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded disabled:bg-red-500/20 disabled:cursor-not-allowed mt-1"
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
    </div>
  </div>
</div>

        <div>{/* Official Scroll Bridge Contract is in use */}
<div className="text-lg font-semi-bold mb-1 mt-10 text-grey-400"><strong className="text-blue-300 ml-5"> Powered by Scroll</strong> <br></br> </div>
</div>
          
        
            </div>
            <ToastContainer position="top-right" theme="dark" />
        </div>
    );

};

export default ScrollBridge;