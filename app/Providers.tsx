"use client";

import React from "react";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

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
  base,
  sepolia,
  scrollTestnet,
  mantle,
  opBNB,
  lineaTestnet,
  aurora,
  boba,
  telos,
  confluxESpace,
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

const klaytn_ = {
  ...klaytn,
  rpcUrls: {
    default: {
      http: ["https://public-node-api.klaytnapi.com/v1/cypress"],
    },
    public: {
      http: ["https://public-node-api.klaytnapi.com/v1/cypress"],
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

const linea = {
  id: 59144,
  name: "Linea",
  network: "linea",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.linea.build/"],
    },
    public: {
      http: ["https://rpc.linea.build/"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Meter Explorer",
      url: "https://lineascan.build/",
    },
    default: {
      name: "Meter Explorer",
      url: "https://lineascan.build/",
    },
  },
} as const satisfies Chain;

const loot = {
  id: 5151706,
  name: "Loot Chain",
  network: "loot",
  nativeCurrency: {
    decimals: 18,
    name: "Loot",
    symbol: "AGLD",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.lootchain.com/http"],
    },
    public: {
      http: ["https://rpc.lootchain.com/http"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Loot Explorer",
      url: "https://explorer.lootchain.com/",
    },
    default: {
      name: "Loot Explorer",
      url: "https://explorer.lootchain.com/",
    },
  },
} as const satisfies Chain;

const zora = {
  id: 7777777,
  name: "Zora Network",
  network: "zora",
  nativeCurrency: {
    decimals: 18,
    name: "Zora",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.zora.energy"],
    },
    public: {
      http: ["https://rpc.zora.energy"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Zora Explorer",
      url: "https://explorer.zora.energy/",
    },
    default: {
      name: "Zora Explorer",
      url: "https://explorer.zora.energy/",
    },
  },
} as const satisfies Chain;

const tomo = {
  id: 88,
  name: "TomoChain",
  network: "tomo",
  nativeCurrency: {
    decimals: 18,
    name: "TomoChain",
    symbol: "TOMO",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.tomochain.com"],
    },
    public: {
      http: ["https://tomo.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "TomoChain Explorer",
      url: "https://tomoscan.io/",
    },
    default: {
      name: "TomoChain Explorer",
      url: "https://tomoscan.io/",
    },
  },
} as const satisfies Chain;


const astar = {
  id: 592,
  name: "Astar EVM",
  network: "astar",
  nativeCurrency: {
    decimals: 18,
    name: "Astar",
    symbol: "ASTR",
  },
  rpcUrls: {
    default: {
      http: ["https://evm.astar.network"],
    },
    public: {
      http: ["https://evm.astar.network"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Astar Explorer",
      url: "https://blockscout.com/astar",
    },
    default: {
      name: "Astar Explorer",
      url: "https://blockscout.com/astar",
    },
  },
} as const satisfies Chain;

const scroll = {
  id: 534352,
  name: "Scroll",
  network: "scroll",
  nativeCurrency: {
    decimals: 18,
    name: "Scroll",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.scroll.io"],
    },
    public: {
      http: ["https://rpc.scroll.io"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Scroll Explorer",
      url: "https://blockscout.scroll.io/",
    },
    default: {
      name: "Scroll Explorer",
      url: "https://blockscout.scroll.io/",
    },
  },
} as const satisfies Chain;

const orderly = {
  id: 291,
  name: "Orderly",
  network: "orderly",
  nativeCurrency: {
    decimals: 18,
    name: "Orderly",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.orderly.network"],
    },
    public: {
      http: ["https://rpc.orderly.network"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Orderly Explorer",
      url: "https://explorer.orderly.network/",
    },
    default: {
      name: "Orderly Explorer",
      url: "https://explorer.orderly.network/",
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
  klaytn_,
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
  base,
  linea,
  mantle,
  scrollTestnet,
  loot,
  zora,
  tomo,
  opBNB,
  astar,
  lineaTestnet,
  aurora,
  scroll,
  telos,
  confluxESpace,
  orderly,
];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({ wagmiConfig, projectId, chains });

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
    </>
  );
}
