"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import ListboxSourceMenu from "../components/ListboxSourceMenu";
import { Network, networks } from "@/utils/networks";

const Dashboard: React.FC = ({


}) => {

    const { address: account } = useAccount();


    if (account !== "0x3D6a34D8ECe4640adFf2f38a5bD801E51B07e49C") {
        // redirect homepage
        window.location.href = "/";

    }

    const { switchNetworkAsync } = useSwitchNetwork();
    const { chain: connectedChain } = useNetwork();
    const [mintFee, setMintFee] = useState("");
    const [bridgeFee, setBridgeFee] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sourceChain, setSourceChain] = useState(networks[0]);
    const [targetChain, setTargetChain] = useState(networks[1]);

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


    const handleMintFeeUpdate = async () => {

        // Update state or fetch updated data
    };

    const handleBridgeFeeUpdate = async () => {

        // Update state or fetch updated data
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
                    "relative overflow-y-scroll z-10 w-full min-h-[800px] h-full flex flex-col p-2 align-middle justify-center items-center"
                }
            >

                <ListboxSourceMenu
                    value={sourceChain}
                    onChange={onChangeSourceChain}
                    options={networks}
                    searchValue={searchTerm}
                    setSearchValue={setSearchTerm}
                    className="mb-10"
                />
                <div className="bg-black shadow-md rounded-lg p-6 mb-4 mt-10">
                    <h2 className="text-xl font-semibold mb-2">Contract: </h2>
                    <div className="mb-2">
                        <label className="block text-gray-600">Current Mint Fee:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={mintFee}
                                onChange={(e) => setMintFee(e.target.value)}
                                className="text-black border rounded px-2 py-1 w-50"
                            />
                            <button
                                onClick={handleMintFeeUpdate}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Mint Fee
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600">Current Bridge Fee:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={bridgeFee}
                                onChange={(e) => setBridgeFee(e.target.value)}
                                className="text-black border rounded px-2 py-1 w-50"
                            />
                            <button
                                onClick={handleBridgeFeeUpdate}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Bridge Fee
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-black shadow-md rounded-lg p-6 mb-4">
                    <h2 className="text-xl font-semibold mb-2">Contract: </h2>
                    <div className="mb-2">
                        <label className="block text-gray-600">Mint Fee:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={mintFee}
                                onChange={(e) => setMintFee(e.target.value)}
                                className="border rounded px-2 py-1 w-50"
                            />
                            <button
                                onClick={handleMintFeeUpdate}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Mint Fee
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-600">Bridge Fee:</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={bridgeFee}
                                onChange={(e) => setBridgeFee(e.target.value)}
                                className="border rounded px-2 py-1 w-50"
                            />
                            <button
                                onClick={handleBridgeFeeUpdate}
                                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Update Bridge Fee
                            </button>
                        </div>
                    </div>
                </div>
            </div></div>
    );

};

export default Dashboard;