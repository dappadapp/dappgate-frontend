"use client";

import React from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig, Chain } from "wagmi";
import {
  mainnet,
  goerli,
  zkSync,
  polygonZkEvm,
  zkSyncTestnet,
  optimismGoerli,
  optimism,
  polygonZkEvmTestnet,
  polygon,
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
  sepolia,
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

const dexalot = {
  id: 432204,
  name: "Dexalot Subnet",
  network: "dexalot",
  nativeCurrency: {
    decimals: 18,
    name: "Alot",
    symbol: "ALOT",
  },
  rpcUrls: {
    default: {
      http: ["https://subnets.avax.network/dexalot/mainnet/rpc"],
    },
    public: {
      http: ["https://subnets.avax.network/dexalot/mainnet/rpc"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Dexalot Explorer",
      url: "https://subnets.avax.network/dexalot",
    },
    default: {
      name: "Dexalot Explorer",
      url: "https://subnets.avax.network/dexalot",
    },
  },
} as const satisfies Chain;

const fuse = {
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
} as const satisfies Chain;

const core = {
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
} as const satisfies Chain;

const okx = {
  id: 66,
  name: "OKXChain Mainnet",
  network: "okx",
  nativeCurrency: {
    decimals: 18,
    name: "Okt",
    symbol: "OKT",
  },
  rpcUrls: {
    default: {
      http: ["https://exchainrpc.okex.org"],
    },
    public: {
      http: ["https://exchainrpc.okex.org"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "OKX Explorer",
      url: "https://www.okx.com/tr/explorer/oktc",
    },
    default: {
      name: "OKX Explorer",
      url: "https://www.okx.com/tr/explorer/oktc",
    },
  },
} as const satisfies Chain;

const tenet = {
  id: 1559,
  name: "Tenet",
  network: "tenet",
  nativeCurrency: {
    decimals: 18,
    name: "Tenet",
    symbol: "TENET",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.tenet.org"],
    },
    public: {
      http: ["https://rpc.tenet.org"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Tenet Explorer",
      url: "https://tenetscan.io/",
    },
    default: {
      name: "Tenet Explorer",
      url: "https://tenetscan.io/",
    },
  },
} as const satisfies Chain;

const arbNova = {
  id: 42170,
  name: "Arbitrum Nova",
  network: "nova",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://nova.arbitrum.io/rpc"],
    },
    public: {
      http: ["https://nova.arbitrum.io/rpc"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Arbitrum Nova Explorer",
      url: "https://nova.arbiscan.io/",
    },
    default: {
      name: "Arbitrum Nova Explorer",
      url: "https://nova.arbiscan.io/",
    },
  },
} as const satisfies Chain;

const meter = {
  id: 82,
  name: "Meter Mainnet",
  network: "meter",
  nativeCurrency: {
    decimals: 18,
    name: "Meter",
    symbol: "MTR",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.meter.io"],
    },
    public: {
      http: ["https://rpc.meter.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://scan.meter.io/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://scan.meter.io/",
    },
  },
} as const satisfies Chain;

const kava = {
  id: 2222,
  name: "Kava EVM",
  network: "kava",
  nativeCurrency: {
    decimals: 18,
    name: "Kava",
    symbol: "KAVA",
  },
  rpcUrls: {
    default: {
      http: ["https://evm2.kava.io"],
    },
    public: {
      http: ["https://evm2.kava.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://explorer.kava.io/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://explorer.kava.io/",
    },
  },
} as const satisfies Chain;

const chains = [
  mainnet,
  goerli,
  zkSync,
  zkSyncTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  optimism,
  optimismGoerli,
  polygon,
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
  sepolia,
  dexalot,
  fuse,
  core,
  okx,
  tenet,
  arbNova,
  meter,
  kava,
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
