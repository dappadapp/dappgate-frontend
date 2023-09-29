import TransactionPreview from "@/app/components/TransactionPreview";
import React, { useState } from "react";
import ONFTHyperMintButton from "./ONFTHyperMintButton";
import ONFTHyperBridgeButton from "./ONFTHyperBridgeButton";
import Image from "next/image";
import {
  faCheckCircle,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { networks } from "@/utils/networks";
import ArrowsSvg from "@/app/components/ArrowsSvg";
import ListboxSourceMenu from "@/app/components/ListboxSourceMenu";
import type { Network } from "@/utils/networks";
import { useAccount, useContractRead } from "wagmi";
import ONFTAbi from "../../config/abi/ONFT.json";

type Props = {
  sourceChain: Network;
  selectedHyperBridges: Network[];
  estimatedGas: string;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  setSelectedHyperBridges: React.Dispatch<React.SetStateAction<Network[]>>;
  setEstimatedGas: React.Dispatch<React.SetStateAction<string>>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
};

const ONFTHyperBridge: React.FC<Props> = ({
  sourceChain,
  selectedHyperBridges,
  estimatedGas,
  onChangeSourceChain,
  setSelectedHyperBridges,
  setEstimatedGas,
  setLayerZeroTxHashes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mintCostData, setMintCostData] = useState(0);

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { address: account } = useAccount();

  // user onft balance fetch
  const { data: userONFTBalanceOfData, refetch: refetchUserONFTBalance } =
    useContractRead({
      address: sourceChain.nftContractAddress as `0x${string}`,
      abi: ONFTAbi,
      functionName: "balanceOf",
      args: [account],
      chainId: sourceChain.chainId,
    });

  const handleButtonClick = async (index: number, network?: any) => {
    if (!network) return;
    let selectedNetworks = selectedHyperBridges;
    let isExist = selectedNetworks.some(
      (selectedNetwork) => selectedNetwork.chainId === network.chainId
    );
    if (isExist) {
      selectedNetworks = selectedNetworks.filter(
        (selectedNetwork) => selectedNetwork.chainId !== network.chainId
      );
      setSelectedHyperBridges(selectedNetworks);
    } else {
      setSelectedHyperBridges([...selectedHyperBridges, network]);
    }
  };

  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>ONFT HyperBridge</h1>
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
        <div className="w-2/4 flex flex-col justify-center items-center mt-4 mb-8">
          <ArrowsSvg />
        </div>
        <div>
          <div className="text-white-700 break-words max-w-[100%] font-semibold text-lg mt-5">
            Step1: Select multiple destination chains to bridge
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
            {networks
              .filter((network) => {
                return (
                  !sourceChain?.disabledNetworks?.includes(network?.chainId) &&
                  network?.chainId !== sourceChain?.chainId 
                );
              })
              .map((network, i) => {
                return (
                  <button
                    key={i}
                    onClick={() => handleButtonClick(i, network)}
                    className={`flex items-center md:h-14 justify-start rounded-md bg-green-600 ${!selectedHyperBridges?.some(
                      (selectedBridge) =>
                        selectedBridge?.chainId === network?.chainId
                    )
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

      <div className="text-white-700 break-words max-w-[100%] font-semibold text-lg">
        Step2: Mint {selectedHyperBridges.length} NFTs on {sourceChain.name} to
        bridge
      </div>

      <TransactionPreview
        selectedHyperBridges={selectedHyperBridges}
        tokenAmountHyperBridge={selectedHyperBridges.length}
        mintCostData={mintCostData}
        sourceChain={sourceChain}
        symbol={"NFT"}
      />

      <ONFTHyperMintButton
        sourceChain={sourceChain}
        selectedHyperBridges={selectedHyperBridges}
        setMintCostData={setMintCostData}
        refetchUserONFTBalance={refetchUserONFTBalance}
      />

      <ONFTHyperBridgeButton
        sourceChain={sourceChain}
        setLayerZeroTxHashes={setLayerZeroTxHashes}
        setEstimatedGas={setEstimatedGas}
        estimatedGas={estimatedGas}
        selectedHyperBridges={selectedHyperBridges}
        userONFTBalanceOfData={userONFTBalanceOfData as bigint}
        refetchUserONFTBalance={refetchUserONFTBalance}
      />
    </div>
  );
};

export default ONFTHyperBridge;
