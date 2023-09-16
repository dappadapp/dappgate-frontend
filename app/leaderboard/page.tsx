"use client";
import Image from "next/image";
import React from "react";
import pfpExample from "@/assets/pfpExample.svg";

export default function LeaderBoard() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex justify-between items-center border p-4 rounded-lg border-white border-opacity-5 bg-[#0C0C0C]">
        <div className="flex flex-col">
          <span className="text-white text-4xl">Leaderboard</span>
          <span className="text-[#858585] break-words">
            Exclusive ranking for AVNU traders. Trade, earn points, and win unique
            rewards.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src={pfpExample}
            alt="pfp-image"
            width={80}
            height={80}
            className="w-20 h-20 rounded-lg"
          />
          <div className="flex flex-col text-sm text-white">
            <span>Your Ranking:</span>
            <div className="flex">
              <span>100/</span>
              <span className="text-[#858585]">100K+</span>
            </div>
          </div>
        </div>
      </div>
      <span className="">Leaderboard</span>
      <table className=" overflow-y-scroll border-separate border-spacing-y-2 text-x md:text-base w-full">
        <tbody className="overflow-y-scroll block table-fixed w-full mx-auto h-[380px]">
          <tr className="bg-[#111] w-[80%] text-white">
            <td className="overflow-hidden w-[20%] whitespace-nowrap pl-2"></td>
            <td className="overflow-hidden w-[40%] whitespace-nowrap pl-2">Address</td>
            <td className="w-[40.6%]">XP</td>
            <td className=" table-cell w-[40.6%]">Transactions</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
          <tr className=" pt-4 text-[#AAA] w-[80%] shadow-inner rounded-lg">
            <td className="overflow- whitespace-nowrap w-[20%] py-4 rounded-l-lg  pl-2">
              1
            </td>
            <td className=" table-cell w-[40.6%]">0x3D6a34D8ECe464....</td>
            <td className=" table-cell w-[40%]">100XP</td>
            <td className=" pr-2 w-[40%] rounded-r-lg">112TX</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
