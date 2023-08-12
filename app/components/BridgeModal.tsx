import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import MintButton from "@/components/MintButton";
import ONFTAbi from "../../config/abi/ONFT.json";
import ONFTHyperBridgeButton from "@/components/ONFTHyperBridgeButton";
import ONFTGenericBridgeButton from "@/components/ONFTGenericBridgeButton";
import Image from "next/image";
import { writeContract, readContract } from "@wagmi/core";
type Props = {
  onCloseModal: any;
  sourceChain: any;
  targetChain: any;
  setInputTokenId: any;
  setTokenIds: any;
  refCode: any;
  logIndex: any;
  tokenIds: any;
  setLayerZeroTxHashes: any;
  setEstimatedGas: any;
};

interface DataResponse {
  data: {
    wallets: {
      wallet_address: string;
      contracts: {
        contract_address: string;
        token_ids: number[];
      }[];
    }[];
  };
}

function BridgeModal({
  onCloseModal,
  sourceChain,
  targetChain,
  setInputTokenId,
  setTokenIds,
  refCode,
  logIndex,
  tokenIds,
  setLayerZeroTxHashes,
  setEstimatedGas,
}: Props) {
  const { address: walletAddress } = useAccount();

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nftOwned, setNftOwned] = useState<any[]>([]);
  const [nftOwnedZk, setNftOwnedZk] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // create token id array for nfts
  const [tokenIdsArray, setTokenIdsArray] = useState<any[]>([]);

  const {
    data: nftBalance,
    isError,
    isLoading,
  } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    chainId: sourceChain.chainId,
    abi: ONFTAbi,
    functionName: "balanceOf",
    args: [walletAddress],
  });


  console.log("nftBalance",nftBalance);

  const getNftIds = async () => {
    setLoading(true);
    if(nftBalance){
      for (let i = 0; i < Number(nftBalance); i++) {
        const id = await readContract({
          address: sourceChain.nftContractAddress as `0x${string}`,
          chainId: sourceChain.chainId,
          abi: ONFTAbi,
          functionName: "tokenOfOwnerByIndex",
          args: [walletAddress, i],
        })
        // check if id is already in array
        if(!tokenIdsArray.includes(id)){
          setTokenIdsArray((prevArray) => [...prevArray, Number(id)]);
          setLoading(false);
        }
       
       
      }
    }
  };

  useEffect(() => { 
  getNftIds();
  }, [nftBalance]);



  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };



  const availableNfts = (page: number, nftsPerPage: number) => {
    const startIndex = (page - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;

    return (
      <>
        {tokenIdsArray?.slice(startIndex, endIndex).map((token_id: any) => (
          <div key={token_id} className="block mb-5 mt-5">
            <Image
              src="/example.png"
              alt="NFT"
              width={160}
              height={160}
              className="p-2 mb-2"
            />

            <div className="items-center justify-center">
              <p className={"text-lg font-medium p-2 mb-3"}>
                NFT #{token_id}
              </p>
              <ONFTGenericBridgeButton
                sourceChain={sourceChain}
                targetChain={targetChain}
                tokenId={token_id}
                tokenIds={tokenIds}
                setInputTokenId={setInputTokenId}
                setTokenIds={setTokenIds}
                setLayerZeroTxHashes={setLayerZeroTxHashes}
                setEstimatedGas={setEstimatedGas}
                setNftOwned={setNftOwned}
              />
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
            <h1 className="text-3xl">Available NFTs</h1>
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
          {nftOwned === undefined ? (
            <div className="flex justify-center items-center">
              <h2 className="mt-5">
                You dont own any NFTs on <strong>{sourceChain.name}</strong>{" "}
                chain.
              </h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5 mb-5">
                {availableNfts(currentPage, 6)}
              </div>

              <div className="flex justify-between w-full mt-5 p-2">
                <button
                  className="flex items-center gap-1 bg-white/10 border-white border-[1px] rounded-lg px-8 py-2"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous Page
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage * 9 >= Number(nftBalance)}
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
              The loading time for Non-Fungible Tokens (NFTs) viewed through our platform is not within our control and we are not associated with these potential delays. Various factors, such as the server status, the chain you&apos;re using, and the number of NFTs you own, can affect the loading time.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default BridgeModal;
