import { Network } from "@/app/page";
import { ethers } from "ethers";
import { fetchTransaction } from '@wagmi/core'
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import MerklyLZAbi from "../config/abi/MerklyLZ.json";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  setInputTokenId: any;
  tokenIds: any;
  setTokenIds: any;
  refCode?: string;
  logIndex?: number;
  selectedHyperBridges: any;
};

const ONFTHyperMintButton: React.FC<Props> = ({
  sourceChain,
  targetChain,
  setInputTokenId,
  tokenIds,
  setTokenIds,
  refCode,
  logIndex,
  selectedHyperBridges,
}) => {
  const [mintTxHash, setMintTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const { chain: connectedChain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: account } = useAccount();
  const [nftIds, setNftIds] = useState<Array<string>>([]);

  const { data: costData } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "cost",
  });



  const { config: mintConfig, isSuccess } = usePrepareContractWrite({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: MerklyLZAbi,
    functionName: "mint",
    value:
      BigInt((costData as string) || "500000000000000") *
      BigInt(selectedHyperBridges.filter((x: any) => x !== 0).length),
  });

  const { writeAsync: mint } = useContractWrite(mintConfig);

  const { data: mintTxResultData, refetch } = useWaitForTransaction({
    hash: mintTxHash as `0x${string}`,
    confirmations: sourceChain.blockConfirmation,
    onSuccess(data) {
      addNftId(data?.logs[logIndex || 0].topics[3] as string);
    }
  });

  const addNftId = async(nftId: string) => {
     setNftIds([...nftIds, nftId]);
  };





  useEffect(() => {
    if (!mintTxResultData) return;

    const tokenId = BigInt(
      mintTxResultData.logs[logIndex || 0].topics[3] as string
    ).toString();

    const postMint = async () => {
      await axios.post("/api/mint", {
        tokenId,
      });
    };
    postMint();
    setInputTokenId(tokenId);
    setTokenIds((prev: any) => {
      const newArray = prev?.[sourceChain.chainId]?.[account as string]
        ? [...prev?.[sourceChain.chainId]?.[account as string], tokenId].filter(
            (value, index, self) => self.indexOf(value) === index
          )
        : [tokenId];
      const tokenIdData = {
        ...prev,
        [sourceChain.chainId]: {
          ...prev?.[sourceChain.chainId],
          [account as string]: newArray,
        },
      };
      localStorage.setItem("tokenIds", JSON.stringify(tokenIdData));
      return tokenIdData;
    });
    if (refCode?.length === 12) {
      const postReferenceMint = async () => {
        await axios.post("/api/referenceMint", {
          id: tokenId,
          walletAddress: account,
          chainId: sourceChain.chainId,
          ref: refCode,
          tx_id: mintTxHash,
        });
      };
      postReferenceMint();
    }
    ///bridge?tx=${data.tx}&srcChain=${data.srcChain}&dstChain=${data.dstChain}&tokenId=${data.tokenId}&walletAddress=${data.walletAddress}

 
    toast(`NFT minted with the id of ${tokenId}!`);
  }, [mintTxResultData]);

  console.log("nftids", nftIds);
  const getOwnRef = (paramsRefCode: string) => {
    let splitString = paramsRefCode.split("");
    let reverseArray = splitString.reverse();
    return reverseArray.join("").substring(0, 12);
  };

  const onMint = async () => {

    const transaction = await fetchTransaction({
      hash: '0xeb8394d6ba4465af32238f817f11b995048cf9ef568198b5c6e25beff1dbc98d',
    })

    console.log("transaction", transaction);
    if (!account) {
      return alert("Please connect your wallet first.");
    }
    if (!mint)
      return alert(
        "Make sure you have enough ETH and you're on the correct network."
      );
    if (!isSuccess) {
      return alert("An unknown error occured. Please try again.");
    }
    try {
      setLoading(true);
      if (connectedChain?.id !== sourceChain.chainId) {
        await switchNetworkAsync?.(sourceChain.chainId);
      }
      selectedHyperBridges.filter((x: any) => x !== 0).forEach(async() => {
        const result = await mint();
        setMintTxHash(result.hash);
        toast("Mint transaction sent, waiting confirmation...");

        refetch();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <button
      onClick={onMint}
      disabled={loading}
      className={
        "flex rounded-lg bg-blue-600 py-3 px-4 text-center text-lg  mt-2  mb-4"
      }
    >
      Mint {"(" + selectedHyperBridges.filter((x: any) => x !== 0).length + ")"}
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      )}
    </button>
  );
};

export default ONFTHyperMintButton;
