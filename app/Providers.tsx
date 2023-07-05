"use client";

import React from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  goerli,
  zkSync,
  polygonZkEvm,
  zkSyncTestnet,
  optimismGoerli,
  optimism,
  polygonZkEvmTestnet,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  arbitrum,
  arbitrumGoerli,
  fantom,
  fantomTestnet,
  dfk,
  harmonyOne,
  celo,
  moonbeam,
  gnosis,
  klaytn,
  metis,
  metisGoerli,
  canto,
  moonriver,
  sepolia
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "react-query";

/* const aptos = {
  id: 2021,
  name: "Edgeware EdgeEVM Mainnet",
  network: "edgeware",
  nativeCurrency: {
      decimals: 18,
      name: "Edgeware",
      symbol: "EDG",
  },
  rpcUrls: {
      default: {
          http: ["https://edgeware-evm.jelliedowl.net"],
      },
      public: {
          http: ["https://edgeware-evm.jelliedowl.net"],
      },
  },
  blockExplorers: {
      etherscan: {
          name: "Edgscan by Bharathcoorg",
          url: "https://edgscan.live",
      },
      default: {
          name: "Edgscan by Bharathcoorg",
          url: "https://edgscan.live",
      },
  },
  contracts: {
      multicall3: {
          address: "0xDDF47eEB4e5FF4AA60e063E0Ec4f7C35B47Ed445",
          blockCreated: 17126780,
      },
  },
}; */

/* const fuse = {
  id: 122,
  name: "Fuse Mainnet",
  network: "fuse",
  nativeCurrency: {
      decimals: 18,
      name: "Fuse",
      symbol: "FUSE",
  },
  rpcUrls: {
      default: {
          http: ["https://rpc.fuse.io"],
      },
      public: {
          http: ["https://rpc.fuse.io"],
      },
  },
  blockExplorers: {
      etherscan: {
          name: "Fuse Explorer",
          url: "https://explorer.fuse.io/",
      },
      default: {
          name: "Fuse Explorer",
          url: "https://explorer.fuse.io/",
      },
  },
  contracts: {
      multicall3: {
          address: "0xDDF47eEB4e5FF4AA60e063E0Ec4f7C35B47Ed445", // CHANGE
          blockCreated: 17126780,
      },
  },
}; */

/* const core = {
  id: 1116,
  name: "Core Blockchain Mainnet",
  network: "core",
  nativeCurrency: {
      decimals: 18,
      name: "Core",
      symbol: "CORE",
  },
  rpcUrls: {
      default: {
          http: ["https://rpc.coredao.org"],
      },
      public: {
          http: ["https://rpc.coredao.org"],
      },
  },
  blockExplorers: {
      etherscan: {
          name: "Core Explorer",
          url: "https://scan.coredao.org/",
      },
      default: {
          name: "Core Explorer",
          url: "https://scan.coredao.org/",
      },
  },
  contracts: {
      multicall3: {
          address: "0xDDF47eEB4e5FF4AA60e063E0Ec4f7C35B47Ed445", // CHANGE
          blockCreated: 17126780,
      },
  },
}; */

const chains = [
  mainnet,
  goerli,
  zkSync,
  zkSyncTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  optimism,
  optimismGoerli,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  arbitrum,
  arbitrumGoerli,
  fantom,
  fantomTestnet,
  dfk,
  harmonyOne,
  celo,
  moonbeam,
  gnosis,
  klaytn,
  metis,
  metisGoerli,
  canto,
  moonriver,
  sepolia
];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
