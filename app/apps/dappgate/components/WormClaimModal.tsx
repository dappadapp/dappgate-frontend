import axios from "axios";
import React, { useEffect, useState } from "react";
import ONFTAbi from "../../../../config/abi/ONFT.json";
import ONFTGenericBridgeButton from "./ONFTGenericBridgeButton";
import WormNFTGenericBridgeButton from "./WormNFTGenericBridgeButton";
import Image from "next/image";
import { useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite } from "wagmi";
import { Network } from "@/utils/networks";
import Bridge from "../../../../config/abi/WormholeBridge.json";
import { waitForTransaction } from "@wagmi/core";
import { toast } from "react-toastify";
type Props = {
  onCloseModal: any;
  sourceChain: Network;
  targetChain: Network;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
};

type WormholeNFTItem = {
  wallet: string;
  id: number;
  sourceTx: string;
  targetTx: string;
  completed: number;
  createdTime: number;
  updatedTime: number;
  wormholeId: number;
};

function WormClaimModal({ onCloseModal, sourceChain,targetChain }: Props) {
  const { address: walletAddress } = useAccount();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState<WormholeNFTItem[]>([]);
  const [totalNFTcount, setTotalNFTcount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    getNfts(currentPage).finally(() => setLoading(false));
  }, [walletAddress, currentPage]);


  const {
    config: completeConfig,
    isSuccess,
    error,
  } = usePrepareContractWrite({
    address: sourceChain.bridgeContract as `0x${string}`,
    abi: Bridge,
    functionName: "completeTransfer",
    value: BigInt(0),
    args: [
        payload
    ],
  });

  const { writeAsync: complete } = useContractWrite(completeConfig);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const getNfts = async (page: any) => {
    try {
      const { data } = await axios.post("/api/wormhole/wallet", {
        page: page,
        wallet: walletAddress,
        completed: 1,
        wormholeId: targetChain.wormholeChainId,
        limit: 6,
      });
      console.log("data nfts",data);
      setTotalNFTs(data.data);
      setTotalNFTcount(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const completeTransfer = async (token : any) => {


    const { data: payload } = await axios.post("/api/wormhole/payload", {
      id: targetChain.wormholeChainId,
      hash: token.sourceTx,
  });
    setPayload(payload?.payload);
 
      console.log("payload",payload?.payload);

      if (!complete) {
        return;
      }

    const { hash: txHash } = await complete();
    const data = await waitForTransaction({
      hash: txHash,
    });




    try {
      const { data } = await axios.post("/api/wormhole/claim", {
        sourceTx : token.sourceTx,
        targetTx : txHash,
        completed: 1,
      });

      return toast("NFT Claimed");
    } catch (error) {
      console.log(error);
    }
  }

  const availableNfts = () => {
    return (
      <>
        {totalNFTs?.map((token) => (
          <div key={token.id} className="block mb-5 mt-5">
            <Image
              src="/example.png"
              alt="NFT"
              width={160}
              height={160}
              className="p-2 mb-2"
            />

            <div className="items-center justify-center">
              <p className={"text-lg font-medium p-2 mb-3"}>NFT #{token.id}</p>
              <button    className={
            "flex items-center gap-1 bg-green-500/20 border-white border-[1px] rounded-lg px-14 py-2 relative transition-all disabled:bg-red-500/20 disabled:cursor-not-allowed mt-1"
          } onClick={() => completeTransfer(token)}>Claim NFT</button>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0">
        <div className="p-16 w-min-9/12 bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10">
          <div className="flex justify-between mb-5">
            <h1 className="text-3xl">Wormhole Claimable NFTs</h1>
            <div
              onClick={() => onCloseModal()}
              className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
            >
              X
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center mt-3 mb-3 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="flex items-center justify-center w-20 h-20 animate-spin"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          )}
          {totalNFTs?.length === 0 ? (
            <div className="flex justify-center items-center">
              <h2 className="mt-5">
                You dont own any NFTs on <strong>{sourceChain.name}</strong> chain.
              </h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5 mb-5">
                {availableNfts()}
              </div>

              <div className="flex justify-between w-full mt-5 p-2">
                <button
                  className="flex items-center gap-1 bg-white/10 border-white border-[1px] rounded-lg px-8 py-2"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  Previous Page
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage * 6 >= Number(totalNFTcount)}
                  className="flex items-center gap-1 bg-white/10 border-white border-[1px] rounded-lg px-8 py-2"
                >
                  Next Page
                </button>
              </div>
            </>
          )}
          <div className="mt-8 text-sm md:text-base flex flex-col text-gray-400 max-w-[450px] md:max-w-[550px]">
            Disclaimer
            <span className="text-xs md:text-sm">
              Please note that the duration of the claim process can take up to 40
              minutes.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default WormClaimModal;
