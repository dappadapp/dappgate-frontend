export interface Network {
    name: string;
    chainId: number;
    layerzeroChainId: number;
    nftContractAddress: string;
    tokenContractAddress: string;
    gasRefuelContractAddress?: string;
    relayerAddress?: string;
    blockConfirmation: number;
    colorClass: string;
    image: string;
    logIndex?: number;
    disabledNetworks?: number[];
    symbol?: string;
  }

  import {
    arbitrum,
    avalanche,
    bsc,
    canto,
    fantom,
    gnosis,
    goerli,
    harmonyOne,
    klaytn,
    mainnet,
    metis,
    moonbeam,
    moonriver,
    optimism,
    optimismGoerli,
    polygon,
    polygonZkEvm,
    zkSync,
  } from "wagmi/chains";

export const networks: Network[] = [
    {
      name: mainnet.name,
      chainId: mainnet.id,
      layerzeroChainId: 101,
      nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
      tokenContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
      gasRefuelContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
      relayerAddress: "0x902F09715B6303d4173037652FA7377e5b98089E",
      blockConfirmation: 1,
      colorClass: '#777777',
      image: "ethereum.svg",
      disabledNetworks: [],
      symbol: "ETH",
    },
    {
      name: bsc.name,
      chainId: bsc.id,
      layerzeroChainId: 102,
      nftContractAddress: "0x34b9d8B0B52F827c0f6657183ef88E6e0EefF54c",
      tokenContractAddress: "0xdea2895F965BD71EC0899ba0B20581f2FcC40A3C",
      relayerAddress: "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182",
      blockConfirmation: 1,
      colorClass: "bg-[#E8B30B]",
      image: "bsc.svg",
      disabledNetworks: [122, 8217],
      symbol: "BNB",
    },
    {
      name: avalanche.name,
      chainId: avalanche.id,
      layerzeroChainId: 106,
      nftContractAddress: "0x9CBF2D3955CA59E471546C04FAF552De435E89B1",
      tokenContractAddress: "0x6c4495b2eD95Ad3A2050aad60D410fA9782F08cA",
      relayerAddress: "0xCD2E3622d483C7Dc855F72e5eafAdCD577ac78B4",
      blockConfirmation: 1,
      colorClass: "bg-[#E84142]",
      image: "avalanche.svg",
      disabledNetworks: [1116],
      symbol: "AVAX",
    },
    /*   {
          name: "Aptos",
          chainId: 108,
          layerzeroChainId: 10109,
          nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
          blockConfirmation: 1,
          colorClass: "bg-[#E8B30B]"
        }, */
    {
      name: polygon.name,
      chainId: polygon.id,
      layerzeroChainId: 109,
      nftContractAddress: "0x9F810ccdfBe675Dd8aD62e5107726078286b3178",
      tokenContractAddress: "0x9e01792EbE32909AA9B569bA542A932BFb3D4031",
      relayerAddress: "0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f",
      blockConfirmation: 1,
      colorClass: "bg-[#7F43DF]",
      image: "polygon.svg",
      logIndex: 2,
      disabledNetworks: [8217],
      symbol: "MATIC",
    },
    {
      name: arbitrum.name,
      chainId: arbitrum.id,
      layerzeroChainId: 110,
      nftContractAddress: "0x7554C507Ac1F7B0E09a631Bc929fFd3F7a492b01",
      tokenContractAddress: "0xA6964d554f5A3a1DD2f8a2bab9853Bdb883eFA32",
      relayerAddress: "0x177d36dBE2271A4DdB2Ad8304d82628eb921d790",
      blockConfirmation: 1,
      colorClass: "bg-[#12AAFF]",
      image: "arbitrum.svg",
      disabledNetworks: [122, 1116, 8217],
      symbol: "ETH",
    },
    {
      name: optimism.name,
      chainId: optimism.id,
      layerzeroChainId: 111,
      nftContractAddress: "0xd37f0A54956401e082Ec3307f2829f404E3C1AB4",
      tokenContractAddress: "0xFC340113B34056669924da8c6a22f3D9b78A3bCa",
      relayerAddress: "0x81E792e5a9003CC1C8BF5569A00f34b65d75b017",
      blockConfirmation: 1,
      colorClass: "bg-[#FF0420]",
      image: "optimism.svg",
      disabledNetworks: [66, 122, 1116, 8217],
      symbol: "ETH",
    },
    {
      name: fantom.name,
      chainId: fantom.id,
      layerzeroChainId: 112,
      nftContractAddress: "0xAcb168F30855c5C87D38a91818f8961C4046Da12",
      tokenContractAddress: "0x6B0B71E1786345818f79921522baC1fb546cc09d",
      relayerAddress: "0x52EEA5c490fB89c7A0084B32FEAB854eefF07c82",
      blockConfirmation: 1,
      colorClass: "bg-[#196aff]",
      image: "fantom.svg",
      disabledNetworks: [66, 122, 1116, 8217],
      symbol: "FTM",
    },
    /*   {
        name: dfk.name,
        chainId: dfk.id,
        layerzeroChainId: 115,
        nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
        blockConfirmation: 1,
        colorClass: "bg-[#81bb04]",
        image: "dfk.svg",
      }, */
    {
      name: harmonyOne.name,
      chainId: harmonyOne.id,
      layerzeroChainId: 116,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x3acE23E0EA29790855e55Bfb81da3B85D49469D5",
      relayerAddress: "0x7cbd185f21bef4d87310d0171ad5f740bc240e26",
      blockConfirmation: 1,
      colorClass: "bg-[#41dccc]",
      image: "harmony.svg",
      disabledNetworks: [
        66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
        42170,
      ],
      symbol: "ONE",
    },
    /*   {
        name: "Dexalot",
        chainId: 432204,
        layerzeroChainId: 118,
        nftContractAddress: "0x119084e783FdCc8Cc11922631dBcc18E55DD42eB",
        blockConfirmation: 1,
        colorClass: "bg-[#E51981]",
        image: "dexalot.svg",
      }, */
    /* {
        name: celo.name,
        chainId: celo.id,
        layerzeroChainId: 125,
        nftContractAddress: "0xD80F5AA411Ab5b84973b8866F615a4eC0244B8D9",
        blockConfirmation: 1,
        colorClass: "bg-[#36d07e]",
        image: "celo.svg",
      }, */
    {
      name: moonbeam.name,
      chainId: moonbeam.id,
      layerzeroChainId: 126,
      nftContractAddress: "0x7554C507Ac1F7B0E09a631Bc929fFd3F7a492b01",
      tokenContractAddress: "0x9d3d5f9B419544e137443119aced184E50561FDA",
      relayerAddress: "0xccCDD23E11F3f47C37fC0a7C3BE505901912C6Cc",
      blockConfirmation: 1,
      colorClass: "bg-[#1fcceb]",
      image: "moonbeam.svg",
      disabledNetworks: [
        66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
        42170,
      ],
      symbol: "GLMR",
    },
    {
      name: "Fuse",
      chainId: 122,
      layerzeroChainId: 138,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0xBddc99fCFc76c3433F448F15B327b46eC7A6CC4d",
      relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
      blockConfirmation: 1,
      colorClass: "bg-[#a9f7b0]",
      image: "fuse.svg",
      disabledNetworks: [
        10, 56, 128566, 82, 324, 1101, 1116, 1285, 1559, 2222, 42161, 42170,
        1666600000,
      ],
      symbol: "FUSE",
    },
    {
      name: gnosis.name,
      chainId: gnosis.id,
      layerzeroChainId: 145,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x74f57E1171a0360670AED3b3DbC3a997Fb493d16",
      relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
      blockConfirmation: 1,
      colorClass: "bg-[#57ac86]",
      image: "gnosis.svg",
      disabledNetworks: [66, 82, 324, 1116, 1285, 1559, 2222, 1666600000],
      symbol: "GNO",
    },
    {
      name: klaytn.name,
      chainId: klaytn.id,
      layerzeroChainId: 150,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      gasRefuelContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      relayerAddress: "0x5b19bd330a84c049b62d5b0fc2ba120217a18c1c",
      blockConfirmation: 1,
      colorClass: "bg-[#f82e08]",
      image: "klaytn.svg",
      disabledNetworks: [
        10, 56, 66, 82, 137, 324, 1101, 1116, 1285, 1559, 2222, 7700, 42161,
        42170, 1666600000,
      ],
      symbol: "KLAY",
    },
    {
      name: metis.name,
      chainId: metis.id,
      layerzeroChainId: 151,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0xb13044854014131565a6A7E46dc24a0e3e9D163C",
      relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
      blockConfirmation: 1,
      colorClass: "bg-[#00CDB7]",
      image: "metis.svg",
      disabledNetworks: [66, 324, 1101, 1116, 1666600000],
      symbol: "METIS",
    },
    {
      name: "CoreDAO",
      chainId: 1116,
      layerzeroChainId: 153,
      nftContractAddress: "0xD80F5AA411Ab5b84973b8866F615a4eC0244B8D9",
      tokenContractAddress: "0xBddc99fCFc76c3433F448F15B327b46eC7A6CC4d",
      relayerAddress: "0xfe7c30860d01e28371d40434806f4a8fcdd3a098",
      blockConfirmation: 1,
      colorClass: "bg-[#FDBE08]",
      image: "coredao.svg",
      disabledNetworks: [
        10, 66, 82, 100, 122, 324, 1088, 1116, 1285, 1559, 2222, 7700, 8217,
        42161, 42170, 43114, 1666600000,
      ],
      symbol: "CORE",
    },
    {
      name: "OKT (OKX)",
      chainId: 66,
      layerzeroChainId: 155,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0xC86Bb3231B641064459295ecC861db7CFe4a73DD",
      relayerAddress: "0xfe7c30860d01e28371d40434806f4a8fcdd3a098",
      blockConfirmation: 1,
      colorClass: "bg-[#000000]",
      image: "okex.svg",
      disabledNetworks: [
        10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700, 8217,
        42170, 1666600000,
      ],
      symbol: "OKT",
    },
    {
      name: polygonZkEvm.name,
      chainId: polygonZkEvm.id,
      layerzeroChainId: 158,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0xDDF5882761b35B6B29CBe177E7Ff874AE367465e",
      relayerAddress: "0xa658742d33ebd2ce2f0bdff73515aa797fd161d9",
      blockConfirmation: 1,
      colorClass: "bg-[#7939D5]",
      image: "polygon-zkevm.svg",
      disabledNetworks: [
        66, 82, 122, 1116, 1285, 1559, 7700, 8217, 42170, 1666600000,
      ],
      symbol: "MATIC",
    },
    {
      name: canto.name,
      chainId: canto.id,
      layerzeroChainId: 159,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      gasRefuelContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      relayerAddress: "0x5b19bd330a84c049b62d5b0fc2ba120217a18c1c",
      blockConfirmation: 1,
      colorClass: "bg-[#34EEA4]",
      image: "canto.svg",
      disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
      symbol: "CANTO",
    },
    {
      name: zkSync.name,
      chainId: zkSync.id,
      layerzeroChainId: 165,
      nftContractAddress: "0x65020a18bbC5e535601423972b1C28eAc79a09F6",
      tokenContractAddress: "0x2eB64561cAC289D3d165e1F3B8ddC6A2DFDb901D",
      relayerAddress: "0x9923573104957bf457a3c4df0e21c8b389dd43df",
      blockConfirmation: 1,
      colorClass: "bg-[#8C8DFC]",
      image: "zksync-era.svg",
      logIndex: 3,
      disabledNetworks: [66, 100, 122, 1088, 1116, 1285, 2222, 8217, 1666600000],
      symbol: "ETH",
    },
    {
      name: moonriver.name,
      chainId: moonriver.id,
      layerzeroChainId: 167,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x74f57E1171a0360670AED3b3DbC3a997Fb493d16",
      relayerAddress: "0xe9ae261d3aff7d3fccf38fa2d612dd3897e07b2d",
      blockConfirmation: 1,
      colorClass: "bg-[#E6AE05]",
      image: "moonriver.svg",
      disabledNetworks: [
        66, 82, 100, 122, 324, 1101, 1116, 1559, 7700, 8217, 42170, 1666600000,
      ],
      symbol: "MOVR",
    },
    {
      name: "Tenet",
      chainId: 1559,
      layerzeroChainId: 173,
      nftContractAddress: "0x9954f0B7a7589f6D10a1C40C8bE5c2A81950FB46",
      tokenContractAddress: "0xA0798bD2a38debCd2A41c4dCf42D92450E781611",
      relayerAddress: "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4",
      blockConfirmation: 1,
      colorClass: "bg-[#F2F2F2]",
      image: "tenet.svg",
      disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
      symbol: "TENET",
    },
    {
      name: "Arbitrum Nova",
      chainId: 42170,
      layerzeroChainId: 175,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0x818529140C65Ad9152bcE5d87fF42632820CEBFB",
      relayerAddress: "0xa658742d33ebd2ce2f0bdff73515aa797fd161d9",
      blockConfirmation: 1,
      colorClass: "bg-[#E37B1E]",
      image: "arb-nova.svg",
      disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
      symbol: "ETH",
    },
    {
      name: "Meter.io",
      chainId: 82,
      layerzeroChainId: 176,
      nftContractAddress: "0x1A21779466dA680f872Eb58a10208b42D6d75508",
      tokenContractAddress: "0xF80d846B80CEdF4d09A04D62290bE41154beEEAc",
      relayerAddress: "0x442b4bef4d1df08ebbff119538318e21b3c61eb9",
      blockConfirmation: 1,
      colorClass: "bg-[#1C2A59]",
      image: "meter.svg",
      disabledNetworks: [66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000],
      symbol: "MTRG",
    },
    {
      name: "Kava",
      chainId: 2222,
      layerzeroChainId: 177,
      nftContractAddress: "0x93E5f549327baB41a1e33daEBF27dF27502CC818",
      tokenContractAddress: "0xb13044854014131565a6A7E46dc24a0e3e9D163C",
      blockConfirmation: 1,
      colorClass: "bg-[#F2524B]",
      image: "kava.svg",
      disabledNetworks: [
        66, 82, 100, 122, 324, 1116, 1559, 7700, 8217, 42170, 1666600000,
      ],
      symbol: "KAVA",
    },
    {
      name: goerli.name,
      chainId: goerli.id,
      layerzeroChainId: 10121,
      nftContractAddress: "0x3BC0D972ed2cC430D1a2d3dBe9bAE8CF18eF58aa",
      tokenContractAddress: "0x86D29f91CA34A02b63128845a36c8484543133EB",
      blockConfirmation: 2,
      colorClass: "bg-[#373737]",
      image: "ethereum.svg",
      symbol: "ETH",
    },
    {
      name: optimismGoerli.name,
      chainId: optimismGoerli.id,
      layerzeroChainId: 10132,
      nftContractAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
      tokenContractAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
      gasRefuelContractAddress: "0x3817CeA0d6979a8f11Af600d5820333536f1B520",
      blockConfirmation: 1,
      colorClass: "bg-[#FF0420]",
      image: "ethereum-opt.svg",
      symbol: "ETH",
    },
  ];