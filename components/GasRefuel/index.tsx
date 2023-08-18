import React, { useState } from "react";
import OFTRefuelButton from "./OFTRefuelButton";
import ListboxSourceMenu from "@/app/components/ListboxSourceMenu";
import CircleSvg from "@/app/components/CircleSvg";
import { Network, networks } from "@/utils/networks";
import ListboxTargetMenu from "@/app/components/ListboxTargetMenu";
import { ethers } from "ethers";
import { useAccount, useBalance, useContractRead } from "wagmi";
import RelayerAbi from "../../config/abi/RelayerV2.json";

interface Props {
  sourceChain: Network;
  targetChain: Network;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
  setEstimatedGas: React.Dispatch<React.SetStateAction<string>>;
}

const GasRefuel: React.FC<Props> = ({
  sourceChain,
  targetChain,
  onChangeSourceChain,
  onChangeTargetChain,
  onArrowClick,
  setLayerZeroTxHashes,
  setEstimatedGas,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gasRefuelAmount, setGasRefuelAmount] = useState("");

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
     network.relayerAddress !== "" &&
      network.layerzeroChainId !== 165
  );

  const gasRefuelNetworks = networks.filter(
    (network) =>
      network.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      network.relayerAddress !== "" &&
      network.layerzeroChainId !== 165
  );

  const { address: account } = useAccount();

  // get balance of user on source chain
  const { data: balanceOfUser } = useBalance({
    address: account as `0x${string}`,
    chainId: sourceChain?.chainId,
  });

  // gas refuel max value fetch
  const { data: gasRefuelMaxData } = useContractRead({
    address: sourceChain.relayerAddress as `0x${string}`,
    abi: RelayerAbi,
    functionName: "dstConfigLookup",
    args: [`${targetChain.layerzeroChainId}`, "2"],
    chainId: sourceChain.chainId,
  });

  const gasRefuelMaxValue = gasRefuelMaxData
    ? Number(((gasRefuelMaxData as any)?.[0] * 1000n) / BigInt(1e18)) / 1000
    : 0;

  const handleMax = () => {
    if ((gasRefuelMaxData as any)[0]) {
      setGasRefuelAmount(
        `${ethers.formatEther((gasRefuelMaxData as any)[0].toString())}`
      );
    }
  };
  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px]  border-white border-[2px] border-opacity-10 p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>Gas Refuel</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8 mb-5"
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
          options={gasRefuelNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
      </div>
      <div className="flex text-xs xl:text-base font-semibold xl:flex-row justify-between items-center mt-5">
        <div className="text-white-700 break-words max-w-[60%] text-base">
          ${sourceChain.name}{" "}
          {Number(balanceOfUser?.formatted || 0).toFixed(4) || 0}{" "}
          {sourceChain.symbol}
        </div>
        <div className="text-white-700 break-words max-w-[60%] text-base"></div>
        <div className="text-white-700 text-base">
          Max: {" " + gasRefuelMaxValue + " "} {targetChain.symbol}
        </div>
      </div>
      {/** Create Logo and Token name label button and at the same row create a input box with max option  */}
      <div className="relative flex flex-row justify-between  w-full sm:w-full">
        {/** In input box create a max option for balance max */}

        <input
          type="number"
          className="w-full flex rounded-lg bg-white bg-opacity-5 py-3 px-4 text-left text-lg focus:outline-none mt-2"
          placeholder={`Input Amount of ${targetChain.symbol} to receive on ${targetChain.name}`}
          value={gasRefuelAmount}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setGasRefuelAmount("0");
              return;
            }
            setGasRefuelAmount(e.target.value);
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

      <OFTRefuelButton
        sourceChain={sourceChain}
        targetChain={targetChain}
        gasRefuelAmount={gasRefuelAmount}
        setLayerZeroTxHashes={setLayerZeroTxHashes}
        setEstimatedGas={setEstimatedGas}
        balanceOfData={gasRefuelMaxValue}
      />
      <div className="mt-4 text-sm md:text-base flex flex-col text-gray-400">
        Disclaimer
        <span className="text-xs md:text-sm">
          The token bridge is a service that allows users to transfer tokens
          between different blockchains. However, it is not a financial product
          and does not offer any guarantees about the price or liquidity of
          tokens. The service provider is not liable for any loss or damage
          arising from the use of the token bridge.
        </span>
      </div>
    </div>
  );
};

export default GasRefuel;
