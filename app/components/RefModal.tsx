import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { QRCodeSVG } from "qrcode.react";
import copySvg from "@/assets/images/copy-regular.svg";
import Image from "next/image";

type Props = {
  onCloseModal: () => void;
  refCode?: string;
};

function RefModal({ onCloseModal, refCode }: Props) {
  const { address: account } = useAccount();
  const [totalRef, setTotalRef] = useState(0);
  const [rate, setRate] = useState(0);
  const [refLink, setRefLink] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [isCopied, setIsCopied] = useState<"link" | "button" | null>();

  const twitterShare = () => {
    // twitter intent
    const url = `https://twitter.com/intent/tweet?text=Experience the future of omnichain using dappgate with me ${refLink} @DappGate`;
    window.open(url, "_blank");
  };

  const handleQrcode = () => {
    setShowQRCode(!showQRCode);
  };

  useEffect(() => {
    const fetchTotalNORefs = async () => {
      const { data } = await axios.post("/api/reference", {
        walletAddress: account,
      });

      setTotalRef(+(data.mints as number).toFixed(2));
      setRate(data.rate);
      setRefLink(`https://dappgate.app/?ref=${data.ref}`);
    };
    fetchTotalNORefs();
  }, [account]);

  useEffect(() => {
    if (!isCopied) return;
    setTimeout(() => setIsCopied(null), 1000);
  }, [isCopied]);

  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      {account ? (
        <div
          className={
            "p-16 max-w-[90vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
          }
        >
          <div className="flex  justify-between mb-2">
            <h1 className={"text-3xl"}>Referral Program</h1>
            <div
              onClick={() => onCloseModal()}
              className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
            >
              X
            </div>
          </div>
          {/*
          <div className="flex justify-between">
            <button
              onClick={handleSignIn}
              className=" bg-white bg-opacity-100 hover:bg-opacity-100 p-3 rounded-lg text-black mt-5"
            >
              {" "}
              Claim Twitter Username{" "}
            </button>
          </div>
          */}
          <p className={"opacity-75 mt-5"}>
            Share your referral link with your friends, and when your friends
            mint a token or NFT, you will get rewarded with USDC.
          </p>
          <div
            className={
              "w-full mt-4 mb-2 flex p-4 bg-white bg-opacity-5 rounded-lg"
            }
          >
            Your rewards
            <br />
            {totalRef} $
          </div>
          <p className={"opacity-75 mt-10"}>
            Share your referral link with your friends and get rewarded with
            USDC
          </p>
          <div className={"flex gap-4 h-12 mt-1"}>
            <div
              className={
                'relative rounded-lg w-full px-4 h-full flex items-center gap-4 bg-white bg-opacity-5 rounded-lg"'
              }
            >
              <p
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(refLink);
                  setIsCopied("link");
                }}
              >
                {refLink}
              </p>
              {refLink && (
                <button
                  className="bg-white bg-opacity-60 hover:bg-opacity-100 p-1.5 rounded-lg"
                  onClick={() => {
                    navigator.clipboard.writeText(refLink);
                    setIsCopied("button");
                  }}
                >
                  <Image
                    src={copySvg}
                    alt="copy-svg-icon"
                    className="w-6 h-6 text-white"
                  />
                </button>
              )}
              <div
                className={`absolute p-2 flex items-center justify-center rounded-md transition-all duration-200 bg-white text-black z-[9999999999999] -top-10 ${
                  isCopied ? "h-10" : "h-0 opacity-0"
                } ${isCopied === "button" ? "-right-2" : "right-[50%]"}`}
              >
                Copied!
              </div>
            </div>
            <button
              className={
                "px-4 w-fit h-full items-center flex bg-white rounded-lg text-black "
              }
              onClick={twitterShare}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg>
            </button>
            <button
              className={
                "px-4 w-fit rounded-lg h-full items-center flex bg-white rounded-lg text-black "
              }
              onClick={handleQrcode}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
              >
                <path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center mt-5">
            <p className="mt-2">Follow Us</p>
            <div className="flex flex-row">
              <a
                href="https://twitter.com/DappGate"
                target="_blank"
                className={
                  "m-1 px-1 w-10 h-10 justify-center items-center flex bg-white text-white rounded-lg"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/dappadlaunchpad"
                target="_blank"
                className={
                  "m-1 px-1 w-10 h-10 justify-center items-center flex bg-white text-white rounded-lg"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  width="1em"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path>
                </svg>
              </a>
            </div>
          </div>
          <p className={"mt-4"}>
            {showQRCode && <QRCodeSVG value={refLink} size={200} />}
          </p>
        </div>
      ) : (
        <div
          className={
            "p-16 max-w-[90vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
          }
        >
          <div className="flex justify-between items-center gap-6 mb-2">
            <p>Please connect your wallet.</p>{" "}
            <div
              onClick={() => onCloseModal()}
              className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
            >
              X
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefModal;
