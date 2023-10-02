import type { Network } from "@/utils/networks";
import React, { useEffect, useMemo, useState } from "react";
import MintButton from "./MintButton";
import ListboxSourceMenu from "@/app/apps/dappgate/components/ListboxSourceMenu";
import CircleSvg from "@/app/apps/dappgate/components/CircleSvg";
import ListboxTargetMenu from "@/app/apps/dappgate/components/ListboxTargetMenu";
import BridgeButton from "./BridgeButton";
import LayerZeroSvg from "@/app/apps/dappgate/components/LayerZeroSvg";
import formatAddress from "@/utils/formatAddress";
import { networks } from "@/utils/networks";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import FaAngleDown from "@/app/apps/dappgate/components/FaAngleDown";
import ONFTAbi from "@/config/abi/ZKONFTBridge.json";
type Props = {
  sourceChain: Network;
  targetChain: Network;
  refCode: string;
  layerZeroTxHashes: string[];
  estimatedGas: string;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
  setIsBridgeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
  setEstimatedGas: React.Dispatch<React.SetStateAction<string>>;
  tokenIds: any;
  setTokenIds: any;
};

const ONFTBridge: React.FC<Props> = ({
  sourceChain,
  targetChain,
  refCode,
  layerZeroTxHashes,
  estimatedGas,
  onChangeSourceChain,
  onChangeTargetChain,
  onArrowClick,
  setIsBridgeModalOpen,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenIds,
  setTokenIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputTokenId, setInputTokenId] = useState("");

  const { address: account } = useAccount();

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
    && network.zkNFTContractAddress !== undefined
    && network?.layerzeroChainId === 102
    || network?.layerzeroChainId === 109
    || network?.layerzeroChainId === 153
  );

  const filteredNetworksTarget = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
    && network.zkNFTContractAddress !== undefined
  );

  const { data: balanceOfData, refetch: balanceOfRefetch } = useContractRead({
    address: sourceChain.zkNFTContractAddress as `0x${string}`,
    chainId: sourceChain.chainId,
    abi: ONFTAbi,
    functionName: "balanceOf",
    args: [account],
  });


  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) return;
    setInputTokenId(tokenIds);
  }, [tokenIds]);


  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>zkONFT Bridge</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"
        }
      >
        <ListboxSourceMenu
          value={filteredNetworks[0]}
          onChange={onChangeSourceChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
        <CircleSvg onArrowClick={onArrowClick} isClickable={true} />
        <ListboxTargetMenu
          value={filteredNetworksTarget[1]}
          sourceValue={targetChain}
          onChange={onChangeTargetChain}
          options={filteredNetworksTarget}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
      </div>
      <div
        className={
          "flex flex-col justify-center items-center gap-6 w-full mt-12 select-none"
        }
      >
        <MintButton
          sourceChain={sourceChain}
          targetChain={targetChain}
          refCode={refCode}
          balanceOfRefetch={balanceOfRefetch}
          setTokenIds={setTokenIds}
        />

        <div className="flex flex-col items-center">
          {sourceChain?.name !== undefined && sourceChain.layerzeroChainId !== 153 ? (
            <button
              className={
                "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
              }
              onClick={() => {
                if (!account) return alert("Please connect your wallet first.");
                setIsBridgeModalOpen(true);
              }}
            >
              Bridge
            </button>
          ) : (
            <BridgeButton
              sourceChain={sourceChain}
              targetChain={targetChain}
              setLayerZeroTxHashes={setLayerZeroTxHashes}
              setEstimatedGas={setEstimatedGas}
              tokenId={inputTokenId}
              setTokenIds={setTokenIds}
              tokenIds={inputTokenId}

            />
          )}

          <FaAngleDown setShowInput={setShowInput} />

          <div
            className={`w-[150px] mt-4 transition-all overflow-hidden ${!showInput ? "max-h-[0px]" : "max-h-[200px]"
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
          {estimatedGas ? (
            <span className="mt-3">Estimated Cost: {estimatedGas} + Gas</span>
          ) : null}
        </div>
      </div>
      <div
        className={`w-full flex flex-col gap-4 mt-8 transition-all overflow-hidden ${layerZeroTxHashes.length !== 0 ? "max-h-[1000px]" : "max-h-0"
          }`}
      >
        <h1 className={"text-3xl font-semibold"}>Layer Zero Transactions</h1>
        {layerZeroTxHashes.map((hash, i) => {
          return (
            <div key={hash} className="ml-4">
              Transaction #{i + 1}:
              <a
                href={`${sourceChain.isTestnet
                    ? "https://testnet.layerzeroscan.com"
                    : "https://layerzeroscan.com"
                  }/tx/${hash}`}
                target="_blank"
                className="text-orange-400"
              >
                {`${sourceChain.isTestnet
                    ? "testnet.layerzeroscan.com"
                    : "layerzeroscan.com"
                  }/tx/${formatAddress(hash)}`}
              </a>
            </div>
          );
        })}
      </div>
      <div className="mt-4 mb-8 text-sm md:text-base flex flex-col text-gray-400">
        Disclaimer
        <span className="text-xs md:text-sm">
          Please be aware that any bridge fees encountered while using our
          platform are not associated with us, nor do we have control over these
          charges. These fees are fully calculated and processed on
          LayerZero&apos;s backend. We make no representations or warranties
          regarding these fees, and we cannot influence or predict the value of
          these fees. Thank you for your understanding.
        </span>
      </div>
      <LayerZeroSvg />
    </div>
  );
};

export default ONFTBridge;
