import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import MintButton from "@/components/MintButton";

type Props = {
  onCloseModal: any;
  sourceChain: any;
  targetChain: any;
  setInputTokenId: any;
  setTokenIds: any;
  refCode: any;
  logIndex: any;
};

function MintModal({
  onCloseModal,
  sourceChain,
  targetChain,
  setInputTokenId,
  setTokenIds,
  refCode,
  logIndex,
}: Props) {
  const { address: walletAddress } = useAccount();

  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count + 1);
  };

  const decreaseCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
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
          <h1 className={"text-3xl"}>Mint NFTs</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-4 mt-5">
            <img src="/example.png" alt="NFT" className="w-48 h-48" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={decreaseCount}
              className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-2xl font-bold">{count}</span>
            <button
              onClick={increaseCount}
              className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H6a1 1 0 010-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center mt-5">
            <MintButton
              sourceChain={sourceChain}
              targetChain={targetChain}
              setInputTokenId={setInputTokenId}
              setTokenIds={setTokenIds}
              refCode={refCode}
              logIndex={logIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MintModal;
