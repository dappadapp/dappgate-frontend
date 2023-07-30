import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import MintButton from "@/components/MintButton";
import MerklyLZAbi from "../../config/abi/MerklyLZ.json";
import ONFTHyperBridgeButton from "@/components/ONFTHyperBridgeButton";
import BridgeButton from "@/components/BridgeButton";
type Props = {
  onCloseModal: any;
  sourceChain: any;
  targetChain: any;
  setInputTokenId: any;
  setTokenIds: any;
  refCode: any;
  logIndex: any;
  tokenId: any;
};

function BridgeModal({
  onCloseModal,
  sourceChain,
  targetChain,
  setInputTokenId,
  setTokenIds,
  refCode,
  logIndex,
  tokenId,

}: Props) {
  const { address: walletAddress } = useAccount();
  const { data: costData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "cost",
  });

  const {
    data: nftBalance,
    isError,
    isLoading,
  } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    chainId: sourceChain.chainId,
    abi: MerklyLZAbi,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  console.log("balance", Number(nftBalance));

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const nftElements: React.JSX.Element[] = []; // Create an array to store JSX elements

  const availableNfts = (page: number) => {
    if (isError) {
      return <div>error</div>;
    }
    if (isLoading) {
      return <div>loading</div>;
    }
    const nftElements = [];
    const nftsPerPage = 9;
    const startIndex = (page - 1) * nftsPerPage;
    const endIndex = Math.min(startIndex + nftsPerPage, Number(nftBalance));

    for (let i = startIndex; i < endIndex; i++) {
      nftElements.push(<>
    
        {/** Put under the image nft id and bridge button */}
        <div className="block">
          <img src="/example.png" alt="NFT" className="w-30 h-30" />
          <div
            className={
              "flex flex-col items-center justify-center text-center"
            }
          >
            <p className={"text-sm font-medium"}>NFT #{i}</p>
           
          </div>

        
          <div className="flex items-center justify-center">
            <BridgeButton 
            sourceChain={sourceChain}
            targetChain={targetChain}
            setInputTokenId={setInputTokenId}
            setTokenIds={setTokenIds}
            logIndex={logIndex}
            refCode={refCode}
            tokenId={i}
            />
          </div>
        </div>
      
          </>
      );
    }

    return nftElements;
  };

  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "p-16 min-w-[35vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex justify-between mb-5">
          <h1 className={"text-3xl"}>Available NFTs</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-5">
          {/* Render the NFTs for the current page */}
          {availableNfts(currentPage)}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-between w-full mt-4">
          <button
            className="flex px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * 9 >= Number(nftBalance)}
            className="flex px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default BridgeModal;
