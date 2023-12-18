"use client";
import Image from "next/image";
import React, { use, useEffect } from "react";
import avatar from "@/assets/placeholder.svg";
import Avvvatars from "avvvatars-react";
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
import OFTAbi from "../../../config/abi/OFTBridge.json";
import PassAbi from "../../../config/abi/Pass.json";
import axios from "axios";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
interface LeaderboardResponse {
  walletCount: number;
  data: any;
}

interface UserResponse {
  wallet: string;
  data: any;
}
export default function LeaderBoard() {
  const [nftBalance, setNftBalance] = React.useState<any>(0);
  const [oftBalance, setOftBalance] = React.useState<any>(0);
  const [passBalance, setPassBalance] = React.useState<any>(0);
  const { address } = useAccount();
  const [totalUsers, setTotalUsers] = React.useState<any>(0);
  const [pagination, setPagination] = React.useState<any>(100000000);
  const [leaderboard, setLeaderboard] = React.useState<any>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [user, setUser] = React.useState<any>([]);
  const itemsPerPage = 10; // Set the number of items per page
  // Calculate the total number of pages based on the totalUsers and itemsPerPage
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Generate an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Handle pagination changes
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    getLeaderboard(page);
  };

  const { data: allNftBalances, refetch: refetchNFT } = useContractReads({
    contracts: networks
      .filter(
        (network) => network?.isTestnet === undefined || network?.isTestnet === false
      )
      .map((network) => ({
        address: network.nftContractAddress as `0x${string}`,
        abi: ONFTAbi as any,
        functionName: "balanceOf",
        args: [address],
        chainId: network.chainId,
      })),
  });

  const { data: allOFTBalances, refetch: refechOFT } = useContractReads({
    contracts: networks
      .filter(
        (network) => network?.isTestnet === undefined || network?.isTestnet === false
      )
      .map((network) => ({
        address: network.tokenContractAddress as `0x${string}`,
        abi: OFTAbi as any,
        functionName: "balanceOf",
        args: [address],
        chainId: network.chainId,
      })),
  });

  const { data: allPassBalances, refetch: refecthPass } = useContractReads({
    contracts: networks
      .filter((network) => network?.trackerContractAddress !== undefined)
      .map((network) => ({
        address: network?.trackerContractAddress as `0x${string}`,
        abi: PassAbi as any,
        functionName: "balanceOf",
        args: [address],
        chainId: network.chainId,
      })),
  });

  useEffect(() => {
    saveOFT();
    saveONFT();
    savePass();
  }, [allOFTBalances, allNftBalances, allPassBalances]);

  useEffect(() => {
    getSingleUser();
    getLeaderboard(1);
  }, []);

  const totalSum = () => {
    if (!address) {
      toast("Please connect your wallet");
      return;
    } else if (
      leaderboard.filter(
        (item: any) => item?.wallet === address?.toString().toLowerCase()
      )?.[0]?.wallet === address?.toString().toLowerCase()
    ) {
      toast("You are already in the leaderboard");
      return;
    } else {
      saveOFT();
      saveONFT();
      savePass();
      getSingleUser();

      toast("Successfully joined leaderboard");
      return;
    }
  };

  const saveONFT = () => {
    if (!allNftBalances) return;

    const totalBalance = allNftBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setNftBalance(totalBalance);

    joinLeaderboard(totalBalance, "NFT");
  };

  const saveOFT = () => {
    if (!allOFTBalances) return;

    const totalBalance = allOFTBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setOftBalance(totalBalance);

    joinLeaderboard(Number(ethers.formatUnits(totalBalance.toString())), "OFT");
  };

  const savePass = () => {
    if (!allPassBalances) return;

    const totalBalance = allPassBalances
      .filter((balance) => balance?.result !== undefined)
      .reduce((accumulator, balance) => accumulator + Number(balance?.result), 0);

    setPassBalance(totalBalance);

    joinLeaderboard(totalBalance, "PASS");
  };

  const joinLeaderboard = (
    totalBalance: number | undefined,
    type: string | undefined
  ) => {
    if (!totalBalance || !type) return;

    axios
      .post("/api/joinLeaderboard", {
        address: address,
        balance: totalBalance,
        contract: type,
      })
      .then((res) => {
        refechOFT();
        refetchNFT();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLeaderboard = async (page: any) => {
    try {
      const response = await axios.post<LeaderboardResponse>("/api/getLeaderboard", {
        pagination: itemsPerPage,
        page: page,
      });
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
  };

  const getSingleUser = async () => {
    if (!address) return;
    try {
      const response = await axios.post<UserResponse>("/api/getSingleUser", {
        wallet: address,
      });

      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      // Handle errors
    }
  };

  const refreshData = async () => {
    if (!address) {
      toast("Please connect your wallet");
      return;
    }
    setIsRefreshing(true);

    await refechOFT();
    await refetchNFT();
    await refecthPass();
    getSingleUser();
    setIsRefreshing(false);

    toast("Successfully refreshed leaderboard");
    return;
  };

  function renderPaginationButton(page: any, onClick: any) {
    const isActive = page === currentPage;
    return (
      <button
        key={page}
        onClick={onClick}
        className={`mx-1 focus:outline-none ${
          isActive
            ? "bg-[#71cbbc] text-white shadow-lg hover:shadow-xl"
            : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        } rounded-full px-2 py-1 text-sm`}
      >
        {page}
      </button>
    );
  }

  // Show a fixed number of pages
  const maxVisiblePages = 10;

  // Calculate the range of pages to display
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  console.log("user", user);

  return (
    <div className="flex w-full flex-col gap-5 mt-0 lg:mt-7">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between items-center border p-7 rounded-lg border-white border-opacity-5 bg-[#0C0C0C]">
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-3">
            <span className="text-white text-2xl lg:text-5xl mr-5">Leaderboard</span>
            <button className="btn-grad p-3 ml-5" onClick={totalSum}>
              Join Leaderboard
            </button>
          </div>
          <span className="text-cool-gray-400 break-words mt-4">
            Exclusive ranking for DappGate users. Mint, bridge, and get XP to earn unique
            rewards.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Avvvatars
            value={address ? formatAddress(address) : ""}
            style="shape"
            size={80}
          />
          <div className="flex flex-col text-lg text-white">
            <span className="font-semibold text-grey-cool-500 text-grey-cool-500 text-lg lg:text-2xl">
              Your Ranking:
            </span>

            <div className="flex items-center mt-1">
              <div className="bg-[#71cbbc] text-white rounded-md px-3 py-1 ml-2 text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                {user?.sortIndex || "-"}
              </div>
              <span className="text-[#858585] p-2 text-2xl">/ {totalUsers}+</span>
              <FontAwesomeIcon
                icon={faSync}
                className={`ml-2 text-[#888888] hover:cursor-pointer items-center ${
                  isRefreshing ? "refreshing" : ""
                }`}
                onClick={() => refreshData()}
              />
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
          {leaderboard.map((item: any, index: number) => (
            <tr
              key={item.wallet}
              className={`pt-4  w-[80%] shadow-inner rounded-lg ${
                item?.wallet.toLowerCase() === address?.toString().toLowerCase()
                  ? "bg-[#1abc9c] text-[#000]"
                  : "text-[#AAA]"
              }`}
            >
              <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
                <span
                  className={`rounded-full py-1 px-3 ${
                    item?.index === 1
                      ? "bg-[#FFAD0E]"
                      : item?.index === 2
                      ? "bg-[#AD5707]"
                      : item?.index === 3
                      ? "bg-[#939393]"
                      : item?.index === 4
                      ? "bg-gray-600"
                      : "bg-gray-800"
                  } text-white`}
                >
                  {item?.index}
                </span>
              </td>
              <td className="table-cell w-[40.6%] flex items-center">
                <div className="flex items-center">
                  <Avvvatars value={item?.wallet} style="shape" />
                  <span className="whitespace-nowrap ml-3">
                    {formatAddress(item.wallet)}
                  </span>
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
        <button
          onClick={() => handlePageChange(1)}
          className={`mx-1 focus:outline-none ${
            currentPage === 1
              ? "bg-[#71cbbc] text-white shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
          } rounded-full px-2 py-1 text-sm`}
        >
          First
        </button>

        {startPage > 1 && (
          <button
            onClick={() => handlePageChange(startPage - 1)}
            className={`mx-1 focus:outline-none bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out rounded-full px-2 py-1 text-sm`}
          >
            ...
          </button>
        )}

        {pageNumbers
          .slice(startPage, endPage + 1)
          .map((page) => renderPaginationButton(page, () => handlePageChange(page)))}

        {endPage < totalPages && (
          <button
            onClick={() => handlePageChange(endPage + 1)}
            className={`mx-1 focus:outline-none bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out rounded-full px-2 py-1 text-sm`}
          >
            ...
          </button>
        )}

        <button
          onClick={() => handlePageChange(totalPages)}
          className={`mx-1 focus:outline-none ${
            currentPage === totalPages
              ? "bg-[#71cbbc] text-white shadow-lg hover:shadow-xl"
              : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-gray-800 transform hover:scale-105 transition-transform duration-300 ease-in-out"
          } rounded-full px-2 py-1 text-sm`}
        >
          Last
        </button>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
