import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import dynamic from "next/dynamic";
import RefModal from "./RefModal";
import { usePathname } from "next/navigation";
import DappGateLogo from "./DappGateLogo";

type Props = {
  pendingTxs: any;
  refCode: string;
};
const ConnectButton: any = dynamic(() => import("./ConnectButton"), {
  ssr: false,
});

const Navbar: React.FC<Props> = (props) => {
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const path = usePathname();
  return (
    <div
      className={"w-full flex flex-row items-center justify-between mt-2 md:mt-10 gap-2"}
    >
      <div className="flex gap-6 items-center">
        <DappGateLogo />
        <div className="flex flex-row justify-center mt-5 mb-5">
          <div className={"flex gap-2 lg:gap-4 text-[#AAA] text-sm lg:text-base"}>
            <Link href={"/"} className={`${path === "/" ? "text-white" : ""}`}>
              App
            </Link>
            <Link className={`${path === "/stats" ? "text-white" : ""}`} href={"/stats"}>
              Stats
            </Link>
            <a href="https://tracker.dappgate.io/" target="_blank">
              Tracker
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-3">
        <button
          className="backdrop-blur-sm font-semibold border px-3 py-1 bg-white text-[#AAA] border-white/10 bg-opacity-[4%] sm:px-5 sm:py-2 lg:px-10 lg:py-2 rounded-md transition-all duration-300"
          onClick={() => setIsRefModalOpen(true)}
        >
          Referral
          <FontAwesomeIcon className="ml-2" icon={faUserPlus} />
        </button>
        <ConnectButton pendingTxs={props.pendingTxs} />
      </div>
      {isRefModalOpen ? <RefModal onCloseModal={() => setIsRefModalOpen(false)} /> : null}
    </div>
  );
};
export default Navbar;
