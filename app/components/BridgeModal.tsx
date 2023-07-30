import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import MintButton from "@/components/MintButton";
import MerklyLZAbi from "../../config/abi/MerklyLZ.json";
import ONFTHyperBridgeButton from "@/components/ONFTHyperBridgeButton";
import ONFTGenericBridgeButton from "@/components/ONFTGenericBridgeButton";
import Image from "next/image";
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


  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nftOwned, setNftOwned] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const getNftOwned = async () => {
    setLoading(true);

    const headers = {
      Authorization: 'Bearer cqt_rQDKB3dQYtbpHVh77JxQHjXt4Tcw',  
    };
    const nfts = await axios.get(
      `https://api.covalenthq.com/v1/${sourceChain.chainName}/address/${walletAddress}/balances_nft/?with-uncached=true`,
      { headers }
    );

    setNftOwned(nfts.data.data.items?.filter((nft: any) => nft.contract_address.toLowerCase() === sourceChain.nftContractAddress.toLowerCase())[0]?.nft_data);

    setLoading(false);
      console.log("nftOwned",nftOwned)
  };

  useEffect(() => {
    setLoading(true);
    getNftOwned();
  }, []);

  const availableNfts = (page: number, nftsPerPage: number) => {
    const startIndex = (page - 1) * nftsPerPage;
    const endIndex = startIndex + nftsPerPage;

  
    return (
      <>
        {nftOwned?.slice(startIndex, endIndex).map((nft: any) => (
          <div key={nft.token_id} className="block mb-5 mt-5">
            <Image src="/example.png" alt="NFT" width={160} height={160} className="p-2 mb-2" />
   
            <div className="items-center justify-center">
            <p className={"text-lg font-medium p-2 mb-3"}>NFT #{nft.token_id}</p>
              <ONFTGenericBridgeButton 
                  sourceChain={sourceChain}
                  targetChain={targetChain}
                  tokenId={nft.token_id}
                  tokenIds={tokenIds}
                  setInputTokenId={setInputTokenId}
                  setTokenIds={setTokenIds}
                  setLayerZeroTxHashes={setLayerZeroTxHashes}
                  setEstimatedGas={setEstimatedGas}
                />
                

            </div>
          </div>
        ))}
      </>
    );
  };


  useEffect(() => {
    getNftOwned();
  }, []);

  return (
    <>


    <div
      className="z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
    >
      <div
        className="p-16 w-min-9/12 bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        
      >
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
      You don't own any NFTs on <strong>{sourceChain.name}</strong> chain.
      </h2>
         
            </div>
          
          ) : (
            <>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5 mb-5">
          {availableNfts(currentPage, 6)} 
        </div>


      
        <div className="flex justify-between w-full mt-5 p-2">
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
        </>
      )
        }
      </div>
    </div>
    </>
  );

}

export default BridgeModal;
