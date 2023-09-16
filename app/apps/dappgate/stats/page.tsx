"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAccount } from "wagmi";
export default function Stats({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { address: account } = useAccount();
  const [refCode, setRefCode] = useState<string>("");
  const [pendingTxs, setPendingTxs] = useState<string[]>([]);
  const [statsData, setStatsData] = useState<any>({});

  const createWalletData = async (account: string) => {
    const { data } = await axios.post("/api/create", {
      wallet: account,
    });
  };
  const saveWalletAndIP = async (account: string) => {
    const { data } = await axios.post("/api/saveIP", {
      wallet: account,
    });
  };

  useEffect(() => {
    if (!account?.length) return;
    createWalletData(account);
    saveWalletAndIP(account);
  }, [account]);

  useEffect(() => {
    if (!searchParams?.ref) return;
    setRefCode(searchParams?.ref as string);
  }, [searchParams?.ref]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    const { data } = await axios.post("/api/status");
    console.log("data", data);
    setStatsData(data.data);
  };

  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

  return (
    <div className={"relative w-full h-[100vh] min-h-[800px] overflow-x-hidden"}>
      <div
        className={
          "absolute overflow-y-scroll z-10 w-full min-h-[800px] h-full flex flex-col p-2"
        }
      >
        <div className={"container mx-auto gap-2 h-full flex flex-col"}>
          <Navbar pendingTxs={pendingTxs} refCode={refCode} />

          <div
            className={
              "md:px-64 w-full max-w-full h-full min-h-fit flex flex-col md:h-full gap-4 items-center mx-auto justify-center"
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">{statsData.nft}</span>
                <span className="text-base">Total NFTs</span>
              </div>
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">{statsData.bridge}</span>
                <span className="text-base">Total Bridges</span>
              </div>
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">{statsData.oft}</span>
                <span className="text-base">Total OFTs</span>
              </div>
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">{statsData.hash}</span>
                <span className="text-base">Total Hash</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <span className="">Latest transactions</span>
              <table className=" overflow-y-scroll border-separate border-spacing-y-2 text-x md:text-base w-full">
                <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[288px]">
                  <tr className="w-full text-[#AAA]/50">
                    <td className="overflow-hidden w-[40%] md:w-[20.6%] whitespace-nowrap pl-2">
                      Hash
                    </td>
                    <td className="w-[40%] md:w-[20.6%]">Source</td>
                    <td className="hidden md:table-cell md:w-[20.6%]">Operation</td>
                    <td className="hidden md:table-cell md:w-[20.6%]">Ref Code</td>
                    <td className=" text-end pr-2">Date</td>
                  </tr>
                  {statsData.txs?.length
                    ? statsData.txs?.map((tx: any, i: number) => (
                        <tr
                          key={"tx-" + i}
                          className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg"
                        >
                          <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                            {tx.type === "mint" ? (
                              <span className="text-orange-400 underline">
                                {shortenTransactionHash(tx.hash)}
                              </span>
                            ) : (
                              <a
                                href={`https://layerzeroscan.com/tx/${tx.hash}`}
                                target="_blank"
                                className="text-orange-400 underline"
                              >
                                {shortenTransactionHash(tx.hash)}
                              </a>
                            )}
                          </td>
                          <td className="w-[30%] md:w-[18%]">{tx.chainId}</td>
                          <td className="hidden md:table-cell md:w-[18%]">
                            {/* //TODO Add destination chain */}
                            {tx.type === "mint" ? "Minted" : "Bridged"}
                          </td>
                          <td className="hidden md:table-cell md:w-[18%]">
                            {tx.ref || "No Ref"}
                          </td>
                          <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* ANIMATION */}
      <div className={"relative w-full h-full"}>
        <div className={"absolute z-[4] bg-effect w-full h-full"}></div>
        <div className={"absolute z-[3] w-full h-full bg-pattern"}></div>
        <div
          className={
            "relative bg-blur w-full h-full overflow-hidden flex items-center justify-center"
          }
        ></div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
