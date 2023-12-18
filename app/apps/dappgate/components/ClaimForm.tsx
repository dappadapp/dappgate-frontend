import { Network, WormholeNetworks } from "@/utils/networks";
import React, { useState } from "react";
import ListboxSourceMenu from "./ListboxSourceMenu";
import { useAccount } from "wagmi";
import axios from "axios";

type Props = {
  sourceChain: Network;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
};
const ClaimForm: React.FC<Props> = ({ sourceChain, onChangeSourceChain }) => {
  const { address: account } = useAccount();
  const [txHash, setTXHash] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNetworks = WormholeNetworks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const postClaimAction = async (sourceTx: string, targetTx: string) => {
    //TODO: completed?
    await axios.post("/api/wormhole/claim", {
      sourceTx: sourceTx,
      targetTx: targetTx,
      completed: 1,
    });
  };
  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>Wormhole Claim</h1>
      </div>
      <div
        className={"flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"}
      >
        <ListboxSourceMenu
          value={sourceChain}
          onChange={onChangeSourceChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
        <input
          type="text"
          className="w-full flex rounded-lg bg-white min-h-[60px] bg-opacity-5 py-1 px-4 text-left text-lg focus:outline-none mt-2 mb-2"
          placeholder="Source TX hash"
          onChange={(e) => setTXHash(e.target.value)}
          value={txHash}
        />
      </div>
      <div
        className={
          "flex flex-col justify-center items-center gap-6 w-full mt-12 select-none"
        }
      >
        <div className="flex flex-col items-center">
          <button
            className={
              "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed"
            }
            onClick={() => {
              if (!account) return alert("Please connect your wallet first.");
              //TODO: Claim NFT on source chain
            }}
          >
            Claim
          </button>
        </div>
      </div>

      <div className="mt-4 mb-8 text-sm md:text-base flex flex-col text-gray-400">
        Disclaimer
        <span className="text-xs md:text-sm">
          Please note that the duration of the claim process can take up to 40 minutes.
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">Powered By Wormhole</div>
    </div>
  );
};

export default ClaimForm;
