"use client";
import React, { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { goerli, optimismGoerli, polygonMumbai } from "wagmi/chains";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dynamic from "next/dynamic";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useAccount,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";
import { ethers } from "ethers";
import OptimismLogo from "../assets/images/optimism.png";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";

const ConnectButton = dynamic(() => import("@/components/ConnectButton"), {
  ssr: false,
});

interface Network {
  name: string;
  chainId: number;
  image: any;
  layerzeroChainId: number;
  merkleLzAddress: string;
}

const networks: Network[] = [
  {
    name: optimismGoerli.name,
    chainId: optimismGoerli.id,
    image: OptimismLogo,
    layerzeroChainId: 10132,
    merkleLzAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
  },
  {
    name: goerli.name,
    chainId: goerli.id,
    image: OptimismLogo,
    layerzeroChainId: 10121,
    merkleLzAddress: "0x390d4A9a043efB4A2Ca5c530b7C63F6988377324",
  },
  {
    name: polygonMumbai.name,
    chainId: polygonMumbai.id,
    image: OptimismLogo,
    layerzeroChainId: 10109,
    merkleLzAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
  },
  /*   {
      name: zkSyncTestnet.name,
      chainId: zkSyncTestnet.id,
      image: OptimismLogo,
      layerzeroChainId: 10165,
      merkleLzAddress: ""
    },
    {
      name: bscTestnet.name,
      chainId: bscTestnet.id,
      image: OptimismLogo,
      layerzeroChainId: 10102,
      merkleLzAddress: "0xb5691e49f86CBa649c815Ee633679944b044BC43"
    }, */
];

export default function Home() {
  const [sourceChain, setSourceChain] = React.useState<Network>(networks[0]);
  const [targetChain, setTargetChain] = React.useState<Network>(networks[1]);
  const [tokenIds, setTokenIds] = React.useState<string[]>([]);
  const [mintTxHash, setMintTxHash] = React.useState<string>("");
  const [showInput, setShowInput] = React.useState<boolean>(false);
  const [inputTokenId, setInputTokenId] = React.useState<string>("");
  const [isCardHidden, setIsCardHidden] = React.useState<boolean>(false);

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();

  console.log("chain", chain);

  const { config: mintConfig } = usePrepareContractWrite({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "mint",
    value: ethers.parseEther("0.0005"),
  });
  const { writeAsync: mint } = useContractWrite(mintConfig);

  const { config: sendFromConfig } = usePrepareContractWrite({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "crossChain",
    value: ethers.parseEther("0.001"),
    args: [targetChain.layerzeroChainId, tokenIds[0]],
  });
  const { writeAsync: sendFrom } = useContractWrite(sendFromConfig);

  const { data: ownerOfData } = useContractRead({
    address: sourceChain.merkleLzAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "ownerOf",
    args: [inputTokenId],
  });

  const { data: mintTxResultData } = useWaitForTransaction({
    hash: mintTxHash as `0x${string}`,
    confirmations: 8,
  });

  // TODO: send a balanceOf() call just in case user still has the token IDS on initial page load.
  // Do the same check after clicking the bridge button

  console.log("tokenIds: ", tokenIds);
  console.log("ownerOfData", ownerOfData);

  useEffect(() => {
    const tokenIdsLocalStorage = localStorage.getItem("tokenIds");
    console.log("tokenIdsLocalStorage", tokenIdsLocalStorage);
    setTokenIds(tokenIdsLocalStorage ? JSON.parse(tokenIdsLocalStorage) : []);
  }, []);

  useEffect(() => {
    if (!mintTxResultData) return;
    console.log("mintTxResultData", mintTxResultData.logs[0].topics[3]);
    const tokenId = BigInt(
      mintTxResultData.logs[0].topics[3] as string
    ).toString();
    setTokenIds((prev) => {
      localStorage.setItem(
        "tokenIds",
        JSON.stringify(
          [...prev, tokenId].filter(
            (value, index, self) => self.indexOf(value) === index
          )
        )
      );
      return [...prev, tokenId];
    });

    // hide card
    setIsCardHidden(true);

    setTimeout(() => {
      setIsCardHidden(false);
    }, 5000);
  }, [mintTxResultData]);

  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find(
      (network) => network.name === selectedNetwork.name
    );
    if (chain) {
      if (chain.name === targetChain.name) {
        setTargetChain(sourceChain);
      }
      setSourceChain(chain);
      await switchNetworkAsync?.(chain.chainId);
    }
  };

  const onChangeTargetChain = async (selectedNetwork: Network) => {
    const chain = networks.find(
      (network) => network.name === selectedNetwork.name
    );
    if (chain) {
      if (chain.name === sourceChain.name) {
        setSourceChain(targetChain);
      }
      setTargetChain(chain);
      await switchNetworkAsync?.(chain.chainId);
    }
  };

  const onMint = async () => {
    if (!mint) return alert("No mint function");
    try {
      const result = await mint();
      setMintTxHash(result.hash);
    } catch (error) {
      console.log(error);
    }
  };

  const onBridge = async () => {
    if (!sendFrom) return alert("No sendFrom function");
    if (tokenIds.length === 0) return alert("No tokenIds");
    try {
      if (showInput && inputTokenId) {
      }
      await sendFrom();
      setTokenIds((prev) => {
        localStorage.setItem(
          "tokenIds",
          JSON.stringify(
            prev
              .slice(1)
              .filter((value, index, self) => self.indexOf(value) === index)
          )
        );
        return prev.slice(1);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onArrowClick = async () => {
    setSourceChain(targetChain);
    setTargetChain(sourceChain);
    await switchNetworkAsync?.(targetChain.chainId);
  };

  return (
    <div className={"relative w-full h-[100vh] min-h-[800px] overflow-hidden"}>
      <div className={"absolute z-10 w-full h-full flex flex-col "}>
        <div className={"container mx-auto h-full flex flex-col"}>
          <div className={"w-full flex items-center justify-between mt-16"}>
            <h1 className={"text-4xl font-bold select-none"}>DappGate</h1>
            <ConnectButton />
          </div>
          <div
            className={
              "h-full w-full min-h-fit py-16  flex flex-col items-center justify-center"
            }
          >
            <div
              className={`w-full max-w-[800px] bg-white bg-opacity-5 backdrop-blur-[3px] border-white border-[2px] border-opacity-10 h-fit p-16 rounded-2xl flex flex-col ${
                isCardHidden ? "hidden" : ""
              }`}
            >
              <h1 className={"text-3xl font-semibold"}>Bridge</h1>
              <div className={"flex justify-between items-center mt-16"}>
                <Listbox
                  value={sourceChain}
                  onChange={onChangeSourceChain}
                  className={"w-[36%]"}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                      <span className="block truncate">{sourceChain.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {networks.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "bg-white text-black" : "text-gray-300"
                              }`
                            }
                            value={person}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {person.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <svg
                  width="58"
                  height="45"
                  viewBox="0 0 48 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={onArrowClick}
                  cursor="pointer"
                >
                  <circle
                    cx="17.4"
                    cy="17.4"
                    r="16.4"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle
                    cx="30.6031"
                    cy="17.4"
                    r="16.4"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>

                <Listbox
                  value={targetChain}
                  onChange={onChangeTargetChain}
                  className={"w-[36%]"}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                      <span className="block truncate">{targetChain.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <FontAwesomeIcon icon={faAngleDown} />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {networks.map((person, personIdx) => (
                          <Listbox.Option
                            key={personIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "bg-white text-black" : "text-gray-300"
                              }`
                            }
                            value={person}
                          >
                            {({ selected2 }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected2 ? "font-bold" : "font-normal"
                                  }`}
                                >
                                  {person.name}
                                </span>
                                {selected2 ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div
                className={
                  "flex justify-center items-center gap-8 w-full mt-28 select-none"
                }
              >
                <button onClick={onMint} className={""}>
                  Mint
                </button>
                <span>or</span>
                <button onClick={onBridge} disabled={tokenIds.length === 0}>
                  Bridge
                </button>
              </div>
            </div>
          </div>
          <div className={"mt-auto mb-16 flex justify-between items-center"}>
            <p className={"text-gray-400 font-light"}>
              DappGate by{" "}
              <a
                href={"https://dappad.app/"}
                className={"text-white font-bold"}
              >
                DappLabs
              </a>
            </p>
            <div className={"flex gap-4 text-xl text-gray-400 "}>
              <a href="/" className={"hover:text-gray-100 transition-all"}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href={"/"} className={"hover:text-gray-100 transition-all"}>
                <FontAwesomeIcon icon={faDiscord} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={"relative w-full h-full"}>
        <div className={"absolute z-[4] bg-effect w-full h-full"}></div>
        <div className={"absolute z-[3] w-full h-full bg-pattern"}></div>
        <div className={"absolute z-[2] w-full h-full"}>
          <div
            className={
              "container relative mx-auto h-full flex justify-center items-center text-white bg-blur"
            }
          >
            <div
              className={
                "absolute z-[-12] h-[800px] aspect-square blur-[140px] left-[-40%] bg-red-500 rounded-full"
              }
            ></div>
            <div
              className={
                "absolute z-[-12] h-[800px] aspect-square blur-[140px] right-[-40%] bg-blue-500 rounded-full"
              }
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
