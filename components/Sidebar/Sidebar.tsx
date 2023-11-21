"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  FaBars,
  FaBullseye,
  FaChartArea,
  FaChartLine,
  FaClock,
  FaCompass,
  FaSubway,
  FaWallet,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaSpa } from "react-icons/fa";
import { BsSafeFill } from "react-icons/bs";
import { MdRocketLaunch } from "react-icons/md";
import DropbaseLogo from "@/assets/img/DropbaseLogo.svg";
import DappGateLogo from "@/app/apps/dappgate/components/DappGateLogo";
import ConnectButton from "../ConnectButton/ConnectButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: <FaHome size={24} />,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: <FaChartLine size={24} />,
  },

  {
    title: "Contract Deploy",
    href: "/deploy",
    icon: <FaCompass size={24} />,
  },
  {
    title: "Scroll Bridge",
    href: "/bridge",
    icon: <FaWallet size={24} />,
  },
  {
    title: "Quests",
    href: "#",
    icon: <FaBullseye size={24} />,
  },
];

const Sidebar: React.FC = (props) => {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menu = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.href || ""}
        className={`relative flex items-center gap-2 p-3 w-full transition-all hover:text-white ${
          pathname === menuItem.href
            ? "fill-white text-white rounded-lg btn-grad"
            : "fill-[#AAA] text-[#AAA]"
        }`}
        key={`menu-item-${menuItem.href}`}
        onClick={() => setMenuOpen(false)}
        onMouseEnter={() => menuItem.href === "#" && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {menuItem.icon} {menuItem.title}
        {/* Tooltip */}
        {showTooltip && menuItem.href === "#" && (
          <span className="absolute left-1/2 transform -translate-x-1/5  p-2 bg-black text-white text-xs rounded  transition-opacity">
            Coming Soon!
          </span>
        )}
      </Link>
    );
  });

  return (
    <header className="flex md:min-w-[19%] w-full md:w-auto md:top-0 md:h-screen px-4 md:bg-black flex-col pl-5 pb-4 gap-24 md:sticky md:pt-8">
      {/* Desktop */}
      <Link href="/" className="hidden md:flex items-center p-3 -mt-2">
        <DappGateLogo />
      </Link>
      <nav className={`hidden md:flex flex-col items-start ml-2 gap-5 flex-1 `}>
        {menu}
        <ConnectButton />
      </nav>

      {/* Mobile */}
      <div
        className={`absolute self-start top-0 left-0 right-0 bottom-0 z-40 bg-black max-w opacity-90 ${
          isMenuOpen ? "block" : "hidden"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div className="flex right-1 justify-between w-full md:hidden mt-5 items-center bg-transparent self-center z-50">
        <DappGateLogo />
        <FaBars onClick={() => setMenuOpen((prev) => !prev)} />
      </div>
      <nav
        className={`flex md:hidden flex-col w-full items-center gap-10 transition-all overflow-hidden absolute left-0 mt-16 z-50 ${
          isMenuOpen ? "px-10 pt-8" : "max-w-[0px] px-0"
        }`}
      >
        {menu}
        <ConnectButton />
      </nav>

      <div className="hidden md:flex w-full"></div>
    </header>
  );
};

export default Sidebar;
