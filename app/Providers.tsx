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
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "react-query";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const chains = [mainnet, goerli, zkSync, zkSyncTestnet, polygonZkEvm];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

const queryClient = new QueryClient();

export default function Providers({
  cookies,
  children,
}: {
  cookies: RequestCookie[];
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
