import {
  mainnet,
  arbitrum,
  avalanche,
  bsc,
  canto,
  fantom,
  gnosis,
  goerli,
  harmonyOne,
  klaytn,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
  polygonMumbai,
  scrollTestnet,
  zkSync,
  sepolia,
  polygonZkEvm,
  opBNB,
  lineaTestnet,
  aurora,
} from "wagmi/chains";

export interface Network {
  name: string;
  chainId: number;
  layerzeroChainId: number;
  nftContractAddress: string;
  tokenContractAddress: string;
  messageContractAddress?: string;
  gasRefuelContractAddress?: string;
  setOFTContractAddress?: string;
  zkNFTContractAddress?: string;
  relayerAddress?: string;
  blockConfirmation: number;
  colorClass: string;
  image: string;
  logIndex?: number;
  disabledNetworks: number[];
  symbol?: string;
  chainName?: string;
  isTestnet?: boolean;
  isAvailable?: boolean;

}


export const networks: Network[] = [
  {
    name: bsc.name,
    chainId: bsc.id,
    layerzeroChainId: 102,
    nftContractAddress: "0xF3C948662CCA02529F3708feDaaCd527b7a273DB",
    tokenContractAddress: "0x68363b856C91357cBfD148ABd6960870C6e95C01",
    relayerAddress: "0xA27A2cA24DD28Ce14Fb5f5844b59851F03DCf182",
    messageContractAddress: "0x2860c3294b8509a897c6a18D0C02f59Cf2e7D0a7",
    gasRefuelContractAddress: "0xE429E2b18EABDB0B3Faa847fbB46Ff5DE8b59B45",
    setOFTContractAddress: "0x4C5205Bef41AED14CcB96dcb2E49EFdfe0b4ed7A",
    zkNFTContractAddress: "0xe6eDCE2cB7c6b8234598f870265ad2bE6d15e801",
    blockConfirmation: 5,
    colorClass: "bg-[#E8B30B]",
    image: "bsc.svg",
    disabledNetworks: [5, 420, 122, 8217, 80001,  5,80001,534353, 11155111],
    symbol: "BNB",
    chainName: "bsc-mainnet",
  },
  {
    name: avalanche.name,
    chainId: avalanche.id,
    layerzeroChainId: 106,
    nftContractAddress: "0x52bA2A207D2A3DBed14030ca6CAd7E32a270b2C5",
    tokenContractAddress: "0xa1F978b8f55662583Bb90dB1c8BA3CCdE697D127",
    relayerAddress: "0xCD2E3622d483C7Dc855F72e5eafAdCD577ac78B4",
    messageContractAddress: "0x87D12bd544f0bC6BF9837Fbb7BA793fc8889B262",
    gasRefuelContractAddress: "0xB768D455E9aCe7b9C40AE366C7964a738E95F9E2",
    setOFTContractAddress: "0x32fF95c4E776D783d34e338a59C1E345Ae73B08c",
    zkNFTContractAddress: "0x9Ea24F54Be593d37e8CF5fb5b5d617147d076BB4",
    blockConfirmation: 5,
    colorClass: "bg-[#E84142]",
    image: "avalanche.svg",
    disabledNetworks: [5, 420, 1116, 80001,  5,80001,534353, 11155111],
    symbol: "AVAX",
    chainName: "avalanche-mainnet",
  },

  {
    name: mainnet.name,
    chainId: mainnet.id,
    layerzeroChainId: 101,
    nftContractAddress: "0xB66CAeA47F6837b5A6c8903d9c4adD6ee364Ce88",
    tokenContractAddress: "",
    gasRefuelContractAddress: "",
    relayerAddress: "0x902F09715B6303d4173037652FA7377e5b98089E",
    blockConfirmation: 1,
    colorClass: 'bg-[#777777]',
    image: "ethereum.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1116, 1285, 1559, 2222, 7700,
      8217, 42161, 42170, 43114, 1666600000, 80001, 5,80001,534353, 11155111,
      1666600000, 1284, 122, 100, 8217, 1116, 66, 7700, 324, 1285, 1559, 42170,
      82, 42220
    ],
    symbol: "ETH",
  },

  {
    name: "Astar",
    chainId: 592,
    layerzeroChainId: 210,
    nftContractAddress: "0x07231C3464eA825bf9490f4C673723E63ebD95F7",
    tokenContractAddress: "0xFD92930CA50ab900171643a8a47BC57d760a5d95",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    messageContractAddress:"",
    gasRefuelContractAddress: "0xc67505DEaA9C0c08B9bcf2F55476C66b77e0c82f",
    setOFTContractAddress: "0x87225C02F104a353d7dA0708907Ec18d1e74ce27",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#2967FF]",
    image: "astar.svg",
    disabledNetworks: [
      1666600000, 1284, 122, 100, 8217, 1116, 66, 7700, 324, 1285, 1559, 42170,
      82, 80001, 5,534353, 11155111
    ],
    symbol: "ASTR",
    chainName: "astar-mainnet",
  },

  {
    name: "Aurora",
    chainId: aurora.id,
    layerzeroChainId: 211,
    nftContractAddress: "0x07231C3464eA825bf9490f4C673723E63ebD95F7",
    tokenContractAddress: "0xc67505DEaA9C0c08B9bcf2F55476C66b77e0c82f",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    messageContractAddress:"",
    gasRefuelContractAddress: "0xFD92930CA50ab900171643a8a47BC57d760a5d95",
    setOFTContractAddress: "0x87225C02F104a353d7dA0708907Ec18d1e74ce27",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#2967FF]",
    image: "aurora.svg",
    disabledNetworks: [
      1666600000, 1284, 122, 100, 8217, 1116, 66, 7700, 324, 1285, 1559, 42170,
      82, 80001, 5,534353, 11155111
    ],
    symbol: "ETH",
    chainName: "aurora-mainnet",
  },

  
  
  {
    name: zkSync.name,
    chainId: zkSync.id,
    layerzeroChainId: 165,
    nftContractAddress: "0x5EF03134973b827a35D7f057B42F687D014e182d",
    tokenContractAddress: "0xAc1E37980A160B1fF3D7AFAB54CFaB90577c9bCD",
    relayerAddress: "0x9923573104957bF457a3C4DF0e21c8b389Dd43df",
    messageContractAddress:"0x856DA67bfCD0669624bFAAFc3b728FC870c70305",
    gasRefuelContractAddress: "0xf3943238980E14f38AAE909e8910AC71819390dc",
    setOFTContractAddress: "0xe06cef4c0eedc65D4ffE1587E8c08b27d9eC8602",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#8C8DFC]",
    image: "zksync-era.svg",
    logIndex: 3,
    disabledNetworks: [
      5, 420, 66, 100, 122, 1088, 1116, 1285, 2222, 8217, 1666600000, 80001,
      1101, 80001,534353, 11155111, 7777777, 5151706
    ],
    symbol: "ETH",
    chainName: undefined,
  },

  {
    name: "Base",
    chainId: 8453,
    layerzeroChainId: 184,
    nftContractAddress: "0x18c78a0B1fD00084C83E5B4365cdDee1e6cDba84",
    tokenContractAddress: "0xbaa198F5eC7cc289ceE58510Ab8842C4B939D5F5",
    relayerAddress: "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa",
    messageContractAddress:"0xe828C7e9Cce86b22fb1ad4Ac35F4Ec856f0Cef32",
    gasRefuelContractAddress: "0x55E4DE637dAB6a5A98bC643ED3918B35AA20407E",
    setOFTContractAddress: "0xEab5C72E2246415fAf0FBbf75Ac6ea96661552a5",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#2967FF]",
    image: "base.svg",
    disabledNetworks: [
      1666600000, 1284, 122, 100, 8217, 1116, 66, 7700, 324, 1285, 1559, 42170,
      82, 80001, 5,534353, 11155111
    ],
    symbol: "ETH",
    chainName: "base-mainnet",
  },

  {
    name: "Linea",
    chainId: 59144,
    layerzeroChainId: 183,
    nftContractAddress: "0x673f8009ad54945365be1f6394e3f016fdb4135d",
    tokenContractAddress: "0x36e48a4c1465DBDD493a5220610F706EECBE54FC",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9", // not available in layer zero
    messageContractAddress:"0x2a0984Ac92Fb1872EF5739E163fBdaDcb0968381",
    gasRefuelContractAddress: "0xC2Ed142A428Ae7D551fcD260318Db85e9f4FFBA5",
    setOFTContractAddress: "0x72A769b01D3f950f226978A5A85b2204C762bf57",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#1B1B1D]",
    image: "linea.svg",
    disabledNetworks: [
      66, 82, 100, 122, 324, 1116, 1284, 1285, 1559, 7700, 8217, 42170,
      1666600000,  5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: undefined, // TODO: CHANGE TO linea-mainnet
  },

  {
    name: opBNB.name,
    chainId: opBNB.id,
    layerzeroChainId: 202,
    nftContractAddress: "0xBD0160892A6057D99738718fc6372E7219dD7372",
    tokenContractAddress: "0x87225C02F104a353d7dA0708907Ec18d1e74ce27",
    relayerAddress: "0x3a73033c0b1407574c76bdbac67f126f6b4a9aa9",
    messageContractAddress: "",
    gasRefuelContractAddress: "0x2C8b33d3801ceF814a542ebC2420a906D61C5278",
    setOFTContractAddress: "0xEf7E9A3e3AC8A077B34C20cbdDA1866BDBb883e0",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#FF0000]",
    image: "opbnb.svg",
    disabledNetworks: [5, 420, 122, 8217, 80001,  5,80001,534353, 11155111],
    symbol: "BNB",
    chainName: "bsc-mainnet",
  },

 
 
  {
    name: polygonZkEvm.name,
    chainId: polygonZkEvm.id,
    layerzeroChainId: 158,
    nftContractAddress: "0xF077EA48783ffcc67C88206e05E21733Cf101755", // TODO: UPDATE WHEN NEW CONTRACTS COME
    tokenContractAddress: "0x3e9d679506F890390Cc390db8bD23b0e8406d2D8",
    relayerAddress: "0xa658742d33ebd2ce2f0bdff73515aa797fd161d9",
    messageContractAddress: "0xf9cc44c9d4af941e270d943db011a1217303f8fc",
    gasRefuelContractAddress: "0x5D7b86102BCE75C02ed0bbcc80211056f79D7507",
    setOFTContractAddress: "0xcf8bcaCb401C31774EA39296b367B9DaB4F72267",
    zkNFTContractAddress: undefined,
    blockConfirmation: 1,
    colorClass: "bg-[#7939D5]",
    image: "polygon-zkevm.svg",
    disabledNetworks: [
      5, 420, 66, 82, 122, 1116, 1285, 1559, 7700, 8217, 42170, 1666600000,
      80001, 324, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: "polygon-zkevm-mainnet",
  }, 

  {
    name: "Mantle",
    chainId: 5000,
    layerzeroChainId: 181,
    nftContractAddress: "0xe7637699bd894427a3d0F16c6a4cBC1FeA1fA8ec",
    tokenContractAddress: "0x53751403382B4d7dC18d745899Fc2687F0593070",
    relayerAddress: "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa", // not available in layer zero
    messageContractAddress: "0xe828C7e9Cce86b22fb1ad4Ac35F4Ec856f0Cef32",
    gasRefuelContractAddress: "0xAd778F6645548627eE9161dF7bfA55cdC94De544",
    setOFTContractAddress: "0x3ba884E08DC1ebCd86Bd48a2B21590dad9159401",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#1B1B1D]",
    image: "mantle.svg",
    disabledNetworks: [
      1666600000, 1284, 122, 100, 8217, 1116, 66, 7700, 324, 1285, 1559, 42170,
      82, 80001, 5,80001,534353, 11155111
    ],
    symbol: "MNT",
    chainName: "mantle-mainnet",
  },

  {
    name: "Arbitrum Nova",
    chainId: 42170,
    layerzeroChainId: 175,
    nftContractAddress: "0xc84388999DCc40631904b1CBDC9FA27dc96fB5F4",
    tokenContractAddress: "0x3922de582d630c221aebb2297d86e66bded1e8d0",
    relayerAddress: "0xa658742d33ebd2ce2f0bdff73515aa797fd161d9",
    messageContractAddress: "0xe90dA829FAe567BC23bc4cBdCE58B67293a930B9",
    gasRefuelContractAddress: "0x8E31C5476a66bb1C0a417c14D87A723f86133E10",
    setOFTContractAddress: "0x049B33db89E6a0D89E5B8E4210dBEcCD892cD491",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#E37B1E]",
    image: "arb-nova.svg",
    disabledNetworks: [
      5, 420, 66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: "arbitrum-nova-mainnet",
  },
  {
    name: "Celo",
    chainId: 42220,
    layerzeroChainId: 125,
    nftContractAddress: "0x6C2f11686B4706c29337d1c0Bbbe819A3e6dFA56",
    tokenContractAddress: "0x6a396A76EdB76d4d2E8a05d33fe4364a3942ab1e",
    relayerAddress: "0x15e51701f245f6d5bd0fee87bcaf55b0841451b3",
    messageContractAddress: "0x46D8980ff891b96a095d2F4cC2878F5d2d1a07Fd",
    gasRefuelContractAddress: "0x6eC3f5dE9ccEd1352aF013A4f076e1da9856d834",
    setOFTContractAddress: "0x3e217138284A414Bec9f93bdE915Ff7C6aEA0677",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#FBCC5C]",
    image: "celo.svg",
    disabledNetworks: [
      5, 420, 66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000, 80001, 5,80001,534353, 11155111
    ], // TODO: UPDATE
    symbol: "CELO",
    chainName: "celo-mainnet",
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
    name: gnosis.name,
    chainId: gnosis.id,
    layerzeroChainId: 145,
    nftContractAddress: "0xF3C948662CCA02529F3708feDaaCd527b7a273DB",
    tokenContractAddress: "0xa966099ba4a2f7c5f509aba21352f3a622051025",
    relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
    messageContractAddress: "0x2860c3294b8509a897c6a18D0C02f59Cf2e7D0a7",
    gasRefuelContractAddress: "0x69dAEc0B57D825e2167ff2f06DEf4e0d9084F4d1",
    setOFTContractAddress: "0x32fF95c4E776D783d34e338a59C1E345Ae73B08c",
    zkNFTContractAddress: "0xf11F67e9e019C6bEc24E3f51f5153dEBe7d2c93C",
    blockConfirmation: 5,
    colorClass: "bg-[#57ac86]",
    image: "gnosis.svg",
    disabledNetworks: [
      5, 420, 66, 82, 324, 1116, 1285, 1559, 2222, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "xDAI",
    chainName: undefined,
  },
  {
    name: "Fuse",
    chainId: 122,
    layerzeroChainId: 138,
    nftContractAddress: "0xAcAB363d0dE028BF4aAfB7c1079b3a0A3afFb65b",
    tokenContractAddress: "0xC7762765834bAbf549a148708a081a748811a3De",
    relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
    messageContractAddress: "0x29CF813EdA1a6844FfBFB832884a5cbE872dcC53",
    gasRefuelContractAddress: "0xC3A2180C9d9a353BcD7479b350982217e772D74C",
    setOFTContractAddress: "0x8b6cc14dd1cb69A33284330CD6aa3FF3EA6c1Cc3",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#a9f7b0]",
    image: "fuse.svg",
    disabledNetworks: [
      5, 420, 10, 56, 128566, 82, 324, 1101, 1116, 1285, 1559, 2222, 42161, 5,80001,534353, 11155111,
      42170, 1666600000, 80001,
    ],
    symbol: "FUSE",
    chainName: "fuse-mainnet",
  },
  {
    name: klaytn.name,
    chainId: klaytn.id,
    layerzeroChainId: 150,
    nftContractAddress: "0x0386dA88F4A06E0E1B75BC0B6b3c07B5ac39A393",
    tokenContractAddress: "0x6a396A76EdB76d4d2E8a05d33fe4364a3942ab1e",
    relayerAddress: "0x5b19bd330a84c049b62d5b0fc2ba120217a18c1c",
    messageContractAddress: "0xFA5c14fEc197aebA5f0B4B7F9bC2A35D3d47765e",
    gasRefuelContractAddress: "0x43F077B4072D63C3E9b2464148451e9147d5121f",
    setOFTContractAddress: "0x991ECC3dE1EA642501630B287c35c76496A1D066",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#f82e08]",
    image: "klaytn.svg",
    disabledNetworks: [
      5, 420, 10, 56, 66, 82, 137, 324, 1101, 1116, 1285, 1559, 2222, 7700,
      42161, 42170, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "KLAY",
    chainName: "klaytn-mainnet",
  },
  {
    name: metis.name,
    chainId: metis.id,
    layerzeroChainId: 151,
    nftContractAddress: "0x856Fe1ecD129535aa318E01aCd3f2a6BF2183184",
    tokenContractAddress: "0xf66C895e4a573f4418E357A1cC4fd28d3d9c3D4E",
    relayerAddress: "0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C",
    messageContractAddress: "0x3D0D93B4241F94Da7485a7a6D0EB53C9253f8466",
    gasRefuelContractAddress: "0x54B3E1d3256081046dafe11122A3826B76f2a525",
    setOFTContractAddress: "0x8b6cc14dd1cb69A33284330CD6aa3FF3EA6c1Cc3",
    zkNFTContractAddress: "0x32fF95c4E776D783d34e338a59C1E345Ae73B08c",
    blockConfirmation: 5,
    colorClass: "bg-[#00CDB7]",
    image: "metis.svg",
    disabledNetworks: [5, 420, 66, 324, 1101, 1116, 1666600000, 80001, 5,80001,534353, 11155111],
    symbol: "METIS",
    chainName: "metis-mainnet",
  },
  {
    name: "CoreDAO",
    chainId: 1116,
    layerzeroChainId: 153,
    nftContractAddress: "0x5A99774307336E3e0041145E078b73b0B2265d3D",
    tokenContractAddress: "0xE429E2b18EABDB0B3Faa847fbB46Ff5DE8b59B45",
    relayerAddress: "0xfe7c30860d01e28371d40434806f4a8fcdd3a098",
    messageContractAddress: "0x853e11eCa2f114B7C9753C69A40352cFD48F99eF",
    gasRefuelContractAddress: "0xf773851dcDd2197305621fA6EFe0d4A9E14D4F2c",
    setOFTContractAddress: "0x0778233bA417948A1e60D0A1BF9D27bE20Eb09b1",
    zkNFTContractAddress: "0x57640B009746eDd68054E0A9b3301a3aA3A2a8eF",
    blockConfirmation: 5,
    colorClass: "bg-[#FDBE08]",
    image: "coredao.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1116, 1285, 1559, 2222, 7700,
      8217, 42161, 42170, 43114, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "CORE",
    chainName: undefined,
  },
  {
    name: canto.name,
    chainId: canto.id,
    layerzeroChainId: 159,
    nftContractAddress: "0x5A99774307336E3e0041145E078b73b0B2265d3D",
    tokenContractAddress: "0x9e1b605E808970a7a6a66003Ac221291722fB8d9",
    relayerAddress: "0x5b19bd330a84c049b62d5b0fc2ba120217a18c1c",
    messageContractAddress: "0xA3dA3205A1FBdd6aa93a04e165014D39926d0d56",
    gasRefuelContractAddress: "0x9b57378504dCc215c9063BbCeb19eEe2379B8613",
    setOFTContractAddress: "0x285fADdEf342F67fe8cE1EB73999385581427D49",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#34EEA4]",
    image: "canto.svg",
    disabledNetworks: [
      5, 420, 66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "CANTO",
    chainName: "canto-mainnet",
  },
  {
    name: moonbeam.name,
    chainId: moonbeam.id,
    layerzeroChainId: 126,
    nftContractAddress: "0xb922d6C5d3E5Be60C694c6b47E3807d794A2C4D3",
    tokenContractAddress: "0x942549E43dE9145D453BA3a14e45ab886aEa0595",
    relayerAddress: "0xccCDD23E11F3f47C37fC0a7C3BE505901912C6Cc",
    messageContractAddress: "0x5386D4Ff943acfDa3804d86e5d5406E76027254b",
    gasRefuelContractAddress: "0x5A99774307336E3e0041145E078b73b0B2265d3D",
    setOFTContractAddress: "0x69dAEc0B57D825e2167ff2f06DEf4e0d9084F4d1",
    zkNFTContractAddress: "0xed2BA0256B8A702019Ce953a32286B5d7393Dc3d",
    blockConfirmation: 5,
    colorClass: "bg-[#1fcceb]",
    image: "moonbeam.svg",
    disabledNetworks: [
      5, 420, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700,
      8217, 42170, 80001, 5,80001,534353, 11155111
    ],
    symbol: "GLMR",
    chainName: "moonbeam-mainnet",
  },
  {
    name: moonriver.name,
    chainId: moonriver.id,
    layerzeroChainId: 167,
    nftContractAddress: "0x5A99774307336E3e0041145E078b73b0B2265d3D",
    tokenContractAddress: "0x2EbB25FDeF5e04bc61C5BDB8F16bE9a9BB2adB87",
    relayerAddress: "0xe9ae261d3aff7d3fccf38fa2d612dd3897e07b2d",
    messageContractAddress: "0x3E01448509854E6e777510139281f087C780E8A6",
    gasRefuelContractAddress: "0xa48Aa414c56c49ef27919968568E3Bf8CfFfcc2e",
    setOFTContractAddress: "0x13f470BfDd7402A43873Cd1f9c4D50DBB18BEf6f",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#E6AE05]",
    image: "moonriver.svg",
    disabledNetworks: [
      5, 420, 66, 82, 100, 122, 324, 1101, 1116, 1559, 7700, 8217, 42170,
      1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "MOVR",
    chainName: "moonriver-mainnet",
  },
  {
    name: "Tenet",
    chainId: 1559,
    layerzeroChainId: 173,
    nftContractAddress: "0xe7637699bd894427a3d0F16c6a4cBC1FeA1fA8ec",
    tokenContractAddress: "0x049B33db89E6a0D89E5B8E4210dBEcCD892cD491",
    relayerAddress: "0xAaB5A48CFC03Efa9cC34A2C1aAcCCB84b4b770e4",
    messageContractAddress: "0x5A832769cb525d8E2E60a93106DEFe57cbA3407a",
    gasRefuelContractAddress: "0x3e9d679506F890390Cc390db8bD23b0e8406d2D8",
    setOFTContractAddress: "0x04111486919493c84F1318B7D6fE961f2e73f5B8",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#F2F2F2]",
    image: "tenet.svg",
    disabledNetworks: [
      5, 420, 66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "TENET",
    chainName: "tenet-mainnet",
  },
  {
    name: "Meter.io",
    chainId: 82,
    layerzeroChainId: 176,
    nftContractAddress: "0xce11b58d31580eab9cf24212fc746f8a8158d60d",
    tokenContractAddress: "0x0C8d284F0C9DbC72BEe3fad34AD8CfbB0A26f8F6",
    relayerAddress: "0x442b4bef4d1df08ebbff119538318e21b3c61eb9",
    messageContractAddress: "0x458DAb356841d8eA533b2ad75d26EbEFFeaB8E0d",
    gasRefuelContractAddress: "0x3A01a388D5c5dD45B2592c0a0fa25bBA552E2C00",
    setOFTContractAddress: "0xFD8b084d35E1cdB74694584C22577497B6CB720C",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#1C2A59]",
    image: "meter.svg",
    disabledNetworks: [
      5, 420, 66, 100, 122, 1101, 1116, 1285, 2222, 8217, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "MTRG",
    chainName: "meter-mainnet",
  },
  {
    name: "Kava",
    chainId: 2222,
    layerzeroChainId: 177,
    nftContractAddress: "0xC9D669637d3a1a4681E4dB161c3A4FB6f06c0eDF",
    tokenContractAddress: "0xcf8bcaCb401C31774EA39296b367B9DaB4F72267",
    relayerAddress: "0xcb566e3B6934Fa77258d68ea18E931fa75e1aaAa",
    messageContractAddress: "0xe828C7e9Cce86b22fb1ad4Ac35F4Ec856f0Cef32",
    gasRefuelContractAddress: "0x12Ac582c664B8B805C4d19f2c188cE4306bF6D1e",
    setOFTContractAddress: "0xD77a6944D0EFC4F2E41cC06F2aCe7Ae6974426CA",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#F2524B]",
    image: "kava.svg",
    disabledNetworks: [
      5, 420, 66, 82, 100, 122, 324, 1116, 1559, 7700, 8217, 42170, 1666600000, 5,80001,534353, 11155111,
      80001,
    ],
    symbol: "KAVA",
    chainName: "kava-mainnet",
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
    nftContractAddress: "0x6C2f11686B4706c29337d1c0Bbbe819A3e6dFA56",
    tokenContractAddress: "0x9b57378504dCc215c9063BbCeb19eEe2379B8613",
    relayerAddress: "0x75dC8e5F50C8221a82CA6aF64aF811caA983B65f",
    messageContractAddress: "0xCC61DA5F878Ae1dbA0f24e53325eDFF76498f7A1",
    gasRefuelContractAddress: "0x3411de43f6527f4267c619Ed75848b0272C1d9Ea",
    setOFTContractAddress: "0x2D6772226f9b2A9DB3A1bFe630D10Cb7BfD854b7",
    zkNFTContractAddress: "0x5c065130BC6Ef0EaD058b27F53E0ca20dD15E529",
    blockConfirmation: 5,
    colorClass: "bg-[#7F43DF]",
    image: "polygon.svg",
    logIndex: 2,
    disabledNetworks: [5, 420, 8217, 80001, 59144, 5000, 8453, 5,80001,534353, 11155111],
    symbol: "MATIC",
    chainName: "matic-mainnet",
  },
  {
    name: arbitrum.name,
    chainId: arbitrum.id,
    layerzeroChainId: 110,
    nftContractAddress: "0xe7637699bd894427a3d0F16c6a4cBC1FeA1fA8ec",
    tokenContractAddress: "0xCE0690a849FD00227A769BcC53c1C6266cc84483",
    relayerAddress: "0x177d36dBE2271A4DdB2Ad8304d82628eb921d790",
    messageContractAddress: "0xB5D479ebFfDC5e9B660E0657322Bb8BE3807DF26",
    gasRefuelContractAddress: "0x92778703489Bb81EF375D69e4D2dac0CDF943f0a",
    setOFTContractAddress: "0x2fB75A9eec363875A369b72eb88F1d70dA59e2B5",
    zkNFTContractAddress: "0xF529C887ca7D4045c433144f8dB0fDe7b48882A9",
    blockConfirmation: 5,
    colorClass: "bg-[#12AAFF]",
    image: "arbitrum.svg",
    disabledNetworks: [5, 420, 122, 1116, 8217, 80001, 5,80001,534353, 11155111],
    symbol: "ETH",
    chainName: "arbitrum-mainnet",
  },
  {
    name: optimism.name,
    chainId: optimism.id,
    layerzeroChainId: 111,
    nftContractAddress: "0x41E07e0b0fe07d4E7617acf0E2F6936CAeb2897D",
    tokenContractAddress: "0x207bCC253ba86ae10158c7642cE515e09Ff02F6A",
    relayerAddress: "0x81E792e5a9003CC1C8BF5569A00f34b65d75b017",
    messageContractAddress: "0xEFbD03A342B7D03A4a421c28eEb0D1dfC879224E",
    gasRefuelContractAddress: "0x577046a82E6B85Ce1E37586BC918DeC09555A497",
    setOFTContractAddress: "0x3279eF3BEb2D472e869B3Cd78Ab317d5DD8b4294",
    zkNFTContractAddress: "0xc2ed142a428ae7d551fcd260318db85e9f4ffba5",
    blockConfirmation: 5,
    colorClass: "bg-[#FF0420]",
    image: "optimism.svg",
    disabledNetworks: [5, 420, 66, 122, 1116, 8217, 80001, 5,80001,534353, 11155111],
    symbol: "ETH",
    chainName: "optimism-mainnet",
  },
  {
    name: fantom.name,
    chainId: fantom.id,
    layerzeroChainId: 112,
    nftContractAddress: "0xA544b558E679EF13C8a70b77D5C5a7C4f7B408fA",
    tokenContractAddress: "0x2D6772226f9b2A9DB3A1bFe630D10Cb7BfD854b7",
    relayerAddress: "0x52EEA5c490fB89c7A0084B32FEAB854eefF07c82",
    messageContractAddress: "0x5A99774307336E3e0041145E078b73b0B2265d3D",
    gasRefuelContractAddress: "0x311025abC487E6144655b16B0E67cDaa396Ee8a1",
    setOFTContractAddress: "0x5A832769cb525d8E2E60a93106DEFe57cbA3407a",
    zkNFTContractAddress: "0x5FEc34685d81712080e554734055d1f8394756C0",
    blockConfirmation: 5,
    colorClass: "bg-[#196aff]",
    image: "fantom.svg",
    disabledNetworks: [5, 420, 66, 122, 1116, 8217, 80001, 5,80001,534353, 11155111],
    symbol: "FTM",
    chainName: "fantom-mainnet",
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
    nftContractAddress: "0xF077EA48783ffcc67C88206e05E21733Cf101755",
    tokenContractAddress: "0xcd7585400D44e5C2e6d2FD411C1d813965c2B0E6",
    relayerAddress: "0x7cbd185f21bef4d87310d0171ad5f740bc240e26",
    messageContractAddress: "0x4767Ef5Dd777Ced33996add466D26BE611b535eF",
    gasRefuelContractAddress: "0xE649A6E11FB10dD9E5308DAf68C44D2800a47b02",
    setOFTContractAddress: "0x140FA79a8AC2D579f7573d3795826Cbb3BDA0894",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    colorClass: "bg-[#41dccc]",
    image: "harmony.svg",
    disabledNetworks: [
      5, 420, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222, 7700,
      8217, 42170, 80001, 5,80001,534353, 11155111
    ],
    symbol: "ONE",
    chainName: "harmony-mainnet",
  },

  {
    name: "OKT (OKX)",
    chainId: 66,
    layerzeroChainId: 155,
    nftContractAddress: "0x5fCF073e17d44f7E9FdbdCf9b8cA20f7BD36151d",
    tokenContractAddress: "0xEab5C72E2246415fAf0FBbf75Ac6ea96661552a5",
    relayerAddress: "0xfe7c30860d01e28371d40434806f4a8fcdd3a098",
    messageContractAddress: "0xa23A961F30e968b8C1CaDf235D649df20c21c139",
    gasRefuelContractAddress: "0x55E4DE637dAB6a5A98bC643ED3918B35AA20407E",
    setOFTContractAddress: "0x8E31C5476a66bb1C0a417c14D87A723f86133E10",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#000000]",
    image: "okex.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222,
      7700, 8217, 42170, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "OKT",
    chainName: undefined,
  },

  /**
   * 
   * Network name
Telos EVM Mainnet
Network URL
https://mainnet.telos.net/evm
Chain ID
40
Currency symbol
TLOS
Block explorer URL
https://teloscan.io
   */

  {
    name: "Loot Chain",
    chainId: 5151706,
    layerzeroChainId: 197,
    nftContractAddress: "0xeF430919857FaDb0ea086e0951fEf1c8a433D33a",
    tokenContractAddress: "0xD5989eFb78864AE22351621a9f32b9B3A994De2d",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    messageContractAddress: "",
    gasRefuelContractAddress: "0xB66CAeA47F6837b5A6c8903d9c4adD6ee364Ce88",
    setOFTContractAddress: "0x28EeB8751855AfcE0a5FE51ff376D24Cc40d1013",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#000000]",
    image: "loot.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222,
      7700, 8217, 42170, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "AGLD",
    chainName: undefined,
  },

  
  {
    name: "Zora Network",
    chainId: 7777777,
    layerzeroChainId: 195,
    nftContractAddress: "0x7Cb2dC2391826765D469504D7cEF7F6BE7a7A8f4",
    tokenContractAddress: "0xD5989eFb78864AE22351621a9f32b9B3A994De2d",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    messageContractAddress: "",
    gasRefuelContractAddress: "0x9FE6803cD5821F08e068592DB51475622Ca64FBF",
    setOFTContractAddress: "0x43F077B4072D63C3E9b2464148451e9147d5121f",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#000000]",
    image: "zora.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222,
      7700, 8217, 42170, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: undefined,
  },

    
  {
    name: "TomoChain",
    chainId: 88,
    layerzeroChainId: 196,
    nftContractAddress: "0xFD92930CA50ab900171643a8a47BC57d760a5d95",
    tokenContractAddress: "0xB918D6AA1014599987775b96a06341591F07a363",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    messageContractAddress: "",
    gasRefuelContractAddress: "0x87225C02F104a353d7dA0708907Ec18d1e74ce27",
    setOFTContractAddress: "0xEf7E9A3e3AC8A077B34C20cbdDA1866BDBb883e0",
    zkNFTContractAddress: undefined,
    blockConfirmation: 2,
    colorClass: "bg-[#000000]",
    image: "tomo.svg",
    disabledNetworks: [
      5, 420, 10, 66, 82, 100, 122, 324, 1088, 1101, 1116, 1285, 1559, 2222,
      7700, 8217, 42170, 1666600000, 80001, 5,80001,534353, 11155111
    ],
    symbol: "TOMO",
    chainName: undefined,
  },
  

  

  {
    name: goerli.name,
    chainId: goerli.id,
    layerzeroChainId: 10121,
    nftContractAddress: "0x6007d8db8205dBBA20a887df8b992E5ECAeC993a",
    tokenContractAddress: "0xc67505deaa9c0c08b9bcf2f55476c66b77e0c82f",
    messageContractAddress: "0x685ee8d4f4b96354c4378A9eE44F48525D8B7f9A",
    relayerAddress: "0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9",
    zkNFTContractAddress: undefined,
    blockConfirmation: 3,
    colorClass: "bg-[#373737]",
    image: "ethereum.svg",
    disabledNetworks: [
      56, 43114, 137, 42161, 10, 250, 1666600000, 1284, 122, 100, 8217, 1088,
      1116, 66, 1101, 7700, 324, 1285, 1559, 42170, 82, 2222, 59144, 8453, 5000,
      42220, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: undefined,
    isTestnet: true,
  },
  {
    name: polygonMumbai.name,
    chainId: polygonMumbai.id,
    layerzeroChainId: 10109,
    nftContractAddress: "0xbB89Bb8aFB9EE4E9229A1AE7F11f196BA13514C9",
    tokenContractAddress: "0xc67505DEaA9C0c08B9bcf2F55476C66b77e0c82f",
    messageContractAddress: "0x765475a4069F3F679735d0752aB90a225b2083aa",
    zkNFTContractAddress: undefined,
    blockConfirmation: 5,
    logIndex: 2,
    colorClass: "bg-[#7F43DF]",
    image: "polygon.svg",
    disabledNetworks: [
      56, 43114, 137, 42161, 10, 250, 1666600000, 1284, 122, 100, 8217, 1088,
      1116, 66, 1101, 7700, 324, 1285, 1559, 42170, 82, 2222, 59144, 8453, 5000, 5,80001,534353, 11155111
    ],
    symbol: "MATIC",
    chainName: "polygon-mumbai",
    isTestnet: true,
  },


  {
    name: scrollTestnet.name,
    chainId: scrollTestnet.id,
    layerzeroChainId: 10170,
    nftContractAddress: "0xE1b942049E7B744128FE9808D9d43FC2BB1376FD",
    tokenContractAddress: "0xc67505deaa9c0c08b9bcf2f55476c66b77e0c82f",
    zkNFTContractAddress: undefined,
    relayerAddress: "",
    blockConfirmation: 5,
    colorClass: "bg-[#E5D1B8]",
    image: "scroll.svg",
    disabledNetworks: [
      56, 43114, 137, 42161, 10, 250, 1666600000, 1284, 122, 100, 8217, 1088,
      1116, 66, 1101, 7700, 324, 1285, 1559, 42170, 82, 2222, 59144, 8453, 5000,
      42220, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: undefined,
    isTestnet: true,
  },

  {
    name: lineaTestnet.name,
    chainId: lineaTestnet.id,
    layerzeroChainId: 10170,
    nftContractAddress: "0xE1b942049E7B744128FE9808D9d43FC2BB1376FD",
    tokenContractAddress: "0x1A8C9Cf33458Dd7556EEA2b2F903e559FDA916eD",
    zkNFTContractAddress: undefined,
    relayerAddress: "",
    blockConfirmation: 5,
    colorClass: "bg-[#E5D1B8]",
    image: "linea.svg",
    disabledNetworks: [
      56, 43114, 137, 42161, 10, 250, 1666600000, 1284, 122, 100, 8217, 1088,
      1116, 66, 1101, 7700, 324, 1285, 1559, 42170, 82, 2222, 59144, 8453, 5000,
      42220, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: undefined,
    isTestnet: true,
  },
  /*
  {
    name: sepolia.name,
    chainId: sepolia.id,
    layerzeroChainId: 161,
    nftContractAddress: "0xD7a9fC47CADD6A7dDB8dFC7C28CB9F32B3f4CCcD",
    tokenContractAddress: "0xc67505DEaA9C0c08B9bcf2F55476C66b77e0c82f",
    relayerAddress: "0x306B9a8953B9462F8b826e6768a93C8EA7454965",
    blockConfirmation: 5,
    colorClass: "bg-[#777777]",
    image: "ethereum.svg",
    disabledNetworks: [
      56, 43114, 137, 42161, 10, 250, 1666600000, 1284, 122, 100, 8217, 1088,
      1116, 66, 1101, 7700, 324, 1285, 1559, 42170, 82, 2222, 59144, 8453, 5000,
      42220, 5,80001,534353, 11155111
    ],
    symbol: "ETH",
    chainName: "eth-sepolia",
    isTestnet: true,
  },

 */
];
