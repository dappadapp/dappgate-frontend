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
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">1234</span>
                <span className="text-base">Data Description</span>
              </div>
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">1234</span>
                <span className="text-base">Data Description</span>
              </div>
              <div className="p-8 text-center border-white/10 border-[1px] rounded-lg bg-white bg-opacity-[4%] flex flex-col w-full items-center justify-center">
                <span className="text-3xl">1234</span>
                <span className="text-base">Data Description</span>
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
                    <td className="w-[40%] md:w-[20.6%]">Token ID</td>
                    <td className="hidden md:table-cell md:w-[20.6%]">Destination</td>
                    <td className="hidden md:table-cell md:w-[20.6%]">Source</td>
                    <td className=" text-end pr-2">Date</td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>{" "}
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>{" "}
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-white/10 pt-4 text-[#AAA] shadow-inner rounded-lg">
                    <td className="overflow-hidden whitespace-nowrap w-[30%] md:w-[21%] py-4 rounded-l-lg  pl-2">
                      xxxxxxxxxxxxxx
                    </td>
                    <td className="w-[30%] md:w-[18%]">BSC Mainnet</td>
                    <td className="hidden md:table-cell md:w-[18%]">Polygon</td>
                    <td className="hidden md:table-cell md:w-[18%]">528222</td>
                    <td className=" text-end pr-2 w-[30%] rounded-r-lg">
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
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
