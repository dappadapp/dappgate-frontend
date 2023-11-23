import React, { useState } from "react";
import OFTHyperBridgeButton from "./OFTHyperBridgeButton";
import TransactionPreview from "@/app/apps/dappgate/components/TransactionPreview";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { networks } from "@/utils/networks";
import ListboxSourceMenu from "@/app/apps/dappgate/components/ListboxSourceMenu";
import type { Network } from "@/utils/networks";
import OFTHyperClaimButton from "./OFTHyperClaimButton";
import ArrowsSvg from "@/app/apps/dappgate/components/ArrowsSvg";

type Props = {
  sourceChain: Network;
  selectedHyperBridges: Network[];
  refCode: string;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  setSelectedHyperBridges: React.Dispatch<React.SetStateAction<Network[]>>;
  setEstimatedGas: React.Dispatch<React.SetStateAction<string>>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
};

const OFTHyperBridge: React.FC<Props> = ({
  sourceChain,
  selectedHyperBridges,
  refCode,
  onChangeSourceChain,
  setSelectedHyperBridges,
  setEstimatedGas,
  setLayerZeroTxHashes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mintCostData, setMintCostData] = useState(0);
  const [bridgeCostData, setBridgeCostData] = useState(0);
  const [tokenAmountHyperBridge, setTokenAmountHyperBridge] = useState(0);

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) && network.chainId !== 1
  );
  const handleButtonClick = async (index: number, network?: any) => {
    console.log("network", network);
    if (!network) return;
    
    let selectedNetworks = selectedHyperBridges;
    let isExist = selectedNetworks.some(
        (selectedNetwork) => selectedNetwork.chainId === network.chainId
    );

    if (isExist) {
        // Find the index of the existing network in the array
        const existingIndex = selectedNetworks.findIndex(
            (selectedNetwork) => selectedNetwork.chainId === network.chainId
        );

        // Update the network in the array to show it as grayscale
        selectedNetworks[existingIndex] = {
            ...selectedNetworks[existingIndex],
            isGrayscale: !network.isGrayscale || false,
        };

        // Update the state to reflect the change
        setSelectedHyperBridges([...selectedNetworks]);
    } else {
        // If the network is in grayscale, remove the grayscale status
        if (network.isGrayscale) {
            delete network.isGrayscale;
        }

        setSelectedHyperBridges([...selectedNetworks, network]);
    }
};

  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>OFT HyperBridge</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-col justify-between items-center mt-8 mb-8"
        }
      >
        <ListboxSourceMenu
          value={sourceChain}
          onChange={onChangeSourceChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />

        <div className="w-2/4 flex flex-col justify-center items-center mt-5 mb-8">
          <ArrowsSvg />
        </div>

        <div>
          <div className="text-white-700 break-words max-w-[100%] font-semibold text-lg mt-5">
            Step 1: Select multiple destination chains to bridge
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
            {selectedHyperBridges
              .map((network, i) => {
                return (
                  <button
                  key={i}
                  onClick={() => handleButtonClick(i, network)}
                  className={`flex items-center md:h-14 justify-start rounded-md bg-green-600 ${network.isGrayscale
                    ? "grayscale"
                    : "grayscale-0"
                    } p-2 `}
                >
                    <Image
                      src={`/chains/${network.image}`}
                      alt={network.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <h2 className="p-2 flex-1">{network.name}</h2>

                    {!selectedHyperBridges.some(
                      (selectedBridge) =>
                        selectedBridge.chainId === network.chainId
                    ) ? (
                      <FontAwesomeIcon
                        className="absolute top-0 right-0 p-1"
                        icon={faCircleXmark}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="absolute top-0 right-0 p-1"
                        icon={faCheckCircle}
                      />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <div className="flex flex-start text-lg xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
        Step 2: Claim $DLGATE amount to bridge per network
      </div>
      <div className="flex flex-row  w-full sm:w-full">
        <input
          type="range"
          min="0"
          max="20"
          value={tokenAmountHyperBridge}
          className="w-10/12 flex rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none mt-2"
          onChange={(e) => setTokenAmountHyperBridge(Number(e.target.value))}
        />

        {/** Show user preview of the transaction amount price and counts for networks */}

        <OFTHyperClaimButton
          sourceChain={sourceChain}
          refCode={refCode}
          tokenAmountHyperBridge={tokenAmountHyperBridge}
          selectedHyperBridges={selectedHyperBridges}
          setMintCostData={setMintCostData}
        />
      </div>

      <div className="flex text-lg xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
        <div className="text-white-700">
          Step 3: Bridge {" " + selectedHyperBridges.length + " "} $DLGATE
          tokens per network to selected networks in Step 1
        </div>
      </div>

      <TransactionPreview
        selectedHyperBridges={selectedHyperBridges}
        tokenAmountHyperBridge={
          tokenAmountHyperBridge * selectedHyperBridges.length
        }
        mintCostData={mintCostData}
        bridgeCostData={bridgeCostData}
        sourceChain={sourceChain}
        symbol={"$DLGATE"}
      />

      <OFTHyperBridgeButton
        sourceChain={sourceChain}
        setLayerZeroTxHashes={setLayerZeroTxHashes}
        setEstimatedGas={setEstimatedGas}
        tokenAmountHyperBridge={tokenAmountHyperBridge}
        selectedHyperBridges={selectedHyperBridges}
        setBridgeCostData={setBridgeCostData}
      />
    </div>
  );
};

export default OFTHyperBridge;
