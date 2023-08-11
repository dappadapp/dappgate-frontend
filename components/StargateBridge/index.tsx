import StargateWidget from "@/app/components/StargateWidget";
import React from "react";

const StargateBridge = () => {
  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>Stargate Bridge</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-col justify-between items-center mt-8 mb-8"
        }
      >
        <StargateWidget />
      </div>
    </div>
  );
};

export default StargateBridge;
