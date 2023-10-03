"use client";
import Image from "next/image";
import React, { use, useEffect } from "react";
import avatar from "@/assets/placeholder.svg";
import Avvvatars from 'avvvatars-react'
import { generate, count } from "random-words";

import {
  useAccount,
  useBalance,
  useContractReads,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import formatAddress from "@/utils/formatAddress";
import { networks } from "@/utils/networks";
import ONFTAbi from "@/config/abi/ONFT.json";
import OFTAbi from "../../config/abi/OFTBridge.json";
import PassAbi from "../../config/abi/Pass.json";
import axios from "axios";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
interface LeaderboardResponse {
  walletCount: number;
  data: any;
}

interface UserResponse {
  wallet: string;
  data: any;
}
export default function LeaderBoard() {

  const [nftBalance, setNftBalance] = React.useState<any>(0)
  const [oftBalance, setOftBalance] = React.useState<any>(0)
  const [passBalance, setPassBalance] = React.useState<any>(0)
  const { address } = useAccount();
  const [totalUsers, setTotalUsers] = React.useState<any>(0);
  const [pagination, setPagination] = React.useState<any>(100000000);
  const [leaderboard, setLeaderboard] = React.useState<any>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [user, setUser] = React.useState<any>([]);
  const itemsPerPage = 10; // Set the number of items per page

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the data for the current page
  const paginatedData = leaderboard.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  console.log("pageNumbers", pageNumbers)
  // Handle pagination changes
  const handlePageChange = (page: any) => {
    setCurrentPage(page);

  };

  const { data: allNftBalances, refetch: refetchNFT } = useContractReads({
    contracts: networks.filter((network) => network?.isTestnet === undefined || network?.isTestnet === false).map((network) => ({
      address: network.nftContractAddress as `0x${string}`,
      abi: ONFTAbi as any,
      functionName: "balanceOf",
      args: [
        address,
      ],
      chainId: network.chainId,
    })),
  });

  const { data: allOFTBalances, refetch: refechOFT } = useContractReads({
    contracts: networks.filter((network) => network?.isTestnet === undefined || network?.isTestnet === false).map((network) => ({
      address: network.tokenContractAddress as `0x${string}`,
      abi: OFTAbi as any,
      functionName: "balanceOf",
      args: [
        address,
      ],
      chainId: network.chainId,
    })),
  });

  const { data: allPassBalances, refetch: refecthPass } = useContractReads({
    contracts: networks.filter((network) => network?.trackerContractAddress !== undefined).map((network) => ({
      address: network?.trackerContractAddress as `0x${string}`,
      abi: PassAbi as any,
      functionName: "balanceOf",
      args: [
        address,
      ],
      chainId: network.chainId,
    })),
  });

  useEffect(() => {
    saveOFT();
    saveONFT();
    savePass();
  }, [allOFTBalances, allNftBalances, allPassBalances]);


  useEffect(() => {
    getLeaderboard();
    getSingleUser();
    refreshData();
  }, []);

  const totalSum = () => {
    if (leaderboard.filter((item: any) => item?.wallet === address?.toString().toLowerCase())?.[0]?.wallet === address?.toString().toLowerCase()) {
      toast("You are already in the leaderboard");
      return;
    }
    else {
      saveOFT();
      saveONFT();
      savePass();
      getSingleUser();

      toast("Successfully joined leaderboard");
      return;
    }
  }

  const saveONFT = () => {
    if (!allNftBalances) return;

    const totalBalance = allNftBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setNftBalance(totalBalance);

    joinLeaderboard(totalBalance, "NFT");
  }

  const saveOFT = () => {
    if (!allOFTBalances) return;

    const totalBalance = allOFTBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setOftBalance(totalBalance);

    joinLeaderboard(Number(ethers.formatUnits(totalBalance.toString())), "OFT");
  }

  const savePass = () => {
    if (!allPassBalances) return;

    const totalBalance = allPassBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setPassBalance(totalBalance);

    joinLeaderboard(totalBalance, "PASS");


  }

  const joinLeaderboard = (totalBalance: number | undefined, type: string | undefined) => {
    if (!totalBalance || !type) return;



    axios.post("/api/joinLeaderboard", { address: address, balance: totalBalance, contract: type }).then((res) => {
      getLeaderboard();
      refechOFT();
      refetchNFT();

    }).catch((err) => {
      console.log(err)
    })
  }

  const getLeaderboard = async () => {
    try {
      const response = await axios.post<LeaderboardResponse>("/api/getLeaderboard", { pagination: pagination });
      const total = response.data;

      if (total) {
        setTotalUsers(total?.walletCount);
      }
      if (total) {
        setLeaderboard(total?.data);
      }
    } catch (error) {
      // Handle errors
    }
  }

  const getSingleUser = async () => {
    if (!address) return;
    try {
      const response = await axios.post<UserResponse>("/api/getSingleUser", { wallet: address });
    
      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      // Handle errors
    }
  }

  const refreshData = async() => {
    setIsRefreshing(true);
    getLeaderboard();
    await refechOFT();
    await refetchNFT();
    await refecthPass();
    getSingleUser();
    setIsRefreshing(false);

    toast("Successfully refreshed leaderboard");
    return;

  }

  console.log("user", user)

  return (
    <div className="flex w-full flex-col gap-5 mt-7">
      <div className="flex justify-between items-center border p-7 rounded-lg border-white border-opacity-5 bg-[#0C0C0C]">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-3">
            <span className="text-white text-5xl mr-5">Leaderboard</span>
            <button className="btn-grad p-3 ml-5" onClick={totalSum}>Join Leaderboard</button>

          </div>
          <span className="text-cool-gray-400 break-words mt-4">
            Exclusive ranking for DappGate users. Mint, bridge, and get XP to earn unique rewards.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Avvvatars value={address ? formatAddress(address) : ""} style="shape" size={80} />
          <div className="flex flex-col text-lg text-white">
            <span className="font-semibold text-grey-cool-500 text-2xl font-bold">Your Ranking:</span>

            <div className="flex items-center mt-1">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-500 text-white rounded-md px-3 py-1 ml-2 text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                {leaderboard.filter((item: any) => item?.wallet === address?.toString().toLowerCase())?.[0]?.index || "-"}
              </div>
              <span className="text-[#858585] p-2 text-2xl">/ {totalUsers}+</span>
              <FontAwesomeIcon icon={faSync} className={`ml-2 text-[#888888] hover:cursor-pointer items-center ${isRefreshing ? 'refreshing' : ''}`} onClick={() => refreshData()} />
            </div>
          </div>
        </div>
      </div>
      <table className="overflow-y-scroll border-separate border-spacing-y-1 text-x md:text-base w-full">
        <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[auto]">
          <tr className="bg-[#111] w-[80%] text-white">
            <td className="overflow-hidden w-[20%] whitespace-nowrap pl-2"></td>
            <td className="overflow-hidden w-[40%] whitespace-nowrap pl-2">Address</td>
            <td className="w-[40.6%]">XP</td>
            <td className=" table-cell w-[40.6%] pr-4">Transactions</td>
          </tr>
          {paginatedData.map((item: any, index: number) => (

            <tr key={item.wallet} className={`pt-4  w-[80%] shadow-inner rounded-lg ${item?.wallet.toLowerCase() === address?.toString().toLowerCase() ? 'bg-[#1abc9c] text-[#000]' : 'text-[#AAA]'}`}>
              <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
                <span className={`rounded-full py-1 px-3 ${item?.index === 1 ? 'bg-[#FFAD0E]' : item?.index === 2 ? 'bg-[#AD5707]' : item?.index === 3 ? 'bg-[#939393]' : item?.index === 4 ? 'bg-gray-600' : 'bg-gray-800'} text-white`}>
                  {item?.index}
                </span>
              </td>
              <td className="table-cell w-[40.6%] flex items-center">
                <div className="flex items-center">
                  <Avvvatars value={item?.wallet} style="shape" />
                  <span className="whitespace-nowrap ml-3">{formatAddress(item.wallet)}</span>
                </div>
              </td>
              <td className="text-sm lg:text-base table-cell w-[40%]">{item?.xp} XP</td>
              <td className=" pr-2 w-[40%] text-right rounded-r-lg text-sm lg:text-base pr-4">
                {item.total} TX
              </td>
            </tr>

          ))}
        </tbody>
      </table>
      <div className="flex justify-center">
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 focus:outline-none ${page === currentPage
              ? 'bg-gradient-to-br from-purple-600 to-indigo-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out'
              } rounded-full px-4 py-2`}
          >
            {page}
          </button>
        ))}
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
