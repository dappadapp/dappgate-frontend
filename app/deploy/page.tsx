"use client";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const options = [
  {
    to: "/deploy/erc20",
    name: "ERC20 TOKEN",
    desc: "Deploys an ERC20 token",
  },
  {
    to: "/deploy/basic",
    name: "BASIC TOKEN",
    desc: "Deploys a simple and cheap contract",
  },
];

const Deploy: React.FC = ({}) => {
  return (
    <div className="relative w-full h-auto overflow-x-hidden">
      <div className="relative z-10 w-full min-h-[90vh]  px-8 gap-10 lg:px-28 h-full flex flex-col p-2  justify-center items-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white">Welcome to Scroll</h2>
        <h2 className="text-5xl md:text-6xl font-bold mb-5 md:mb-5 text-white">
          Contract Deploy Tool
        </h2>
        <div className="flex flex-col lg:flex-row justify-between items-center w-full lg:w-3/4">
          <div className="flex flex-col gap-4 items-center">
            <Link
              href={options[0].to}
              className="px-6 bg-[#fff] text-[#000] rounded-md py-4"
            >
              {options[0].name}
            </Link>
            <span className="text-sm">{options[0].desc}</span>
          </div>
          <span className="text-xl lg:text-3xl"></span>
          <div className="flex flex-col gap-4 items-center">
            <Link
              href={options[1].to}
              className="px-6 bg-[#fff] text-[#000] rounded-md py-4"
            >
              {options[1].name}
            </Link>
            <span className="text-sm">{options[1].desc}</span>
          </div>
        </div>
        <div className="text-base md:text-lg font-semibold text-grey-400">
          <strong className="text-blue-300">Powered by Scroll</strong>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Deploy;
