import { Fragment, use, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { Network } from "../page";

type Props = {
  selectedHyperBridges: any;
  tokenAmountHyperBridge: number;
  mintCostData: any;
  sourceChain: Network;
  bridgeCostData: any;
};

const TransactionPreview = ({
  selectedHyperBridges,
  tokenAmountHyperBridge,
  mintCostData,
  sourceChain,
  bridgeCostData,
}: Props) => {
  useEffect(() => {}, [
    selectedHyperBridges,
    tokenAmountHyperBridge,
    mintCostData,
    sourceChain,
    bridgeCostData,
  ]);

  return (
    <>
      <div className="flex justify-center mt-5  mb-4">
        <div className="border rounded-md shadow-md p-4 px-8 py-8">
          <h1 className="text-xl font-bold mb-4">Transaction Preview</h1>
          <table className="w-fit">
            <tbody>
              <tr>
                <td className="font-bold pr-4">Destination Chains</td>
                <td>
                  You have selected{" "}
                  {selectedHyperBridges.filter((x: any) => x !== 0).length}{" "}
                  destination chains{" "}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Mint Estimated Cost:</td>
                <td>
                  {ethers.formatEther(
                    BigInt(mintCostData as unknown as string)
                  )}{" "}
                  {sourceChain?.symbol}
                </td>
              </tr>
              <tr>
                <td className="font-bold pr-4">Bridge Estimated Cost:</td>
                <td>
                  {
                    (Number(bridgeCostData) *
                      Number(selectedHyperBridges?.length)) as unknown as string
                  }{" "}
                  {sourceChain?.symbol}
                </td>
              </tr>

              {/* Add more transaction details here */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TransactionPreview;
