import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type Props = {
  onCloseModal: any;
};

type Transaction = {
  tx: string;
  srcChain: string;
  dstChain: string;
  type: string;
  tokenId: number;
  timestamp: number;
};

function HistoryModal({ onCloseModal }: Props) {
  const { address: account } = useAccount();
  const [transactions, setTransactions] = useState([] as Transaction[]);

  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const { data }: { data: Transaction[] } = await axios.post(
        "/api/bridge/",
        {
          walletAddress: account,
        }
      );
      //Sort TX by Date
      data.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(data);
    };
    fetchTransactionHistory();
  }, [account]);

  return (
    <div
      className={
        "z-[999] absolute w-screen h-screen bg-black flex items-center justify-center backdrop-blur-2xl bg-opacity-25 top-0 left-0"
      }
    >
      <div
        className={
          "p-20 max-w-[90vw] bg-white bg-opacity-[4%] border-white border-[2px] rounded-lg border-opacity-10"
        }
      >
        <div className="flex justify-between mb-2">
          <h1 className={"text-xl sm:text-3xl"}>Transaction History</h1>
          <div
            onClick={() => onCloseModal()}
            className="right-0 z-[9999] font-medium rounded-md flex justify-center items-center cursor-pointer border border-gray-400 w-8 h-8"
          >
            X
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden mt-5">
          <div className="overflow-x-auto overflow-y-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2">Hash</th>
                  <th className="px-4 py-2">Source </th>
                  <th className="px-4 py-2">Destination </th>
                  <th className="px-4 py-2">Token ID</th>
                  <th className="px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-center mt-3 " colSpan={5}>
                      No transactions found.
                    </td>
                  </tr>
                )}

                {transactions?.map((transaction, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-transparent" : ""}
                  >
                    <td className="px-4 py-2">
                      {transaction.type === "mint" ? (
                        <span className="text-orange-400 underline">
                          {shortenTransactionHash(transaction.tx)}
                        </span>
                      ) : (
                        <a
                          href={`https://layerzeroscan.com/tx/${transaction.tx}`}
                          target="_blank"
                          className="text-orange-400 underline"
                        >
                          {shortenTransactionHash(transaction.tx)}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-2">{transaction.srcChain}</td>
                    <td className="px-4 py-2">{transaction.dstChain}</td>
                    <td className="px-4 py-2">{transaction.tokenId}</td>
                    <td className="px-4 py-2">
                      {new Date(transaction.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
