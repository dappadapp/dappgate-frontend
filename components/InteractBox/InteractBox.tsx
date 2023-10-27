import React, { useState } from "react";
import { BsArrowBarLeft } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import InteractCard from "./InteractCard/InteractCard";
type Props = {
  onClose: any;
};
function InteractBox(props: Props) {
  const [contract, setContract] = useState("");
  const [contractData, setContractData] = useState();
  return (
    <div className="flex flex-col gap-4 items-center px-8 lg:px-28">
      <div className="w-full justify-start">
        <MdArrowBack size={36} className="cursor-pointer" onClick={props.onClose} />
      </div>
      <h2 className="text-5xl md:text-6xl font-bold  text-white">Interact</h2>
      <div className="gap-4 flex items-center justify-between">
        {" "}
        <input
          type="text"
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em]"
          placeholder="Enter Token Address"
        />
        <button className="px-6 py-4 bg-[#fff] text-[#000] rounded-md md:w-[8em]">
          {contractData ? "CHANGE" : "SEARCH"}
        </button>
      </div>
      {!contractData && (
        <>
          <div className="lg:w-[39em] gap-4 grid grid-cols-2 lg:grid-cols-4">
            <InteractCard title="Your Balance" value={0.0} />
            <InteractCard title="Name" value="Bla bla" />
            <InteractCard title="Symbol" value="BLA" />
            <InteractCard title="Total Supply" value={100.0} />
          </div>
          <div className="gap-4 flex items-center justify-between">
            {" "}
            <input
              type="text"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em]"
              placeholder="Mint Tokens"
            />
            <button className="px-6 py-4 bg-[#fff] text-[#000] rounded-md md:w-[8em]">
              MINT
            </button>
          </div>
          <div className="gap-4 flex items-center justify-between">
            {" "}
            <input
              type="text"
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em]"
              placeholder="Burn Tokens"
            />
            <button className="px-6 py-4 bg-[#fff] text-[#000] rounded-md md:w-[8em]">
              BURN
            </button>
          </div>
          <div className="h-[2px] lg:w-[39em] w-full bg-white"></div>
          <div className="flex flex-col gap-4 text-left">
            <h4>Transfer Tokens</h4>
            <div className="gap-4 flex items-center justify-between">
              {" "}
              <input
                type="text"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                className="bg-black border rounded px-4 py-4 text-white w-full md:w-[39em]"
                placeholder="Amount"
              />
            </div>
            <div className="gap-4 flex items-center justify-between">
              {" "}
              <input
                type="text"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                className="bg-black border rounded px-4 py-4 text-white w-full md:w-[30em]"
                placeholder="Address"
              />
              <button className="px-6 py-4 bg-[#fff] text-[#000] rounded-md md:w-[8em]">
                SEND
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InteractBox;
