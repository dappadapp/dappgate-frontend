"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaBars, FaChartArea, FaChartLine, FaClock, FaCompass } from "react-icons/fa";
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
    title: "Discover",
    href: "#",
    icon: <FaCompass size={24} />,
  },
  {
    title: "Upcoming",
    href: "#",
    icon: <FaClock size={24} />,
  },
];

const Sidebar: React.FC = (props) => {
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const menu = menuItems.map((menuItem) => {
    return (
      <Link
        href={menuItem.href || ""}
        className={`flex items-center gap-2 p-3 w-full transition-all hover:text-white ${
          pathname === menuItem.href
            ? "[&>svg]:fill-white text-white rounded-lg btn-grad"
            : "[&>svg]:fill-[#AAA] text-[#AAA]"
        }`}
        key={`menu-item-${menuItem.href}`}
        onClick={() => setMenuOpen(false)}
      >
        {menuItem.icon} {menuItem.title}
      </Link>
    );
  });

  return (
    <header className="flex md:min-w-[18%] md:top-0 md:h-screen px-4 md:bg-black flex-col pl-5 pb-4 gap-24 md:sticky md:pt-8">
      {/* Desktop */}
      <Link href="/" className="hidden md:flex items-center p-3 ">
       <DappGateLogo />
       
      </Link>
      <nav className={`hidden md:flex flex-col items-start ml-2 gap-5 flex-1`}>
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
      <div className="flex md:hidden mt-5 items-center bg-transparent self-center z-50">
        <FaBars onClick={() => setMenuOpen((prev) => !prev)} />
      </div>
      <nav
        className={`flex md:hidden flex-col w-full items-center gap-10 transition-all overflow-hidden absolute left-0 mt-16 z-50 ${
          isMenuOpen ? "px-10" : "max-w-[0px] px-0"
        }`}
      >
        {menu}
        <ConnectButton />
      </nav>

      <div className="hidden md:flex w-full">
      
      </div>
    </header>
  );
};

export default Sidebar;
