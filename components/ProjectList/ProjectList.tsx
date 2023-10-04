import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import DappGateLogo from "@/assets/dappgateLogo.svg";
import Image from "next/image";
type Props = {
  title: string;
  apps: any[];
};

const ProjectList: React.FC<Props> = ({ title, apps }) => {
  const openInNewTab = (url: string) => {
    window.open(url);
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
      {apps.map((app) => (
        <div key={"app-" + app.name} className="flex w-full items-center">
          <div className="flex-[2] gap-3 justify-start flex items-center">
            <Image
              width={70}
              height={70}
              className="rounded-full"
              src={app.image_url}
              alt={app.title}
            />
            <div className="flex flex-col gap-1 text-[#858585]">
              <span className="text-base text-white">{app.title}</span>
              <span className="text-xs">{app.sub_title}</span>
              <span className="text-xs break-words">{app.description}</span>
            </div>
          </div>
          <button
            className="rounded border border-[white] text-[#fff] text-sm border-opacity-5 px-3 py-2 lg:py-3 lg:px-6"
            onClick={() => openInNewTab(app.url)}
          >
            View App
          </button>
        </div>
      ))}
    </div>
  );
};
export default ProjectList;
