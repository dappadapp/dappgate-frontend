import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import logo from "@/assets/logo.png";

type Props = {
  title: string;
  apps: any[];
};

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
          <Image
            width={64}
            height={64}
            src={logo}
            alt="app-img"
            className="md:w-16 md:h-16 w-10 h-10 rounded-lg"
          />
          <div className="flex flex-col gap-1 text-[#858585]">
            <span className="text-base text-white">Dappad</span>
            <span className="text-xs">Defi/Launchpad</span>
            <span className="text-xs break-words">
              Lorem Ipsum Lorem Ipsum Lorem Ipsum
            </span>
          </div>
        </div>
        <button className="rounded border border-[white] text-[#8F8F8F] text-sm border-opacity-5 py-3 px-6">
          View App
        </button>
      </div>
    </div>
  );
};
export default ProjectList;
