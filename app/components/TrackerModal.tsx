import React from "react";
import Image from "next/image";
import trackerImg from "@/assets/images/trackedImg.png";
type Props = {
  onCloseModal: any;
};

function TrackerModal({ onCloseModal }: Props) {
  return (
    <div
      className={
        "z-[999] fixed w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "relative md:p-0 p-3 max-w-[90vw] w-[300px] min-h-[500px] md:min-h-[600px] md:min-w-[800px] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div
          onClick={() => onCloseModal()}
          className="absolute top-5 right-5 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
        >
          X
        </div>
        <div className="w-full h-full md:gap-0 gap-4 md:absolute flex flex-col md:flex-row">
          <Image
            src={trackerImg}
            alt="tracker-img"
            className="h-full object-fill w-full md:w-[40%]"
            width={200}
            height={200}
          />
          <div className="flex flex-col h-full justify-center gap-10 px-4 items-center text-center">
            <span className="text-base md:text-2xl md:mb-6">TRACKER</span>
            <span>
              Uncover Estimated Airdrop Amounts based on the Arbitrum and Optimism! 🌟
            </span>
            <span>
              🎉 Are you ready to supercharge your crypto journey? Discover the power of
              precise airdrop estimations with Tracker! 🚀
            </span>
            <button
              className="px-6 py-4 text-white bg-blue-500 rounded-lg"
              onClick={() => {
                window.open("https://tracker.dappgate.io/");
              }}
            >
              Track Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerModal;
