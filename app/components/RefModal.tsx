import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type Props = {
  onCloseModal: any;
};

function RefModal({ onCloseModal }: Props) {
  const { address: walletAddress } = useAccount();
  const [totalRef, setTotalRef] = useState(0);
  const [rate, setRate] = useState(0);
  const [refLink, setRefLink] = useState("");
  useEffect(() => {
    fetchTotalNORefs();
  }, [walletAddress]);

  const fetchTotalNORefs = async () => {
    const { data } = await axios.post("/api/reference", {
      walletAddress,
    });
    setTotalRef(data.mints);
    setRate(data.rate);
    setRefLink(`https://gate.dappad.app/?ref=${data.ref}`);
  };

  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "p-16 max-w-[90vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex  justify-between mb-2">
          <h1 className={"text-3xl"}>Title</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>
        <p className={"opacity-75"}>
          subtitle subtitle subtitle subtitle subtitle subtitle subtitle
          subtitle subtitle subtitle
        </p>
        <div
          className={"w-full mt-12 flex p-4 bg-white bg-opacity-5 rounded-lg"}
        >
          Your claimable refferal rewards
          <br />
          {rate * totalRef}$
        </div>
        <p className={"opacity-75 mt-10"}>subtitle subtitle</p>
        <div className={"flex gap-4 h-12 mt-1"}>
          <div
            className={
              'rounded-lg w-full px-4 h-full flex items-center bg-white bg-opacity-5 rounded-lg"'
            }
          >
            {refLink}
          </div>
          <button
            className={
              "px-4 w-fit h-full items-center flex bg-white rounded-lg text-black "
            }
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
        <p className={"mt-10"}>asdasdasd</p>
      </div>
    </div>
  );
}

export default RefModal;
