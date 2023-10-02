import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import DappGateLogo from "@/assets/dappgateLogo.svg";

type Props = {
  title: string;
  apps: any[];
};

const dappgateLogo = ( ) => (
 (
  <svg
  width="64"
  height="64"
  viewBox="0 0 633 549"
  fill="none"
  xmlns="http://www.w3.org/2000/svg%22%3E"
>
  <path
    d="M553.738 399.006L392.48 548.506C297.662 466.11 263.499 376 255.995 317.496C225.5 171.5 306.999 129.999 336.496 117.999C438.496 76.4994 541.486 224.496 553.738 236.994C571.986 262.994 606.233 298.835 632.48 326.006L574.48 379.777L400.98 195.506C332.985 126.493 221.474 195.504 297.48 294.506L405.48 410.506L491.48 331.006L553.738 399.006Z"
    fill="white"
  />
  <path
    d="M78.7422 149.5L240.001 1.79982e-05C334.818 82.3954 368.981 172.506 376.486 231.01C406.98 377.006 325.481 418.507 295.985 430.506C193.985 472.006 90.9949 324.009 78.7422 311.512C60.4949 285.512 26.2478 249.671 0.000598658 222.5L58.0006 168.729L231.501 353C299.495 422.013 411.007 353.002 335.001 254L227.001 138L141.001 217.5L78.7422 149.5Z"
    fill="white"
  />
</svg>
)
);

const ProjectList: React.FC<Props> = ({ title, apps }) => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(12, 12, 12, 0.00) 91.15%, #0C0C0C 100%)",
      }}
      className="flex flex-col w-full p-8 gap-4 border border-white md:h-[375px] h-[200px] overflow-y-auto border-opacity-5 rounded-lg"
    >
      <div className="w-full flex justify-between">
        <h3 className="text-xl md:text-3xl text-white">{title}</h3>
        <FaArrowRight color="#8F8F8F" />
      </div>
      <div className="flex w-full items-center">
        <div className="flex-[2] gap-3 justify-start flex items-center">
        {dappgateLogo()}
          <div className="flex flex-col gap-1 text-[#858585]">
            <span className="text-base text-white">DappGate</span>
            <span className="text-xs">Layerzero ONFT/OFT Bridge</span>
            <span className="text-xs break-words">
            Pioneering #LayerZero to bridge ONFTs and OFTs across networks
            </span>
          </div>
        </div>
        <button className="rounded border border-[white] text-[#fff] text-sm border-opacity-5 py-3 px-6">
          View App
        </button>
      </div>
    </div>
  );
};
export default ProjectList;
