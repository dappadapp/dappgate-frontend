import type { Network } from "@/utils/networks";
import React, { useEffect, useMemo, useState } from "react";
import MintButton from "./MintButton";
import ListboxSourceMenu from "@/app/apps/dappgate/components/ListboxSourceMenu";
import CircleSvg from "@/app/apps/dappgate/components/CircleSvg";
import ListboxTargetMenu from "@/app/apps/dappgate/components/ListboxTargetMenu";
import BridgeButton from "./BridgeButton";
import LayerZeroSvg from "@/app/apps/dappgate/components/LayerZeroSvg";
import formatAddress from "@/utils/formatAddress";
import { WormholeNetworks } from "@/utils/networks";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import FaAngleDown from "@/app/apps/dappgate/components/FaAngleDown";
import ONFTAbi from "@/config/abi/WormholeNFT.json";


import {
  CHAIN_ID_ACALA,
  CHAIN_ID_ALGORAND,
  CHAIN_ID_APTOS,
  CHAIN_ID_INJECTIVE,
  CHAIN_ID_KARURA,
  CHAIN_ID_NEAR,
  CHAIN_ID_SEI,
  CHAIN_ID_SOLANA,
  CHAIN_ID_SUI,
  CHAIN_ID_TERRA2,
  CHAIN_ID_XPLA,
  ChainId,
  TerraChainId,
  getEmitterAddressAlgorand,
  getEmitterAddressEth,
  getEmitterAddressInjective,
  getEmitterAddressNear,
  getEmitterAddressSolana,
  getEmitterAddressTerra,
  getEmitterAddressXpla,
  getForeignAssetSui,
  hexToNativeAssetString,
  hexToNativeString,
  hexToUint8Array,
  isEVMChain,
  isTerraChain,
  parseNFTPayload,
  parseSequenceFromLogAlgorand,
  parseSequenceFromLogEth,
  parseSequenceFromLogInjective,
  parseSequenceFromLogNear,
  parseSequenceFromLogSolana,
  parseSequenceFromLogTerra,
  parseSequenceFromLogXpla,
  parseTransferPayload,
  parseVaa,
  queryExternalId,
  queryExternalIdInjective,
  tryHexToNativeStringNear,
  uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import { ethers } from "ethers";
import { WORMHOLE_RPC_HOSTS, getBridgeAddressForChain, getNFTBridgeAddressForChain, getTokenBridgeAddressForChain } from "@/utils/consts";
import { getSignedVAAWithRetry } from "@/utils/getSignedVAA";


type Props = {
  sourceChain: Network;
  targetChain: Network;
  refCode: string;
  layerZeroTxHashes: string[];
  estimatedGas: string;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
  setIsWormBridgeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLayerZeroTxHashes: React.Dispatch<React.SetStateAction<string[]>>;
  setEstimatedGas: React.Dispatch<React.SetStateAction<string>>;
  tokenIds: any;
  setTokenIds: any;
};

const ONFTBridge: React.FC<Props> = async ({
  sourceChain,
  targetChain,
  refCode,
  layerZeroTxHashes,
  estimatedGas,
  onChangeSourceChain,
  onChangeTargetChain,
  onArrowClick,
  setIsWormBridgeOpen,
  setLayerZeroTxHashes,
  setEstimatedGas,
  tokenIds,
  setTokenIds,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [inputTokenId, setInputTokenId] = useState("");

  const { address: account } = useAccount();

  const filteredNetworks = WormholeNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNetworksTarget = WormholeNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  async function fetchSignedVAA(
    chainId: ChainId,
    emitterAddress: string,
    sequence: string
  ) {
    const { vaaBytes } = await getSignedVAAWithRetry(
      chainId,
      emitterAddress,
      sequence,
      WORMHOLE_RPC_HOSTS.length
    );
    return {
      vaa: vaaBytes ? uint8ArrayToHex(vaaBytes) : undefined,
      error: null,
    };
  }

  async function evm(
    provider: ethers.JsonRpcProvider,
    tx: string,
    enqueueSnackbar: any,
    chainId: ChainId,
    nft: boolean
  ) {
    try {
      const receipt = await provider.getTransactionReceipt(tx);
      const sequence = parseSequenceFromLogEth(
        receipt,
        getBridgeAddressForChain(chainId)
      );
      const emitterAddress = getEmitterAddressEth(
        nft
          ? getNFTBridgeAddressForChain(chainId)
          : getTokenBridgeAddressForChain(chainId)
      );
      return await fetchSignedVAA(chainId, emitterAddress, sequence);
    } catch (e) {
      return;
    }
  }


  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>Wormhole Bridge</h1>
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
                setIsWormBridgeOpen(true);
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
         
        </div>
      </div>

      <div className="mt-4 mb-8 text-sm md:text-base flex flex-col text-gray-400">
        Disclaimer
        <span className="text-xs md:text-sm">
        Please note that the duration of the bridge process can take up to 40 minutes. 
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
    Powered By Wormhole
    </div>
    </div>
  );
};

export default ONFTBridge;
