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
  blockConfirmation: number;
}

const networks: Network[] = [
  {
    name: optimismGoerli.name,
    chainId: optimismGoerli.id,
    image: OptimismLogo,
    layerzeroChainId: 10132,
    merkleLzAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
    blockConfirmation: 8,
  },
  {
    name: goerli.name,
    chainId: goerli.id,
    image: OptimismLogo,
    layerzeroChainId: 10121,
    merkleLzAddress: "0x390d4A9a043efB4A2Ca5c530b7C63F6988377324",
    blockConfirmation: 2,
  },
  {
    name: polygonMumbai.name,
    chainId: polygonMumbai.id,
    image: OptimismLogo,
    layerzeroChainId: 10109,
    merkleLzAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
    blockConfirmation: 4,
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

/*

{
  '420': {
    '0x123': ['3131', '3162'],
    '0x456': ['2131', '2162'],
  },
}

*/

export default function Home() {
  const [sourceChain, setSourceChain] = React.useState<Network>(networks[0]);
  const [targetChain, setTargetChain] = React.useState<Network>(networks[1]);
  const [tokenIds, setTokenIds] = React.useState<any>({});
  const [mintTxHash, setMintTxHash] = React.useState<string>("");
  const [showInput, setShowInput] = React.useState<boolean>(false);
  const [inputTokenId, setInputTokenId] = React.useState<string>("");
  const [isCardHidden, setIsCardHidden] = React.useState<boolean>(false);

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const { address: account } = useAccount();

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
    args: [
      targetChain.layerzeroChainId,
      inputTokenId || tokenIds?.[sourceChain.chainId]?.[account as string]?.[0],
    ],
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
    confirmations: sourceChain.blockConfirmation,
  });

  // TODO: send a balanceOf() call just in case user still has the token IDS on initial page load.
  // Do the same check after clicking the bridge button

  console.log("tokenIds: ", tokenIds);
  console.log("ownerOfData", ownerOfData);

  useEffect(() => {
    const tokenIdsLocalStorage = localStorage.getItem("tokenIds");
    if (!tokenIdsLocalStorage) {
      localStorage.setItem("tokenIds", JSON.stringify({}));
    }
    console.log("tokenIdsLocalStorage", tokenIdsLocalStorage);
    setTokenIds(tokenIdsLocalStorage ? JSON.parse(tokenIdsLocalStorage) : {});
  }, []);

  useEffect(() => {
    if (!mintTxResultData) return;
    console.log("mintTxResultData", mintTxResultData.logs[0].topics[3]);
    const tokenId = BigInt(
      mintTxResultData.logs[0].topics[3] as string
    ).toString();
    setInputTokenId(tokenId);
    setTokenIds((prev: any) => {
      const newArray = prev?.[sourceChain.chainId]?.[account as string]
        ? [...prev?.[sourceChain.chainId]?.[account as string], tokenId].filter(
            (value, index, self) => self.indexOf(value) === index
          )
        : [tokenId];
      const tokenIdData = {
        ...prev,
        [sourceChain.chainId]: {
          ...prev?.[sourceChain.chainId],
          [account as string]: newArray,
        },
      };
      localStorage.setItem("tokenIds", JSON.stringify(tokenIdData));
      return tokenIdData;
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
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }
        if (chain.name === targetChain.name) {
          setTargetChain(sourceChain);
        }
        setSourceChain(chain);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChangeTargetChain = async (selectedNetwork: Network) => {
    const chain = networks.find(
      (network) => network.name === selectedNetwork.name
    );
    if (chain) {
      try {
        if (chain.name === sourceChain.name) {
          if (connectedChain?.id !== targetChain.chainId) {
            await switchNetworkAsync?.(targetChain.chainId);
          }
          setSourceChain(targetChain);
        }
        setTargetChain(chain);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onMint = async () => {
    if (!mint)
      return alert(
        "Make sure you have enough ETH and you're on the correct network."
      );
    try {
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      const result = await mint();
      setMintTxHash(result.hash);
    } catch (error) {
      console.log(error);
    }
  };

  const onBridge = async () => {
    if (!sendFrom)
      return alert(
        "Make sure you have enough gas and you're on the correct network."
      );
    if (tokenIds.length === 0) return alert("No tokenIds");
    try {
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      if (showInput && inputTokenId) {
      }
      await sendFrom();
      setTokenIds((prev: any) => {
        const newArray = prev?.[sourceChain.chainId]?.[account as string]
          ? [...prev?.[sourceChain.chainId]?.[account as string]]
              .slice(1)
              .filter((value, index, self) => self.indexOf(value) === index)
          : [];
        const tokenIdData = {
          ...prev,
          [sourceChain.chainId]: {
            ...prev?.[sourceChain.chainId],
            [account as string]: newArray,
          },
        };
        localStorage.setItem("tokenIds", JSON.stringify(tokenIdData));
        return tokenIdData;
      });
      setInputTokenId("");
    } catch (error) {
      console.log(error);
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
                <Listbox value={sourceChain} onChange={onChangeSourceChain}>
                  <div className="relative w-[36%]">
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

                <Listbox value={targetChain} onChange={onChangeTargetChain}>
                  <div className="relative w-[36%]">
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
              </div>
              <div
                className={
                  "flex flex-col justify-center items-center gap-6 w-full mt-28 select-none"
                }
              >
                <button
                  onClick={onMint}
                  className={
                    "bg-white/10 border-white border-[1px] rounded-lg px-10 py-2"
                  }
                >
                  Mint
                </button>
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    cursor="pointer"
                    onClick={() => setShowInput((prev) => !prev)}
                    className="self-start w-6 h-6 ml-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <button
                    onClick={onBridge}
                    disabled={tokenIds.length === 0}
                    className={
                      "bg-white/10 border-white border-[1px] rounded-lg px-8 py-2"
                    }
                  >
                    Bridge
                  </button>
                  <div
                    className={`w-[150px] mt-4 transition-all overflow-hidden ${
                      !showInput ? "max-h-[0px]" : "max-h-[200px]"
                    }`}
                  >
                    <input
                      placeholder="Token ID"
                      onChange={(e) => setInputTokenId(e.target.value)}
                      value={inputTokenId}
                      className={`bg-white/10 border-white border-[1px] rounded-lg px-8 py-2 w-full text-center`}
                    />
                  </div>
                </div>
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
