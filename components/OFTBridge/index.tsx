import React, { useState } from "react";
import ListboxSourceMenu from "@/app/components/ListboxSourceMenu";
import type { Network } from "@/utils/networks";
import { useAccount } from "wagmi";
import { networks } from "@/utils/networks";
import CircleSvg from "@/app/components/CircleSvg";
import ListboxTargetMenu from "@/app/components/ListboxTargetMenu";
import OFTClaimButton from "./OFTClaimButton";
import OFTBridgeButton from "./OFTBridgeButton";

type FetchBalanceResult = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

type Props = {
  sourceChain: Network;
  targetChain: Network;
  refCode: string;
  balanceOfDlgate: FetchBalanceResult | undefined;
  refetchDlgateBalance: () => Promise<any>;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
  setIsBridgeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
  setPendingTxs: React.Dispatch<React.SetStateAction<string[]>>;
};

const OFTBridge: React.FC<Props> = ({
  sourceChain,
  targetChain,
  refCode,
  balanceOfDlgate,
  refetchDlgateBalance,
  onChangeSourceChain,
  onChangeTargetChain,
  onArrowClick,
  setLayerZeroTxHashes,
  setPendingTxs,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [inputOFTAmount, setInputOFTAmount] = useState("");
  const [dlgateBridgeAmount, setDlgateBridgeAmount] = useState("0");

  const { address: account } = useAccount();

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) &&  network.chainId !== 1
  );

  const filteredNetworksTarget = networks.filter((network) =>
  network.name.toLowerCase().includes(searchTerm.toLowerCase()) && network.chainId !== 1
);

  const handleMax = () => {
    if (balanceOfDlgate) {
      setDlgateBridgeAmount(balanceOfDlgate?.formatted);
    }
  };
  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 text-xs md:text-sm backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>OFT Bridge</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"
        }
      >
        <ListboxSourceMenu
          value={sourceChain}
          onChange={onChangeSourceChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
        <CircleSvg onArrowClick={onArrowClick} isClickable={true} />

        <ListboxTargetMenu
          value={targetChain}
          sourceValue={sourceChain}
          onChange={onChangeTargetChain}
          options={filteredNetworksTarget}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
      </div>

      <div className="flex flex-start text-lg xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
        Step 1: Claim $DLGATE from {sourceChain.name} to bridge
      </div>
      <div className="flex flex-row justify-between items-center w-full sm:w-full">
        <input
          type="number"
          className="w-full flex rounded-lg bg-white min-h-[60px] bg-opacity-5 py-1 px-4 text-left text-lg focus:outline-none mt-2 mb-2"
          placeholder="e.g. 1000"
          value={inputOFTAmount}
          onChange={(e) => {
            if (
              Number.isInteger(Number(e.target.value)) ||
              e.target.value === ""
            ) {
              setInputOFTAmount(e.target.value);
            }
          }}
        />

        <OFTClaimButton
          sourceChain={sourceChain}
          refCode={refCode}
          inputOFTAmount={inputOFTAmount}
          refetchDlgateBalance={refetchDlgateBalance}
          setPendingTxs={setPendingTxs}
        />
      </div>

      <div className="flex text-lg xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
        <div className="text-white-700">
          Step 2: Bridge $DLGATE to {targetChain.name}{" "}
        </div>
        <div className="text-white-700">
          Balance: {Number(balanceOfDlgate?.formatted) || 0}
        </div>
      </div>
      {/** Create Logo and Token name label button and at the same row create a input box with max option  */}
      <div className="relative flex flex-row justify-between w-full sm:w-full">
        {/** In input box create a max option for balance max */}

        <input
          type="number"
          className="w-full flex rounded-lg bg-white min-h-[60px] bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none mt-2"
          placeholder="Amount To Bridge"
          value={dlgateBridgeAmount}
          onChange={(e) => {
            setDlgateBridgeAmount(e.target.value);
          }}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 mt-1 transform -translate-y-1/2 px-3 py-2 bg-red-500/40 text-white rounded-md"
          onClick={handleMax}
        >
          Max
        </button>
      </div>

      <OFTBridgeButton
        sourceChain={sourceChain}
        targetChain={targetChain}
        setLayerZeroTxHashes={setLayerZeroTxHashes}
        dlgateBridgeAmount={dlgateBridgeAmount}
      />
    </div>
  );
};

export default OFTBridge;
