"use client";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useBalance, useContractRead, useNetwork, useSwitchNetwork, useWaitForTransaction, useWalletClient } from "wagmi";
import ListboxSourceMenu from "../apps/dappgate/components/ListboxSourceMenu";
import { Network, networks } from "@/utils/networks";
import erc20Json from "../../config/deployErc20.json";
const ScrollBridge: React.FC = ({
}) => {

  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [initialSupply, setInitialSupply] = useState<string>("");
  const [fee, setFee] = useState<string>("0.0008376"); // Set an initial fee
  const [hash, setHash] = useState<undefined | `0x${string}`>();
  const [chainId, setChainId] = useState<number>(connectedChain?.id || 534352); // Set the desired chain ID
  const { data: walletClient } = useWalletClient({ chainId });
  const {
    data: deployTx,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash,
  });

  console.log("connectedChain", connectedChain);

  const [searchTerm, setSearchTerm] = useState("");
  const [sourceChain, setSourceChain] = useState(networks[0]);
  const [targetChain, setTargetChain] = useState();

  const [balance, setBalance] = useState("");


  const { address: account } = useAccount();

  const [loading, setLoading] = useState(false);

  const { data: balanceOfUser } = useBalance({
    address: account as `0x${string}`,
    chainId: connectedChain?.id,
  });

  const [userBalance, setUserBalance] = useState<number | string>("");

  useEffect(() => {
    if (balanceOfUser) {
      setUserBalance(balanceOfUser?.formatted || 0);
    }


  }, [balanceOfUser, account, connectedChain?.id, sourceChain, targetChain, hash]);




  const onChangeSourceChain = async (selectedNetwork: Network) => {
    const chain = networks.find((network) => network.name === selectedNetwork.name);
    if (chain) {
      try {
        if (chain.chainId !== connectedChain?.id) {
          await switchNetworkAsync?.(chain.chainId);
        }

        setSourceChain(chain || networks[0]);
        toast("Chain changed!");
      } catch (error: any) {
        if (error.code === 4001) {
          toast("You need to confirm the Metamask request in order to switch network.");
          return;
        }
        console.log(error.code);
        toast("Temporarly closed for maintenance.");
        return;
      }
    }



  };




  async function onSubmit() {
    try {

      if (!name || !symbol || !initialSupply || !fee) {
        toast("Please fill in all required fields.");
        return;
      }

      setLoading(true);
      // Convert fee to wei
      const feeWei = `${parseFloat(fee) * 1e18}`;

      const weiInitialSupply = `${parseFloat(initialSupply)}`;

      const abi = erc20Json.abi;
      const bytecode = erc20Json?.data?.bytecode.object as `0x${string}`;

      console.log("bytecode", bytecode);

      const args = [name, symbol, weiInitialSupply, feeWei];
      const hash = await walletClient?.deployContract({ abi, bytecode, args, value: BigInt(feeWei) });
      setHash(hash);
      toast("Contract deployed!");
      setLoading(false);
      setName("");
      setSymbol("");
      setInitialSupply("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast("Error deploying contract.");

    }
  }


  const shortenTransactionHash = (transactionHash: string): string => {
    const shortenedHash = `${transactionHash.substring(
      0,
      5
    )}...${transactionHash.substring(transactionHash.length - 5)}`;
    return shortenedHash;
  };

import Link from "next/link";

const options = [
  {
    to: "/deploy/erc20",
    name: "ERC20 TOKEN",
    desc: "Deploys an ERC20 token",
  },
  {
    to: "/deploy/basic",
    name: "BASIC TOKEN",
    desc: "Deploys a simple and cheap contract",
  },
];

const Deploy: React.FC = ({}) => {
  return (
    <div className="relative w-full h-auto overflow-x-hidden">
      <div className="relative z-10 w-full min-h-[90vh]  px-8 gap-10 lg:px-28 h-full flex flex-col p-2  justify-center items-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white">Welcome to Scroll</h2>
        <h2 className="text-5xl md:text-6xl font-bold mb-5 md:mb-5 text-white">
          Contract Deploy Tool
        </h2>
        <div className="flex flex-col lg:flex-row justify-between items-center w-full lg:w-3/4">
          <div className="flex flex-col gap-4 items-center">
            <Link
              href={options[0].to}
              className="px-6 bg-[#fff] text-[#000] rounded-md py-4"
            >
              {options[0].name}
            </Link>
            <span className="text-sm">{options[0].desc}</span>
          </div>
          <span className="text-xl lg:text-3xl"></span>
          <div className="flex flex-col gap-4 items-center">
            <Link
              href={options[1].to}
              className="px-6 bg-[#fff] text-[#000] rounded-md py-4"
            >
              {options[1].name}
            </Link>
            <span className="text-sm">{options[1].desc}</span>
          </div>
        </div>
        <div className="text-base md:text-lg font-semibold text-grey-400">
          <strong className="text-blue-300">Powered by Scroll</strong>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default Deploy;
