"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import dynamic from "next/dynamic";
import {
  useAccount,
  useBalance,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Network, networks } from "@/utils/networks";
import RefModal from "./components/RefModal";
import HistoryModal from "./components/HistoryModal";
import FAQModal from "./components/FAQModal";
import DappGateLogo from "./components/DappGateLogo";
import Footer from "./components/Footer";
import BridgeModal from "./components/BridgeModal";
import ONFTBridge from "@/components/ONFTBridge";
import ONFTHyperBridge from "@/components/ONFTHyperBridge";
import GasRefuel from "@/components/GasRefuel";
import OFTBridge from "@/components/OFTBridge";
import OFTHyperBridge from "@/components/OFTHyperBridge";
import StargateBridge from "@/components/StargateBridge";
import Tabs, { tabsConfig } from "./components/Tabs";
import ONFTAbi from "@/config/abi/ONFT.json";
import Message from "@/components/Message";
import Navbar from "./components/Navbar";
import TracketModal from "./components/TrackerModal";

const ConnectButton: any = dynamic(() => import("./components/ConnectButton"), {
  ssr: false,
});

const ANIMATION_TIME = 4000;
const ANIMATION_END_TIME = 1000;

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState(networks[1]);
  const [refCode, setRefCode] = useState<string>("");
  const [estimatedGas, setEstimatedGas] = useState("");
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const [layerZeroTxHashes, setLayerZeroTxHashes] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(true);
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [pendingTxs, setPendingTxs] = useState<string[]>([]);

  // fetching disabled bridges data
  const { data: disabledBridgesData } = useContractReads({
    contracts: networks.map((network) => ({
      address: sourceChain.nftContractAddress as `0x${string}`,
      abi: ONFTAbi as any,
      functionName: "estimateSendFee",
      args: [
        `${network.layerzeroChainId}`,
        "0x0000000000000000000000000000000000000000",
        "1",
        false,
        "0x",
      ],
      chainId: sourceChain.chainId,
    })),
  });

  useEffect(() => {
    if (!disabledBridgesData) return;
    const disabledNetworks = disabledBridgesData.map((data: any, i: number) => {
      if (data.status === "failure") return networks[i].chainId;
      else return 0;
    });
    setSourceChain((prev) => ({
      ...prev,
      disabledNetworks: disabledNetworks as number[],
    }));
  }, [disabledBridgesData]);

  // fill with individual network data

  const initialSelectedHyperBridges = networks.filter(
    (network) =>
      !sourceChain.disabledNetworks.includes(network.chainId) &&
      sourceChain.chainId !== network.chainId
  );
  const [selectedHyperBridges, setSelectedHyperBridges] = useState<Network[]>(
    initialSelectedHyperBridges
  );

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const { address: account } = useAccount();

  const { data: bridgeTxResultData } = useWaitForTransaction({
    hash: layerZeroTxHashes[layerZeroTxHashes.length - 1] as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
  });

  // get balance of user on source chain
  const { data: balanceOfDlgate, refetch: refetchDlgateBalance } = useBalance({
    address: account as `0x${string}`,
    chainId: sourceChain.chainId,
    token: sourceChain.tokenContractAddress as `0x${string}`,
  });

  const createWalletData = async (account: string) => {
    const { data } = await axios.post("/api/create", {
      wallet: account,
    });
  };
  const saveWalletAndIP = async (account: string) => {
    const { data } = await axios.post("/api/saveIP", {
      wallet: account,
    });
  };

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

    const disabledNetworks = disabledBridgesData?.map((data: any, i: number) => {
      if (data.status === "failure") return networks[i].chainId;
      else return 0;
    });
    setSourceChain((prev) => ({
      ...prev,
      disabledNetworks: disabledNetworks as number[],
    }));

    const newSelectedHyperBridges = networks.filter(
      (network) =>
        !selectedNetwork.disabledNetworks.includes(network.chainId) &&
        network.chainId !== selectedNetwork.chainId
    );

    setSelectedHyperBridges(newSelectedHyperBridges);
  };

  const onChangeTargetChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
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

  useEffect(() => {
    if (!bridgeTxResultData) return;
    toast("Bridge successful!");
    setIsAnimationStarted(true);

    setTimeout(() => {
      setIsAnimationStarted(false);
      setIsAnimationEnd(true);
    }, ANIMATION_TIME);
  }, [bridgeTxResultData]);

  useEffect(() => {
    if (!isAnimationEnd) return;
    setTimeout(() => {
      setIsAnimationEnd(false);
    }, ANIMATION_END_TIME);
  }, [isAnimationEnd]);

  useEffect(() => {
    const selectedHyperBridges_ = networks.filter(
      (network) =>
        !sourceChain.disabledNetworks.includes(network.chainId) &&
        sourceChain.chainId !== network.chainId &&
        sourceChain.layerzeroChainId !== 165
    );
    setSelectedHyperBridges(selectedHyperBridges_);
  }, [sourceChain]);

  useEffect(() => {
    if (!account?.length) return;
    createWalletData(account);
    saveWalletAndIP(account);
  }, [account]);

  useEffect(() => {
    console.log("searchParams", searchParams);
    if (searchParams?.ref) {
      setRefCode(searchParams?.ref as string);
    }
    if (searchParams?.tab) {
      const tabsFormatted = tabsConfig.map((t) => t.replace(" ", "").toLowerCase());
      const foundTabIndex = tabsFormatted.findIndex((t) => t === searchParams?.tab);
      console.log("foundTabIndex", foundTabIndex);
      setTabIndex(foundTabIndex === -1 ? 0 : foundTabIndex);
    }
  }, [searchParams?.ref]);

  return (
    <div className={"relative w-full h-[100vh] min-h-[800px] overflow-x-hidden"}>
      {isFAQModalOpen ? (
        <FAQModal
          onCloseModal={() => {
            setIsFAQModalOpen(false);
          }}
        />
      ) : null}
      {isTrackerModalOpen ? (
        <TracketModal
          onCloseModal={() => {
            setIsTrackerModalOpen(false);
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

      {isBridgeModalOpen ? (
        <BridgeModal
          onCloseModal={() => {
            setIsBridgeModalOpen(false);
          }}
          sourceChain={sourceChain}
          targetChain={targetChain}
          setLayerZeroTxHashes={setLayerZeroTxHashes}
          setEstimatedGas={setEstimatedGas}
        />
      ) : null}

      <div
        className={
          "absolute overflow-y-scroll z-10 w-full min-h-[800px] h-full flex flex-col p-2"
        }
      >
        <div className={"container mx-auto gap-2 h-full flex flex-col"}>
          <Navbar pendingTxs={pendingTxs} refCode={refCode} />

          <div className="flex flex-row justify-center mt-5 mb-5">
            <div className={"flex gap-4"}>
              <button onClick={() => setIsFAQModalOpen(true)}>FAQ</button>
              <a href={"/"}>Docs</a>
              <button onClick={() => setIsHistoryModalOpen(true)}>History</button>
              <a href={"https://tracker.dappgate.io/"} target="_blank">
                Tracker{" "}
                <span className={`absolute dot  h-2 w-2 bg-green-400 rounded-full `} />
              </a>
            </div>
          </div>
          <div
            className={
              "w-full min-h-fit flex flex-col gap-4 items-center justify-center mt-4"
            }
          >
            <Tabs tabIndex={tabIndex} setTabIndex={setTabIndex} />

            {tabIndex == 0 ? (
              <ONFTBridge
                sourceChain={sourceChain}
                targetChain={targetChain}
                refCode={refCode}
                estimatedGas={estimatedGas}
                layerZeroTxHashes={layerZeroTxHashes}
                onChangeSourceChain={onChangeSourceChain}
                onChangeTargetChain={onChangeTargetChain}
                onArrowClick={onArrowClick}
                setIsBridgeModalOpen={setIsBridgeModalOpen}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
                setEstimatedGas={setEstimatedGas}
              />
            ) : tabIndex == 1 ? (
              <ONFTHyperBridge
                sourceChain={sourceChain}
                selectedHyperBridges={selectedHyperBridges}
                estimatedGas={estimatedGas}
                onChangeSourceChain={onChangeSourceChain}
                setSelectedHyperBridges={setSelectedHyperBridges}
                setEstimatedGas={setEstimatedGas}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
              />
            ) : tabIndex == 2 ? (
              <GasRefuel
                sourceChain={sourceChain}
                targetChain={targetChain}
                onChangeSourceChain={onChangeSourceChain}
                onChangeTargetChain={onChangeTargetChain}
                onArrowClick={onArrowClick}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
                setEstimatedGas={setEstimatedGas}
              />
            ) : tabIndex == 3 ? (
              <OFTBridge
                sourceChain={sourceChain}
                targetChain={targetChain}
                refCode={refCode}
                balanceOfDlgate={balanceOfDlgate}
                refetchDlgateBalance={refetchDlgateBalance}
                onChangeSourceChain={onChangeSourceChain}
                onChangeTargetChain={onChangeTargetChain}
                onArrowClick={onArrowClick}
                setIsBridgeModalOpen={setIsBridgeModalOpen}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
                setPendingTxs={setPendingTxs}
              />
            ) : tabIndex == 4 ? (
              <OFTHyperBridge
                sourceChain={sourceChain}
                selectedHyperBridges={selectedHyperBridges}
                refCode={refCode}
                onChangeSourceChain={onChangeSourceChain}
                setSelectedHyperBridges={setSelectedHyperBridges}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
                setEstimatedGas={setEstimatedGas}
              />
            ) : tabIndex == 5 ? (
              <Message
                sourceChain={sourceChain}
                targetChain={targetChain}
                onChangeSourceChain={onChangeSourceChain}
                onChangeTargetChain={onChangeTargetChain}
                onArrowClick={onArrowClick}
              />
            ) : tabIndex == 6 ? (
              <StargateBridge />
            ) : null}
          </div>
          <Footer />
        </div>
      </div>

      {/* ANIMATION */}
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
              isAnimationStarted ? "bridge-animaton" : ""
            }`}
          >
            <div
              className={`absolute h-[80vh] aspect-square ${
                isAnimationEnd
                  ? "left-[30%]"
                  : "left-0 duration-1000 transition-all translate-x-[-50%]"
              } rounded-full`}
              style={{
                background: sourceChain.colorClass.replace("bg-[", "").replace("]", ""),
              }}
            ></div>
            <div
              className={`absolute h-[80vh] aspect-square ${
                isAnimationEnd
                  ? "right-[30%] opacity-50"
                  : "right-0 duration-1000 transition-all translate-x-[50%]"
              } rounded-full`}
              style={{
                background: targetChain.colorClass.replace("bg-[", "").replace("]", ""),
              }}
            ></div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
