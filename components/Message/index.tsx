import CircleSvg from "@/app/components/CircleSvg";
import ListboxSourceMenu from "@/app/components/ListboxSourceMenu";
import ListboxTargetMenu from "@/app/components/ListboxTargetMenu";
import { Network, networks } from "@/utils/networks";
import React, { useState } from "react";
import DappLetterAbi from "@/config/abi/Message.json";
import SendButton from "./SendButton";
import { useAccount, useContractRead, useContractReads } from "wagmi";

type Props = {
  sourceChain: Network;
  targetChain: Network;
  onChangeSourceChain: (selectedNetwork: Network) => Promise<void>;
  onChangeTargetChain: (selectedNetwork: Network) => Promise<void>;
  onArrowClick: () => Promise<void>;
};

const Message: React.FC<Props> = ({
  sourceChain,
  targetChain,
  onChangeSourceChain,
  onChangeTargetChain,
  onArrowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { address: account } = useAccount();

  // fetching received messages
  const { data: receivedMessageCount } = useContractRead({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: DappLetterAbi,
    functionName: "getReceivedMessageCountFromAddress",
    args: [account],
  });

  const readParams = Array.from(
    Array(Number(receivedMessageCount) || 0).keys()
  ).map((i) => ({
    address: sourceChain.nftContractAddress as `0x${string}`,
    abi: DappLetterAbi as any,
    functionName: "getMessagesFromReceiver",
    args: [account, i] as any,
  }));

  const { data: receivedMessagesData } = useContractReads({
    contracts: readParams,
  });

  console.log("receivedMessagesData", receivedMessagesData);

  const handleRandomClick = () => {
    console.log("dnsaj");
  };

  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>Send Message</h1>
      </div>
      <div
        className={
          "flex flex-col gap-2 sm:flex-row justify-between items-center mt-8"
        }
      >
        <ListboxSourceMenu
          value={sourceChain}
          onChange={onChangeSourceChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />

        <CircleSvg onArrowClick={onArrowClick} isClickable={true} />

        <ListboxTargetMenu
          value={targetChain}
          sourceValue={sourceChain}
          onChange={onChangeTargetChain}
          options={filteredNetworks}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
        />
      </div>
      <div className="flex text-base xl:text-lg font-semibold mt-5">
        Step 1: Enter the wallet address of the user you want to send the
        message to.
      </div>
      <div className="relative flex flex-row justify-between w-full sm:w-full">
        {/** In input box create a max option for balance max */}

        <input
          type="text"
          className="w-full flex rounded-lg bg-white min-h-[60px] bg-opacity-5 py-1 px-4 text-left text-lg focus:outline-none mt-2 mb-2"
          placeholder="Enter Receiver"
          onChange={(e) => setReceiver(e.target.value)}
          value={receiver}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 px-3 py-2 bg-green-500/40 text-white rounded-md"
          onClick={handleRandomClick}
        >
          Random
        </button>
      </div>
      <div className="flex text-base xl:text-lg font-semibold mt-5">
        Step 2: Enter the message you&apos;d like to send.
      </div>
      <div className="flex flex-row justify-between items-center w-full sm:w-full">
        <input
          type="text"
          className="w-full flex rounded-lg bg-white min-h-[60px] bg-opacity-5 py-1 px-4 text-left text-lg focus:outline-none mt-2 mb-2"
          placeholder="Enter Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>

      <SendButton
        sourceChain={sourceChain}
        targetChain={targetChain}
        receiverAddress={receiver}
        messageContent={message}
      />
    </div>
  );
};

export default Message;
