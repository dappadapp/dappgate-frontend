"use client";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { Listbox, Tab, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dynamic from "next/dynamic";
import {
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import MintButton from "@/components/MintButton";
import BridgeButton from "@/components/BridgeButton";
import formatAddress from "@/utils/formatAddress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  arbitrum,
  avalanche,
  bsc,
  canto,
  fantom,
  gnosis,
  goerli,
  harmonyOne,
  klaytn,
  mainnet,
  metis,
  moonbeam,
  moonriver,
  optimism,
  optimismGoerli,
  polygon,
  polygonZkEvm,
  zkSync,
} from "wagmi/chains";
import RefModal from "./components/RefModal";
import HistoryModal from "./components/HistoryModal";
import Image from "next/image";
import MintModal from "./components/MintModal";
import FAQModal from "./components/FAQModal";

const networks: Network[] = [
  {
    name: goerli.name,
    chainId: goerli.id,
    layerzeroChainId: 10121,
    nftContractAddress: "0x3BC0D972ed2cC430D1a2d3dBe9bAE8CF18eF58aa",
    blockConfirmation: 2,
    colorClass: "bg-[#373737]",
    image: "ethereum.svg",
    symbol: "ETH",
  },
  {
    name: optimismGoerli.name,
    chainId: optimismGoerli.id,
    layerzeroChainId: 10132,
    nftContractAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
    blockConfirmation: 1,
    colorClass: "bg-[#FF0420]",
    image: "ethereum.svg",
    symbol: "ETH",
  },
  {
    name: mainnet.name,
    chainId: mainnet.id,
    layerzeroChainId: 101,
    nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
    blockConfirmation: 1,
    colorClass: "bg-[#777777]",
    image: "ethereum.svg",
    disabledNetworks: [],
    symbol: "ETH",
  },
  {
    name: bsc.name,
    chainId: bsc.id,
    layerzeroChainId: 102,
    nftContractAddress: "0x34b9d8B0B52F827c0f6657183ef88E6e0EefF54c",
    blockConfirmation: 1,
    colorClass: "bg-[#E8B30B]",
    image: "bsc.svg",
    disabledNetworks: [122, 8217],
    symbol: "BNB",
  },
  {
    name: avalanche.name,
    chainId: avalanche.id,
    layerzeroChainId: 106,
    nftContractAddress: "0x9CBF2D3955CA59E471546C04FAF552De435E89B1",
    blockConfirmation: 1,
    colorClass: "bg-[#E84142]",
    image: "avalanche.svg",
    disabledNetworks: [1116],
    symbol: "AVAX",
  },
  /*   {
        name: "Aptos",
        chainId: 108,
        layerzeroChainId: 10109,
        nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
        blockConfirmation: 1,
        colorClass: "bg-[#E8B30B]"
      }, */
  {
    name: polygon.name,
    chainId: polygon.id,
    layerzeroChainId: 109,
    nftContractAddress: "0x9F810ccdfBe675Dd8aD62e5107726078286b3178",
    blockConfirmation: 1,
    colorClass: "bg-[#7F43DF]",
    image: "polygon.svg",
    logIndex: 2,
    disabledNetworks: [8217],
    symbol: "MATIC",
  },
  {
    name: arbitrum.name,
    chainId: arbitrum.id,
    layerzeroChainId: 110,
    nftContractAddress: "0x7554C507Ac1F7B0E09a631Bc929fFd3F7a492b01",
    blockConfirmation: 1,
    colorClass: "bg-[#12AAFF]",
    image: "arbitrum.svg",
    disabledNetworks: [122, 1116, 8217],
    symbol: "ETH",
  },
  {
    name: optimism.name,
    chainId: optimism.id,
    layerzeroChainId: 111,
    nftContractAddress: "0xd37f0A54956401e082Ec3307f2829f404E3C1AB4",
    blockConfirmation: 1,
    colorClass: "bg-[#FF0420]",
    image: "optimism.svg",
    disabledNetworks: [66, 122, 1116, 8217],
    symbol: "ETH",
  },
  {
    name: fantom.name,
    chainId: fantom.id,
    layerzeroChainId: 112,
    nftContractAddress: "0xAcb168F30855c5C87D38a91818f8961C4046Da12",
    blockConfirmation: 1,
    colorClass: "bg-[#196aff]",
    image: "fantom.svg",
    disabledNetworks: [66, 122, 1116, 8217],
    symbol: "FTM",
  },
  /*   {
      name: dfk.name,
      chainId: dfk.id,
      layerzeroChainId: 115,
      nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
      blockConfirmation: 1,
      colorClass: "bg-[#81bb04]",
      image: "dfk.svg",
    }, */
  {
    name: harmonyOne.name,
    chainId: harmonyOne.id,
    layerzeroChainId: 116,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#41dccc]",
    image: "harmony.svg",
    disabledNetworks: [
      66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
      42170,
    ],
    symbol: "ONE",
  },
  /*   {
      name: "Dexalot",
      chainId: 432204,
      layerzeroChainId: 118,
      nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
      blockConfirmation: 1,
      colorClass: "bg-[#E51981]",
      image: "dexalot.svg",
    }, */
  /* {
      name: celo.name,
      chainId: celo.id,
      layerzeroChainId: 125,
      nftContractAddress: "0xD80F5AA411Ab5b84973b8866F615a4eC0244B8D9",
      blockConfirmation: 1,
      colorClass: "bg-[#36d07e]",
      image: "celo.svg",
    }, */
  {
    name: moonbeam.name,
    chainId: moonbeam.id,
    layerzeroChainId: 126,
    nftContractAddress: "0x7554C507Ac1F7B0E09a631Bc929fFd3F7a492b01",
    blockConfirmation: 1,
    colorClass: "bg-[#1fcceb]",
    image: "moonbeam.svg",
    disabledNetworks: [
      66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
      42170,
    ],
    symbol: "GLMR",

  },
  {
    name: "Fuse",
    chainId: 122,
    layerzeroChainId: 138,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#a9f7b0]",
    image: "fuse.svg",
    disabledNetworks: [
      10, 56, 128566, 82, 324, 1101, 1116, 1285, 1559, 2222, 42161, 42170,
      1666600000,
    ],
    symbol: "FUSE",
  },
  {
    name: gnosis.name,
    chainId: gnosis.id,
    layerzeroChainId: 145,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#57ac86]",
    image: "gnosis.svg",
    disabledNetworks: [66, 82, 324, 1116, 1285, 1559, 2222, 1666600000],
    symbol: "GNO",
  },
  {
    name: klaytn.name,
    chainId: klaytn.id,
    layerzeroChainId: 150,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#f82e08]",
    image: "klaytn.svg",
    disabledNetworks: [
      10, 56, 66, 82, 137, 324, 1101, 1116, 1285, 1559, 2222, 7700, 42161,
      42170, 1666600000,
    ],
    symbol: "KLAY",
  },
  {
    name: metis.name,
    chainId: metis.id,
    layerzeroChainId: 151,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#00CDB7]",
    image: "metis.svg",
    disabledNetworks: [66, 324, 1101, 1116, 1666600000],
    symbol: "METIS",
  },
  {
    name: "CoreDAO",
    chainId: 1116,
    layerzeroChainId: 153,
    nftContractAddress: "0xD80F5AA411Ab5b84973b8866F615a4eC0244B8D9",
    blockConfirmation: 1,
    colorClass: "bg-[#FDBE08]",
    image: "coredao.svg",
    disabledNetworks: [
      10, 66, 82, 100, 122, 324, 1088, 1116, 1285, 1559, 2222, 7700, 8217,
      42161, 42170, 43114, 1666600000,
    ],
    symbol: "CORE",
  },
  {
    name: "OKT (OKX)",
    chainId: 66,
    layerzeroChainId: 155,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#000000]",
    image: "okex.svg",
    disabledNetworks: [
      10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
      42170, 1666600000,
    ],
    symbol: "OKT",
  },
  {
    name: polygonZkEvm.name,
    chainId: polygonZkEvm.id,
    layerzeroChainId: 158,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#7939D5]",
    image: "polygon-zkevm.svg",
    disabledNetworks: [
      66, 82, 122, 1116, 1285, 1559, 7700, 8217, 42170, 1666600000,
    ],
    symbol: "MATIC",
  },
  {
    name: canto.name,
    chainId: canto.id,
    layerzeroChainId: 159,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#34EEA4]",
    image: "canto.svg",
    disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
    symbol: "CANTO",
  },
  {
    name: zkSync.name,
    chainId: zkSync.id,
    layerzeroChainId: 165,
    nftContractAddress: "0x65020a18bbC5e535601423972b1C28eAc79a09F6",
    blockConfirmation: 1,
    colorClass: "bg-[#8C8DFC]",
    image: "zksync-era.svg",
    logIndex: 3,
    disabledNetworks: [66, 100, 122, 1088, 1116, 1285, 2222, 8217, 1666600000],
    symbol: "ETH",
  },
  {
    name: moonriver.name,
    chainId: moonriver.id,
    layerzeroChainId: 167,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#E6AE05]",
    image: "moonriver.svg",
    disabledNetworks: [
      66, 82, 100, 122, 324, 1101, 1116, 1559, 7700, 8217, 42170, 1666600000,
    ],
    symbol: "MOVR",
  },
  {
    name: "Tenet",
    chainId: 1559,
    layerzeroChainId: 173,
    nftContractAddress: "0x9954f0B7a7589f6D10a1C40C8bE5c2A81950FB46",
    blockConfirmation: 1,
    colorClass: "bg-[#F2F2F2]",
    image: "tenet.svg",
    disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
    symbol: "TENET",
  },
  {
    name: "Arbitrum Nova",
    chainId: 42170,
    layerzeroChainId: 175,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#E37B1E]",
    image: "arb-nova.svg",
    disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
    symbol: "ETH",
  },
  {
    name: "Meter.io",
    chainId: 82,
    layerzeroChainId: 176,
    nftContractAddress: "0x1A21779466dA680f872Eb58a10208b42D6d75508",
    blockConfirmation: 1,
    colorClass: "bg-[#1C2A59]",
    image: "meter.svg",
    disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
    symbol: "MTRG",
  },
  {
    name: "Kava",
    chainId: 2222,
    layerzeroChainId: 177,
    nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
    blockConfirmation: 1,
    colorClass: "bg-[#F2524B]",
    image: "kava.svg",
    disabledNetworks: [
      66, 82, 100, 122, 324, 1116, 1559, 7700, 8217, 42170, 1666600000,
    ],
    symbol: "KAVA",
  },
];

const ConnectButton: any = dynamic(() => import("@/components/ConnectButton"), {
  ssr: false,
});

export interface Network {
  name: string;
  chainId: number;
  layerzeroChainId: number;
  nftContractAddress: string;
  blockConfirmation: number;
  colorClass: string;
  image: string;
  logIndex?: number;
  disabledNetworks?: number[];
  symbol?: string;
}

const ANIMATION_TIME = 4000;

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState(networks[1]);
  const [tokenIds, setTokenIds] = useState({});
  const [showInput, setShowInput] = useState(false);
  const [refCode, setRefCode] = useState<string>("");
  const [inputTokenId, setInputTokenId] = useState("");
  const [estimatedGas, setEstimatedGas] = useState("");
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const [layerZeroTxHashes, setLayerZeroTxHashes] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [mintCounter, setMintCounter] = useState(0);
  const [gasRefuelAmount, setGasRefuelAmount] = useState(0);

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const { address: account } = useAccount();
  /* const { data: ownerOfData } = useContractRead({
      address: sourceChain.nftContractAddress as `0x${string}`,
      abi: MerklyLZAbi,
      functionName: "ownerOf",
      chainId: sourceChain.chainId,
      args: [inputTokenId],
    }); */

  const { data: bridgeTxResultData } = useWaitForTransaction({
    hash: layerZeroTxHashes[layerZeroTxHashes.length - 1] as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
  });

  // get balance of user on source chain
  const { data: balanceOfData } = useBalance({
    address: account as `0x${string}`,
    chainId: sourceChain.chainId,
  });

  // balance useeffect
  useEffect(() => {
    if (!balanceOfData) return;

}, [account, sourceChain, balanceOfData]);
  console.log("balanceOfData", balanceOfData);
  useEffect(() => {
    if (!searchParams?.ref) return;
    setRefCode(searchParams?.ref as string);
  }, [searchParams?.ref]);

  useEffect(() => {
    if (!bridgeTxResultData) return;
    toast("Bridge successful!");
    // hide card
    setIsAnimationStarted(true);

    setTimeout(() => {
      setIsAnimationStarted(false);
    }, ANIMATION_TIME);
  }, [bridgeTxResultData]);

  // TODO: send a balanceOf() call just in case user still has the token IDS on initial page load.
  // Do the same check after clicking the bridge button

  // console.log("ownerOfData", ownerOfData);

  useEffect(() => {
    const tokenIdsLocalStorage = localStorage.getItem("tokenIds");
    if (!tokenIdsLocalStorage) {
      localStorage.setItem("tokenIds", JSON.stringify({}));
    } else {
      if (account) {
        setInputTokenId(
          JSON.parse(tokenIdsLocalStorage)[sourceChain.chainId]?.[
            account
          ]?.[0] || ""
        );
      }
    }
    setTokenIds(tokenIdsLocalStorage ? JSON.parse(tokenIdsLocalStorage) : {});
  }, [account, sourceChain]);

  useEffect(() => {
    mintCounterFunc();
  }, [connectedChain, account]);

  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find(
      (network) => network.name === selectedNetwork.name
    );
    const tokenIdsLocalStorage = localStorage.getItem("tokenIds");
    const tokenIdsFormatted = JSON.parse(tokenIdsLocalStorage || "{}");
    if (chain) {
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }
        if (chain.name === targetChain.name) {
          setTargetChain(sourceChain);
        }
        if (tokenIdsLocalStorage && account) {
          setInputTokenId(
            tokenIdsFormatted[chain.chainId]?.[account]?.[0] || ""
          );
        }
        setSourceChain(chain);
        toast("Chain changed!");
      } catch (error: any) {
        if (error.code === 4001)
          return toast(
            "You need to confirm the Metamask request in order to switch network."
          );
        console.log(error.code);
        return toast("An error occured.");
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

  console.log("estimatedGas", estimatedGas);

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

  //mint counter func
  const mintCounterFunc = async () => {
    const { data } = await axios.post("/api/counter");

    console.log("data:", data);

    setMintCounter(data?.counter);
  };

  const handleMax = () => {
    if (balanceOfData) {
      setGasRefuelAmount(balanceOfData?.formatted);
    }
  };

  return (
    <div
      className={"relative w-full h-[100vh] min-h-[800px] overflow-x-hidden"}
    >
      {isModalOpen ? (
        <RefModal
          onCloseModal={() => {
            setIsModalOpen(false);
          }}
        />
      ) : null}

      {isFAQModalOpen ? (
        <FAQModal
          onCloseModal={() => {
            setIsFAQModalOpen(false);
          }}
        />
      ) : null}

      {isHistoryModalOpen ? (
        <HistoryModal
          onCloseModal={() => {
            setIsHistoryModalOpen(false);
          }}
        />
      ) : null}

      {isMintModalOpen ? (
        <MintModal
          onCloseModal={() => {
            setIsMintModalOpen(false);
          }}
          sourceChain={sourceChain}
          targetChain={targetChain}
          setInputTokenId={setInputTokenId}
          setTokenIds={setTokenIds}
          refCode={refCode}
          logIndex={sourceChain.logIndex}
        />
      ) : null}
      <div
        className={
          "absolute overflow-y-scroll z-10 w-full min-h-[800px] h-full flex flex-col p-2"
        }
      >
        <div className={"container mx-auto h-full flex flex-col"}>
          <div
            className={
              "w-full flex flex-row items-center justify-between mt-16 gap-2"
            }
          >
            <div className="flex flex-col items-start select-none">
              <div className="flex flex-row items-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 633 549"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg%22%3E"
                >
                  <path
                    d="M553.738 399.006L392.48 548.506C297.662 466.11 263.499 376 255.995 317.496C225.5 171.5 306.999 129.999 336.496 117.999C438.496 76.4994 541.486 224.496 553.738 236.994C571.986 262.994 606.233 298.835 632.48 326.006L574.48 379.777L400.98 195.506C332.985 126.493 221.474 195.504 297.48 294.506L405.48 410.506L491.48 331.006L553.738 399.006Z"
                    fill="white"
                  />
                  <path
                    d="M78.7422 149.5L240.001 1.79982e-05C334.818 82.3954 368.981 172.506 376.486 231.01C406.98 377.006 325.481 418.507 295.985 430.506C193.985 472.006 90.9949 324.009 78.7422 311.512C60.4949 285.512 26.2478 249.671 0.000598658 222.5L58.0006 168.729L231.501 353C299.495 422.013 411.007 353.002 335.001 254L227.001 138L141.001 217.5L78.7422 149.5Z"
                    fill="white"
                  />
                </svg>
                <div className="flex flex-col items-end mt-3 ml-2">
                  <h1 className={"text-2xl lg:text-4xl font-bold mt-2"}>
                    DappGate
                  </h1>
                  <div
                    className={
                      "px-3 lg:px-6 py-0.5 lg:py-1 rounded-3xl border-2 border-white text-[10px] lg:text-[12px] transition-all hover:bg-white hover:text-black"
                    }
                  >
                    Alpha
                  </div>
                </div>
              </div>
            </div>
            <ConnectButton />
          </div>
          <div className="flex flex-row justify-center mt-5 mb-5">
            <div className={"flex gap-4"}>
              <button onClick={() => setIsModalOpen(true)}>Refer</button>
              <button onClick={() => setIsFAQModalOpen(true)}>FAQ</button>
              <a href={"/"}>Docs</a>
              <button onClick={() => setIsHistoryModalOpen(true)}>
                History
              </button>
            </div>
          </div>
          <div
            className={
              "h-full w-full min-h-fit flex flex-col gap-4 items-center justify-center mt-4"
            }
          >
            <Tab.Group onChange={setTabIndex} selectedIndex={tabIndex}>
              <Tab.List className="p-1 sm:p-2.5 bg-white bg-opacity-10 backdrop-blur-[3px] rounded-xl">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-2 sm:px-4 py-1 sm:py-2.5 rounded-lg text-white outline-none text-sm sm:text-base ${
                        selected
                          ? "bg-white bg-opacity-[1%] backdrop-blur-[3px] "
                          : "bg-transparent"
                      }`}
                    >
                      NFT Bridge {"(ONFT)"}
                    </button>
                  )}
                </Tab>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-2 sm:px-4 py-1 sm:py-2.5 rounded-lg ml-2 text-white text-sm sm:text-base ${
                        selected
                          ? "bg-white bg-opacity-[1%] backdrop-blur-[3px] outline-none"
                          : "bg-transparent"
                      }`}
                    >
                      Token Bridge {"(OFT)"}
                    </button>
                  )}
                </Tab>

                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`px-2 sm:px-4 py-1 sm:py-2.5 rounded-lg ml-2 text-white text-sm sm:text-base ${
                        selected
                          ? "bg-white bg-opacity-[1%] backdrop-blur-[3px] outline-none"
                          : "bg-transparent"
                      }`}
                    >
                      Gas Refuel {"(OGAS)"}
                    </button>
                  )}
                </Tab>
              </Tab.List>
            </Tab.Group>
            {tabIndex == 1 ? (
              <div
                className={`w-full max-w-[800px] sm:h-[492px] bg-white bg-opacity-5  border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
              >
                <div
                  className={
                    "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"
                  }
                >
                  <Listbox value={sourceChain} onChange={onChangeSourceChain}>
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-4 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/chains/${sourceChain.image}`}
                            alt={targetChain.name}
                            width={25}
                            height={25}
                            className="rounded-full"
                          />
                          <span className="block truncate text-base text-xl font-medium">
                            {sourceChain.name}
                          </span>
                        </div>

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
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={25}
                                    height={25}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate text-base text-xl">
                                    {network.name}
                                  </span>
                                </div>
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
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-4 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center justify-between gap-2">
                          <span className="pointer-events-none flex items-center">
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                          <div className="flex items-center gap-2">
                          <span className="block truncate text-base text-xl">
                              {targetChain.name}
                            </span>

                            <Image
                              src={`/chains/${targetChain.image}`}
                              alt={targetChain.name}
                              width={25}
                              height={25}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 aria-disabled:bg-red-500/25 aria-disabled:grayscale ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                              disabled={sourceChain.disabledNetworks?.includes(
                                network.chainId
                              )}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate text-base text-xl font-medium">
                                    {network.name}
                                  </span>
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div className="flex flex-start text-xl xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
                  Claim Tokens
                </div>
                <div className="flex flex-row justify-between  w-full sm:w-full">
                  <input
                    type="text"
                    className="w-full flex rounded-lg bg-white bg-opacity-5 py-1 px-4 text-left text-lg focus:outline-none mt-2 mb-2"
                    placeholder="Amount To Claim"
                    value={inputTokenId}
                    onChange={(e) => setInputTokenId(e.target.value)}
                  />

                  <button
                    className="flex rounded-lg bg-blue-600 py-3 px-4 text-left text-lg  mt-2 ml-3 mb-4"
                    onClick={() => {
                      setIsMintModalOpen(true);
                    }}
                  >
                    Claim
                  </button>
                </div>

                <div className="flex text-xl xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
                  <div className="text-white-700">DGATE To Bridge</div>
                  <div className="text-white-700">Balance: 0</div>
                </div>
                {/** Create Logo and Token name label button and at the same row create a input box with max option  */}
                <div className="relative flex flex-row justify-between  w-full sm:w-full">
                  {/** In input box create a max option for balance max */}

                  <input
                    type="text"
                    className="w-full flex rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none mt-2"
                    placeholder="Amount To Bridge"
                    value={inputTokenId}
                    onChange={(e) => setInputTokenId(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 mt-1 transform -translate-y-1/2 px-3 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Max
                  </button>
                </div>
                <button
                  className="rounded-lg bg-blue-600 py-3 px-4 text-xl mt-4 text-center"
                  onClick={() => {
                    setIsMintModalOpen(true);
                  }}
                >
                  Bridge
                </button>
              </div>
            ) 
            : tabIndex == 2 ? (
              <div
                className={`w-full max-w-[800px] sm:h-[492px] bg-white bg-opacity-5  border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
              >
                <div
                  className={
                    "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8 mb-5"
                  }
                >
    
                  <Listbox value={sourceChain} onChange={onChangeSourceChain}>
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-4 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/chains/${sourceChain.image}`}
                            alt={targetChain.name}
                            width={25}
                            height={25}
                            className="rounded-full"
                          />
                          <span className="block truncate text-base text-xl font-medium">
                            {sourceChain.name}
                          </span>
                        </div>

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
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={25}
                                    height={25}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate text-base text-xl">
                                    {network.name}
                                  </span>
                                </div>
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
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-4 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center justify-between gap-2">
                          <span className="pointer-events-none flex items-center">
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                          <div className="flex items-center gap-2">
                          <span className="block truncate text-base text-xl">
                              {targetChain.name}
                            </span>

                            <Image
                              src={`/chains/${targetChain.image}`}
                              alt={targetChain.name}
                              width={25}
                              height={25}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 aria-disabled:bg-red-500/25 aria-disabled:grayscale ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                              disabled={sourceChain.disabledNetworks?.includes(
                                network.chainId
                              )}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate text-base text-xl font-medium">
                                    {network.name}
                                  </span>
                                </div>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div className="flex text-xl xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
                  <div className="text-white-700">Input amount of ${targetChain.symbol} to receive on {targetChain.name}</div>
                  <div className="text-white-700">Balance: {Number(balanceOfData?.formatted).toFixed(3)}</div>
                </div>
                {/** Create Logo and Token name label button and at the same row create a input box with max option  */}
                <div className="relative flex flex-row justify-between  w-full sm:w-full">
                  {/** In input box create a max option for balance max */}

                  <input
                    type="text"
                    className="w-full flex rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none mt-2"
                    placeholder="Amount To Bridge"
                    value={gasRefuelAmount}
                    onChange={(e) => setGasRefuelAmount(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 mt-1 transform -translate-y-1/2 px-3 py-2 bg-blue-500 text-white rounded-md"
                    onClick={handleMax}
                  >
                    Max
                  </button>
                </div>
                <button
                  className="rounded-lg bg-blue-600 py-3 px-4 text-xl mt-4 text-center"
                  onClick={() => {
                    setIsMintModalOpen(true);
                  }}
                >
                  Refuel
                </button><br></br>

                Disclaimer<br></br>

Slippage and max transfer caps are 100% controlled by LayerZero.<br></br>
Merkly does not profit from gas refueling.
              </div>
            ) 
            
            
            
            : (
              <div
                className={`w-full max-w-[800px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
              >
                <div className="flex flex-row justify-between items-center">
                  <h1 className={"text-3xl font-semibold"}>Bridge</h1>
                  <h1 className={"text-2xl font-semibold text-center"}>
                    {" "}
                    {mintCounter} / 50.000
                  </h1>
                </div>
                <div
                  className={
                    "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"
                  }
                >
                  <Listbox value={sourceChain} onChange={onChangeSourceChain}>
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/chains/${sourceChain.image}`}
                            alt={targetChain.name}
                            width={25}
                            height={25}
                            className="rounded-full"
                          />
                        <span className="block truncate text-base text-xl font-medium">
                            {sourceChain.name}
                          </span>
                        </div>

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
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate text-base text-xl">
                                    {network.name}
                                  </span>
                                </div>
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
                    <div className="relative w-full sm:w-[36%]">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none ">
                        <div className="flex items-center justify-between gap-2">
                          <span className="pointer-events-none flex items-center">
                            <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                          <div className="flex items-center gap-2">
                          <span className="block truncate text-base text-xl font-medium">
                              {targetChain.name}
                            </span>

                            <Image
                              src={`/chains/${targetChain.image}`}
                              alt={targetChain.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white bg-opacity-20 backdrop-blur-[3px]  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {networks.map((network, i) => (
                            <Listbox.Option
                              key={i}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 aria-disabled:bg-red-500/25 aria-disabled:grayscale ${
                                  active
                                    ? "bg-white text-black"
                                    : "text-gray-300"
                                }`
                              }
                              value={network}
                              disabled={sourceChain.disabledNetworks?.includes(
                                network.chainId
                              )}
                            >
                              {({ selected }) => (
                                <div className="flex items-center gap-2">
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black ">
                                      <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                  ) : null}
                                  <Image
                                    src={`/chains/${network.image}`}
                                    alt={network.name}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                  <span className="block truncate">
                                    {network.name}
                                  </span>
                                </div>
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
                    "flex flex-col justify-center items-center gap-6 w-full mt-12 select-none"
                  }
                >
                  <MintButton
                    setInputTokenId={setInputTokenId}
                    setTokenIds={setTokenIds}
                    sourceChain={sourceChain}
                    targetChain={targetChain}
                    refCode={refCode!}
                    logIndex={sourceChain.logIndex}
                  />

                  <div className="flex flex-col items-center">
                    <BridgeButton
                      sourceChain={sourceChain}
                      targetChain={targetChain}
                      inputTokenId={inputTokenId}
                      setInputTokenId={setInputTokenId}
                      tokenIds={tokenIds}
                      setTokenIds={setTokenIds}
                      setLayerZeroTxHashes={setLayerZeroTxHashes}
                      setEstimatedGas={setEstimatedGas}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      cursor="pointer"
                      onClick={() => setShowInput((prev) => !prev)}
                      className="w-8 h-8 mt-2 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faAngleDown} />
                    </svg>
                    <div
                      className={`w-[150px] mt-4 transition-all overflow-hidden ${
                        !showInput ? "max-h-[0px]" : "max-h-[200px]"
                      }`}
                    >
                      <input
                        placeholder="Token ID"
                        onChange={(e) => setInputTokenId(e.target.value)}
                        value={inputTokenId}
                        type="number"
                        className={`bg-white/10 border-white border-[1px] rounded-lg px-8 py-2 w-full text-center`}
                      />
                    </div>
                    <span className="mt-3">Estimated gas: {estimatedGas}</span>
                  </div>
                </div>
                <div
                  className={`w-full flex flex-col gap-4 mt-8 transition-all overflow-hidden ${
                    layerZeroTxHashes.length !== 0
                      ? "max-h-[1000px]"
                      : "max-h-0"
                  }`}
                >
                  <h1 className={"text-3xl font-semibold"}>
                    Layer Zero Transactions
                  </h1>
                  {layerZeroTxHashes.map((hash, i) => {
                    return (
                      <div key={hash} className="ml-4">
                        Transaction #{i + 1}:
                        <a
                          href={`https://layerzeroscan.com/tx/${hash}`}
                          target="_blank"
                          className="text-orange-400"
                        >
                          {` layerzeroscan.com/tx/${formatAddress(hash)}`}
                        </a>
                      </div>
                    );
                  })}
                </div>
                <a
                  href="https://layerzero.network/"
                  target="_blank"
                  className="self-center"
                >
                  <svg
                    width="150"
                    height="20"
                    viewBox="0 0 150 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.08416 14V5.27273H4.03303C4.71768 5.27273 5.27734 5.39631 5.712 5.64347C6.1495 5.88778 6.47337 6.21875 6.68359 6.63636C6.89382 7.05398 6.99893 7.51989 6.99893 8.03409C6.99893 8.5483 6.89382 9.01562 6.68359 9.43608C6.47621 9.85653 6.15519 10.1918 5.72053 10.4418C5.28587 10.6889 4.72905 10.8125 4.05007 10.8125H1.93643V9.875H4.01598C4.48473 9.875 4.86115 9.79403 5.14524 9.6321C5.42933 9.47017 5.6353 9.25142 5.76314 8.97585C5.89382 8.69744 5.95916 8.38352 5.95916 8.03409C5.95916 7.68466 5.89382 7.37216 5.76314 7.09659C5.6353 6.82102 5.42791 6.60511 5.14098 6.44886C4.85405 6.28977 4.47337 6.21023 3.99893 6.21023H2.14098V14H1.08416ZM11.1538 14.1364C10.5629 14.1364 10.0444 13.9957 9.59837 13.7145C9.15518 13.4332 8.80859 13.0398 8.55859 12.5341C8.31143 12.0284 8.18786 11.4375 8.18786 10.7614C8.18786 10.0795 8.31143 9.48437 8.55859 8.97585C8.80859 8.46733 9.15518 8.07244 9.59837 7.79119C10.0444 7.50994 10.5629 7.36932 11.1538 7.36932C11.7447 7.36932 12.2617 7.50994 12.7049 7.79119C13.1509 8.07244 13.4975 8.46733 13.7447 8.97585C13.9947 9.48437 14.1197 10.0795 14.1197 10.7614C14.1197 11.4375 13.9947 12.0284 13.7447 12.5341C13.4975 13.0398 13.1509 13.4332 12.7049 13.7145C12.2617 13.9957 11.7447 14.1364 11.1538 14.1364ZM11.1538 13.233C11.6026 13.233 11.9719 13.1179 12.2617 12.8878C12.5515 12.6577 12.766 12.3551 12.9052 11.9801C13.0444 11.6051 13.114 11.1989 13.114 10.7614C13.114 10.3239 13.0444 9.91619 12.9052 9.53835C12.766 9.16051 12.5515 8.85511 12.2617 8.62216C11.9719 8.3892 11.6026 8.27273 11.1538 8.27273C10.7049 8.27273 10.3356 8.3892 10.0458 8.62216C9.75604 8.85511 9.54155 9.16051 9.40234 9.53835C9.26314 9.91619 9.19354 10.3239 9.19354 10.7614C9.19354 11.1989 9.26314 11.6051 9.40234 11.9801C9.54155 12.3551 9.75604 12.6577 10.0458 12.8878C10.3356 13.1179 10.7049 13.233 11.1538 13.233ZM16.9151 14L14.9208 7.45455H15.9776L17.3924 12.4659H17.4606L18.8583 7.45455H19.9322L21.3129 12.4489H21.381L22.7958 7.45455H23.8526L21.8583 14H20.8697L19.4379 8.97159H19.3356L17.9038 14H16.9151ZM27.7038 14.1364C27.0732 14.1364 26.5291 13.9972 26.0717 13.7188C25.6172 13.4375 25.2663 13.0455 25.0192 12.5426C24.7749 12.0369 24.6527 11.4489 24.6527 10.7784C24.6527 10.108 24.7749 9.51705 25.0192 9.00568C25.2663 8.49148 25.6101 8.09091 26.0504 7.80398C26.4936 7.5142 27.0107 7.36932 27.6016 7.36932C27.9425 7.36932 28.2791 7.42614 28.6115 7.53977C28.9439 7.65341 29.2464 7.83807 29.5192 8.09375C29.7919 8.34659 30.0092 8.68182 30.1712 9.09943C30.3331 9.51705 30.4141 10.0312 30.4141 10.642V11.0682H25.3686V10.1989H29.3913C29.3913 9.82955 29.3175 9.5 29.1697 9.21023C29.0249 8.92045 28.8175 8.69176 28.5476 8.52415C28.2805 8.35653 27.9652 8.27273 27.6016 8.27273C27.201 8.27273 26.8544 8.37216 26.5618 8.57102C26.272 8.76705 26.049 9.02273 25.8928 9.33807C25.7365 9.65341 25.6584 9.99148 25.6584 10.3523V10.9318C25.6584 11.4261 25.7436 11.8452 25.9141 12.1889C26.0874 12.5298 26.3274 12.7898 26.6342 12.9688C26.9411 13.1449 27.2976 13.233 27.7038 13.233C27.968 13.233 28.2067 13.196 28.4197 13.1222C28.6357 13.0455 28.8217 12.9318 28.978 12.7812C29.1342 12.6278 29.255 12.4375 29.3402 12.2102L30.3118 12.483C30.2095 12.8125 30.0376 13.1023 29.7962 13.3523C29.5547 13.5994 29.2564 13.7926 28.9013 13.9318C28.5462 14.0682 28.147 14.1364 27.7038 14.1364ZM31.9439 14V7.45455H32.9155V8.44318H32.9837C33.103 8.11932 33.3189 7.85653 33.6314 7.65483C33.9439 7.45312 34.2962 7.35227 34.6882 7.35227C34.7621 7.35227 34.8544 7.35369 34.9652 7.35653C35.076 7.35937 35.1598 7.36364 35.2166 7.36932V8.39205C35.1825 8.38352 35.1044 8.37074 34.9822 8.35369C34.8629 8.33381 34.7365 8.32386 34.603 8.32386C34.2848 8.32386 34.0007 8.39062 33.7507 8.52415C33.5036 8.65483 33.3075 8.83665 33.1626 9.0696C33.0206 9.29972 32.9496 9.5625 32.9496 9.85795V14H31.9439ZM38.9538 14.1364C38.3232 14.1364 37.7791 13.9972 37.3217 13.7188C36.8672 13.4375 36.5163 13.0455 36.2692 12.5426C36.0249 12.0369 35.9027 11.4489 35.9027 10.7784C35.9027 10.108 36.0249 9.51705 36.2692 9.00568C36.5163 8.49148 36.8601 8.09091 37.3004 7.80398C37.7436 7.5142 38.2607 7.36932 38.8516 7.36932C39.1925 7.36932 39.5291 7.42614 39.8615 7.53977C40.1939 7.65341 40.4964 7.83807 40.7692 8.09375C41.0419 8.34659 41.2592 8.68182 41.4212 9.09943C41.5831 9.51705 41.6641 10.0312 41.6641 10.642V11.0682H36.6186V10.1989H40.6413C40.6413 9.82955 40.5675 9.5 40.4197 9.21023C40.2749 8.92045 40.0675 8.69176 39.7976 8.52415C39.5305 8.35653 39.2152 8.27273 38.8516 8.27273C38.451 8.27273 38.1044 8.37216 37.8118 8.57102C37.522 8.76705 37.299 9.02273 37.1428 9.33807C36.9865 9.65341 36.9084 9.99148 36.9084 10.3523V10.9318C36.9084 11.4261 36.9936 11.8452 37.1641 12.1889C37.3374 12.5298 37.5774 12.7898 37.8842 12.9688C38.1911 13.1449 38.5476 13.233 38.9538 13.233C39.218 13.233 39.4567 13.196 39.6697 13.1222C39.8857 13.0455 40.0717 12.9318 40.228 12.7812C40.3842 12.6278 40.505 12.4375 40.5902 12.2102L41.5618 12.483C41.4595 12.8125 41.2876 13.1023 41.0462 13.3523C40.8047 13.5994 40.5064 13.7926 40.1513 13.9318C39.7962 14.0682 39.397 14.1364 38.9538 14.1364ZM45.6655 14.1364C45.12 14.1364 44.6385 13.9986 44.2209 13.723C43.8033 13.4446 43.4766 13.0526 43.2408 12.5469C43.005 12.0384 42.8871 11.4375 42.8871 10.7443C42.8871 10.0568 43.005 9.46023 43.2408 8.95455C43.4766 8.44886 43.8047 8.05824 44.2251 7.78267C44.6456 7.5071 45.1314 7.36932 45.6825 7.36932C46.1087 7.36932 46.4453 7.44034 46.6925 7.58239C46.9425 7.72159 47.1328 7.88068 47.2635 8.05966C47.397 8.2358 47.5007 8.38068 47.5746 8.49432H47.6598V5.27273H48.6655V14H47.6939V12.9943H47.5746C47.5007 13.1136 47.3956 13.2642 47.2592 13.446C47.1229 13.625 46.9283 13.7855 46.6754 13.9276C46.4226 14.0668 46.0859 14.1364 45.6655 14.1364ZM45.8018 13.233C46.2053 13.233 46.5462 13.1278 46.8246 12.9176C47.103 12.7045 47.3146 12.4105 47.4595 12.0355C47.6044 11.6577 47.6768 11.2216 47.6768 10.7273C47.6768 10.2386 47.6058 9.81108 47.4638 9.4446C47.3217 9.07528 47.1115 8.78835 46.8331 8.58381C46.5547 8.37642 46.2109 8.27273 45.8018 8.27273C45.3757 8.27273 45.0206 8.3821 44.7365 8.60085C44.4553 8.81676 44.2436 9.1108 44.1016 9.48295C43.9624 9.85227 43.8928 10.267 43.8928 10.7273C43.8928 11.1932 43.9638 11.6165 44.1058 11.9972C44.2507 12.375 44.4638 12.6761 44.745 12.9006C45.0291 13.1222 45.3814 13.233 45.8018 13.233ZM54.1584 14V5.27273H55.1641V8.49432H55.2493C55.3232 8.38068 55.4254 8.2358 55.5561 8.05966C55.6896 7.88068 55.88 7.72159 56.1271 7.58239C56.3771 7.44034 56.7152 7.36932 57.1413 7.36932C57.6925 7.36932 58.1783 7.5071 58.5987 7.78267C59.0192 8.05824 59.3473 8.44886 59.5831 8.95455C59.8189 9.46023 59.9368 10.0568 59.9368 10.7443C59.9368 11.4375 59.8189 12.0384 59.5831 12.5469C59.3473 13.0526 59.0206 13.4446 58.603 13.723C58.1854 13.9986 57.7038 14.1364 57.1584 14.1364C56.7379 14.1364 56.4013 14.0668 56.1484 13.9276C55.8956 13.7855 55.701 13.625 55.5646 13.446C55.4283 13.2642 55.3232 13.1136 55.2493 12.9943H55.13V14H54.1584ZM55.147 10.7273C55.147 11.2216 55.2195 11.6577 55.3643 12.0355C55.5092 12.4105 55.7209 12.7045 55.9993 12.9176C56.2777 13.1278 56.6186 13.233 57.022 13.233C57.4425 13.233 57.7933 13.1222 58.0746 12.9006C58.3587 12.6761 58.5717 12.375 58.7138 11.9972C58.8587 11.6165 58.9311 11.1932 58.9311 10.7273C58.9311 10.267 58.8601 9.85227 58.718 9.48295C58.5788 9.1108 58.3672 8.81676 58.0831 8.60085C57.8018 8.3821 57.4482 8.27273 57.022 8.27273C56.6129 8.27273 56.2692 8.37642 55.9908 8.58381C55.7124 8.78835 55.5021 9.07528 55.3601 9.4446C55.218 9.81108 55.147 10.2386 55.147 10.7273ZM61.8885 16.4545C61.718 16.4545 61.5661 16.4403 61.4325 16.4119C61.299 16.3864 61.2067 16.3608 61.1555 16.3352L61.4112 15.4489C61.6555 15.5114 61.8714 15.5341 62.0589 15.517C62.2464 15.5 62.4126 15.4162 62.5575 15.2656C62.7053 15.1179 62.8402 14.8778 62.9624 14.5455L63.1499 14.0341L60.7294 7.45455H61.8203L63.6271 12.6705H63.6953L65.5021 7.45455H66.593L63.8146 14.9545C63.6896 15.2926 63.5348 15.5724 63.3501 15.794C63.1655 16.0185 62.951 16.1847 62.7067 16.2926C62.4652 16.4006 62.1925 16.4545 61.8885 16.4545Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M80.7171 4.97185e-07C79.9625 0.00374619 79.216 0.156195 78.5203 0.448667C77.8245 0.741139 77.1932 1.16793 76.6623 1.70459C76.1314 2.24125 75.7114 2.87731 75.4262 3.57644C75.141 4.27557 74.9962 5.02407 75.0001 5.7792V7.68811H79.6452V4.92249C79.6451 4.79261 79.6706 4.66399 79.7203 4.54398C79.7699 4.42397 79.8427 4.31493 79.9345 4.22308C80.0262 4.13123 80.1352 4.0584 80.2551 4.0087C80.375 3.95901 80.5035 3.93344 80.6333 3.93347H80.8008C80.9306 3.93344 81.0591 3.95901 81.1791 4.0087C81.299 4.0584 81.408 4.13123 81.4997 4.22308C81.5915 4.31493 81.6643 4.42397 81.714 4.54398C81.7636 4.66399 81.7892 4.7926 81.7892 4.92249V12.3365C82.3992 12.3365 83.0032 12.2163 83.5668 11.9827C84.1304 11.7491 84.6425 11.4067 85.0738 10.975C85.5052 10.5434 85.8473 10.031 86.0807 9.46701C86.3142 8.90303 86.4343 8.29855 86.4343 7.68811V5.7792C86.4376 4.24921 85.8355 2.7801 84.7597 1.69297C84.2318 1.1565 83.6025 0.730534 82.9084 0.439879C82.2144 0.149224 81.4694 -0.000314683 80.7171 4.97185e-07Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M80.801 16.0903H80.6336C80.5038 16.0903 80.3753 16.0648 80.2554 16.0151C80.1355 15.9654 80.0265 15.8925 79.9348 15.8007C79.843 15.7089 79.7702 15.5999 79.7206 15.4799C79.6709 15.3599 79.6454 15.2313 79.6454 15.1014V7.6875C79.0354 7.68745 78.4313 7.80763 77.8677 8.04121C77.3041 8.27479 76.7921 8.61718 76.3607 9.04883C75.9294 9.48048 75.5872 9.99293 75.3538 10.5569C75.1204 11.1209 75.0002 11.7254 75.0003 12.3358V14.2182C74.9926 14.9744 75.1347 15.7246 75.4186 16.4256C75.7024 17.1265 76.1223 17.7641 76.6539 18.3016C77.1856 18.8391 77.8184 19.2658 78.5159 19.557C79.2134 19.8482 79.9616 19.9981 80.7174 19.9981C81.4731 19.9981 82.2214 19.8482 82.9189 19.557C83.6163 19.2658 84.2492 18.8391 84.7808 18.3016C85.3125 17.7641 85.7324 17.1265 86.0162 16.4256C86.3001 15.7246 86.4422 14.9744 86.4345 14.2182V12.3358H81.7894V15.1014C81.7894 15.2313 81.7638 15.3599 81.7141 15.4799C81.6645 15.5999 81.5917 15.7089 81.4999 15.8007C81.4081 15.8926 81.2991 15.9654 81.1792 16.0151C81.0593 16.0648 80.9308 16.0903 80.801 16.0903Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M94.3741 5.86719H92.7461V14.132H97.5245V12.5738H94.3743L94.3741 5.86719Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M102.74 8.92741C102.51 8.64184 102.216 8.41482 101.882 8.265C101.547 8.11518 101.182 8.04682 100.816 8.06552C100.434 8.06251 100.056 8.14161 99.7066 8.29747C99.3575 8.45333 99.0459 8.68233 98.7928 8.969C98.2495 9.57826 97.9492 10.3663 97.9492 11.1828C97.9492 11.9994 98.2495 12.7875 98.7928 13.3967C99.046 13.6833 99.3576 13.9122 99.7067 14.068C100.056 14.2238 100.434 14.3028 100.816 14.2998C101.642 14.2998 102.283 14.0125 102.74 13.4379V14.1346H104.262V8.23127H102.74V8.92741ZM102.274 12.3811C102.12 12.5349 101.937 12.6556 101.735 12.7358C101.533 12.8159 101.317 12.8539 101.1 12.8474C100.883 12.8543 100.668 12.8165 100.467 12.7363C100.266 12.656 100.084 12.5351 99.9315 12.3811C99.6352 12.0523 99.4713 11.6253 99.4713 11.1826C99.4713 10.7398 99.6352 10.3128 99.9315 9.98405C100.084 9.83016 100.266 9.70932 100.467 9.62912C100.668 9.54891 100.883 9.51106 101.1 9.5179C101.317 9.51145 101.533 9.54949 101.735 9.62965C101.937 9.70981 102.12 9.8304 102.274 9.98405C102.573 10.3112 102.74 10.7388 102.74 11.1826C102.74 11.6263 102.573 12.054 102.274 12.3811Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M108.183 12.1983L106.644 8.23047H104.98L107.398 13.9452C107.297 14.2862 107.098 14.59 106.826 14.8189C106.54 15.013 106.197 15.1046 105.853 15.0789V16.4959C106.524 16.5581 107.196 16.3755 107.744 15.9818C108.25 15.5994 108.657 14.9868 108.964 14.144L111.115 8.23086H109.486L108.183 12.1983Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M114.408 8.06435C113.993 8.04976 113.579 8.12144 113.193 8.27492C112.808 8.4284 112.458 8.66034 112.166 8.95602C111.603 9.5619 111.291 10.3593 111.293 11.1868C111.295 12.0143 111.611 12.8101 112.178 13.413C112.768 14.0032 113.55 14.2983 114.526 14.2985C115.658 14.2985 116.516 13.8774 117.098 13.0354L115.871 12.3267C115.715 12.5249 115.513 12.6821 115.283 12.785C115.053 12.8878 114.801 12.9331 114.549 12.9171C113.645 12.9171 113.09 12.5472 112.886 11.8074H117.334C117.372 11.6009 117.392 11.3913 117.393 11.1813C117.415 10.359 117.112 9.56117 116.549 8.96164C116.277 8.66818 115.945 8.4363 115.575 8.28156C115.206 8.12682 114.808 8.05278 114.408 8.06435ZM112.862 10.6266C112.93 10.2797 113.118 9.96795 113.393 9.74673C113.686 9.53011 114.044 9.41976 114.407 9.43393C114.74 9.4296 115.065 9.53324 115.334 9.7293C115.62 9.9496 115.812 10.2702 115.871 10.6264L112.862 10.6266Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M119.977 9.24278V8.22711H118.455V14.1307H119.977V11.3089C119.977 10.7422 120.16 10.3368 120.526 10.0927C120.892 9.84857 121.335 9.74772 121.771 9.8093V8.10955C121.388 8.10469 121.011 8.20253 120.679 8.39291C120.351 8.58328 120.102 8.88473 119.977 9.24278Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M129.192 7.14542V5.86719H123.779V7.4258H127.13L123.691 12.8304V14.1318H129.258V12.5736H125.754L129.192 7.14542Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M132.851 8.06436C132.436 8.04976 132.023 8.12144 131.637 8.27492C131.251 8.4284 130.901 8.66033 130.61 8.95603C130.046 9.56188 129.734 10.3593 129.736 11.1869C129.739 12.0144 130.055 12.8101 130.621 13.413C131.211 14.0032 131.994 14.2983 132.969 14.2985C134.102 14.2985 134.959 13.8774 135.541 13.0354L134.314 12.3267C134.158 12.5249 133.957 12.6821 133.726 12.7849C133.496 12.8878 133.245 12.9331 132.993 12.9171C132.088 12.9171 131.534 12.5472 131.329 11.8074H135.778C135.815 11.6008 135.835 11.3913 135.836 11.1813C135.859 10.359 135.556 9.56117 134.993 8.96164C134.72 8.66817 134.388 8.4363 134.019 8.28156C133.65 8.12682 133.252 8.05277 132.851 8.06436ZM131.306 10.6266C131.373 10.2797 131.561 9.96789 131.837 9.74673C132.13 9.53004 132.487 9.41968 132.851 9.43394C133.184 9.4295 133.509 9.53315 133.778 9.7293C134.064 9.94957 134.255 10.2702 134.314 10.6264L131.306 10.6266Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M138.421 9.24669V8.23101H136.898V14.1346H138.421V11.3128C138.421 10.7461 138.603 10.3407 138.969 10.0966C139.335 9.85249 139.778 9.75164 140.214 9.81321V8.11345C139.831 8.10863 139.454 8.20648 139.123 8.39681C138.795 8.58715 138.546 8.88862 138.421 9.24669Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M143.683 8.06329C142.969 8.07118 142.28 8.32617 141.732 8.78497C141.185 9.24376 140.813 9.87809 140.679 10.5802C140.546 11.2823 140.66 12.009 141.001 12.6368C141.342 13.2646 141.89 13.7548 142.552 14.0243C143.213 14.2937 143.948 14.3257 144.63 14.1149C145.312 13.904 145.901 13.4633 146.295 12.8676C146.69 12.2719 146.866 11.558 146.795 10.8469C146.723 10.1358 146.407 9.4715 145.902 8.96678C145.613 8.67219 145.268 8.43996 144.886 8.28455C144.505 8.12914 144.095 8.05383 143.683 8.06329ZM144.828 12.3493C144.679 12.5001 144.5 12.6187 144.303 12.6978C144.106 12.7769 143.896 12.8148 143.683 12.8092C143.472 12.8152 143.262 12.7775 143.066 12.6983C142.87 12.6192 142.692 12.5004 142.544 12.3493C142.252 12.0302 142.09 11.6131 142.09 11.1803C142.09 10.7476 142.252 10.3305 142.544 10.0114C142.692 9.86036 142.87 9.74158 143.066 9.66243C143.262 9.58328 143.472 9.54548 143.683 9.55146C143.896 9.54589 144.106 9.58387 144.303 9.66297C144.5 9.74207 144.679 9.86063 144.828 10.0114C145.124 10.3287 145.288 10.7464 145.288 11.1803C145.288 11.6142 145.124 12.032 144.828 12.3493Z"
                      fill="#7D7D7D"
                    />
                    <path
                      d="M149.999 12.3125H148.146V14.1308H149.999V12.3125Z"
                      fill="#7D7D7D"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
          <div className={"mt-auto pb-16 flex justify-between items-center"}>
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
              <a
                href="https://twitter.com/Dappadofficial"
                target="_blank"
                className={"hover:text-gray-100 transition-all"}
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href={"https://discord.gg/dappadlaunchpad"}
                target="_blank"
                className={"hover:text-gray-100 transition-all"}
              >
                <FontAwesomeIcon icon={faDiscord} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={"relative w-full h-full"}>
        <div className={"absolute z-[4] bg-effect w-full h-full"}></div>
        <div className={"absolute z-[3] w-full h-full bg-pattern"}></div>
        <div
          className={
            "relative bg-blur w-full h-full overflow-hidden flex items-center justify-center"
          }
        >
          <div
            className={`absolute w-[100vw] aspect-square flex items-center content-center ${
              isAnimationStarted ? "arda" : ""
            }`}
          >
            <div
              className={`absolute h-[80vh] aspect-square ${sourceChain.colorClass} left-0 translate-x-[-50%] rounded-full`}
            ></div>
            <div
              className={`absolute h-[80vh] aspect-square ${targetChain.colorClass} translate-x-[50%] right-0 rounded-full`}
            ></div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
