import CircleSvg from "@/app/apps/dappgate/components/CircleSvg";
import ListboxSourceMenu from "@/app/apps/dappgate/components/ListboxSourceMenu";
import ListboxTargetMenu from "@/app/apps/dappgate/components/ListboxTargetMenu";
import { Network, networks } from "@/utils/networks";
import React, { use, useState } from "react";
import DappLetterAbi from "@/config/abi/Message.json";
import { getPublicClient } from "@wagmi/core";
import SendButton from "./SendButton";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useBlockNumber,
} from "wagmi";
import { parseAbiItem } from "viem";
import CommentsSvg from "@/app/apps/dappgate/components/CommentsSvg";
import { useEffect } from "react";

const chains = [
  {
    id: 8453,
    fromBlock: 2387911n,
    toBlock: 2386084n,
    address: "0x9954f0B7a7589f6D10a1C40C8bE5c2A81950FB46",
  },
  {
    id: 42161,
    fromBlock: 119439619n,
    toBlock: 119476797n,
    address: "0x7554C507Ac1F7B0E09a631Bc929fFd3F7a492b01",
  },
  {
    id: 56,
    fromBlock: 30698085n,
    toBlock: 30699999n,
    address: "0x34b9d8B0B52F827c0f6657183ef88E6e0EefF54c",
  },
  {
    id: 10,
    fromBlock: 107986561n,
    toBlock: 107990190n,
    address: "0xd37f0A54956401e082Ec3307f2829f404E3C1AB4",
  },
  {
    id: 59144,
    fromBlock: 157770n,
    toBlock: 158251n,
    address: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
  },
];

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
  const [isReceivedMessageOpen, setIsReceivedMessageOpen] = useState(false)

  const filteredNetworks = networks.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    network.chainId !== 324
  );

  const { address: account } = useAccount();
  const { data: blockNumber } = useBlockNumber();

  // fetching received messages
  const { data: receivedMessageCount, error } = useContractRead({
    address: sourceChain.messageContractAddress as `0x${string}`,
    abi: DappLetterAbi,
    functionName: "getReceivedMessageCountFromAddress",
    args: [account],
    chainId: sourceChain.chainId
  });

  const { data: receivedMessagesData , refetch: getMessages} = useContractReads({
    contracts: Array.from(
      Array(Number(receivedMessageCount) || 0).keys()
    ).map((i) => ({
      address: sourceChain.messageContractAddress as `0x${string}`,
      abi: DappLetterAbi as any,
      functionName: "getMessagesFromReceiver",
      args: [account, i] as any,
      chainId: sourceChain.chainId
    })),
  });

  console.log("receivedMessagesData", receivedMessagesData);

  useEffect(() => {
    getMessages();
  }, [account, sourceChain.chainId, blockNumber])

  const handleRandomClick = async () => {
    if (!blockNumber) return;
    const randomNumber1 = Math.floor(Math.random() * chains.length);
    const randomChain = chains[randomNumber1];
    const publicClient = getPublicClient({
      chainId: randomChain.id,
    });
    const logs = await publicClient.getLogs({
      address: randomChain.address as `0x${string}`,
      event: parseAbiItem(
        "event Transfer(address indexed, address indexed, uint256)"
      ),
      fromBlock: randomChain.fromBlock,
      toBlock: randomChain.toBlock,
    });
    let randomAddress = "0x0000000000000000000000000000000000000000";
    while (randomAddress === "0x0000000000000000000000000000000000000000") {
      const randomNumber = Math.floor(Math.random() * logs.length);
      const address_ = logs[randomNumber]?.args[1]!;
      if (address_ !== "0x0000000000000000000000000000000000000000")
        randomAddress = address_;
    }
    setReceiver(randomAddress);
  };

  const receivedMessages = receivedMessagesData?.map((message: any, i) => {
    console.log('message', message)
    return (
      <div className="flex flex-col gap-2 bg-white/10 border-white border-[1px] rounded-lg px-8 py-2" key={i}>
        <div>Sender: {message.result[1]} </div>
        <div>Message: {message.result[0]} </div>
      </div>
    )
  })

  return (
    <div
      className={`w-full max-w-[975px] bg-white bg-opacity-5 backdrop-blur-[5px] border-white border-[2px] border-opacity-10 h-fit p-10 rounded-2xl flex flex-col`}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <h1 className={"text-3xl font-semibold"}>{isReceivedMessageOpen ? "Received Messages" : "Send Message"}</h1>
        <div className="relative cursor-pointer w-[32px]" onClick={() => setIsReceivedMessageOpen((prev) => !prev)}>
          <CommentsSvg />
          {receivedMessageCount ? <div className="absolute right-0 top-0 bg-red-600 p-1 px-1.5 text-xs rounded-full leading-[100%]">
            {Number(receivedMessageCount)}
          </div> : null}
        </div>
      </div>
      {
        isReceivedMessageOpen ?
          <>
            <div className="flex flex-col gap-8 mt-8">
              {receivedMessages}
            </div>
          </>
          :
          <>
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
          </>
      }
    </div>
  );
};

export default Message;
