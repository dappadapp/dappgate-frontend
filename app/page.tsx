"use client";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ProjectList from "@/components/ProjectList/ProjectList";
import React from "react";

const dummyAppsData = [
  {
    title: "DappGate",
    sub_title: "Layerzero ONFT/OFT Bridge",
    description: "Pioneering #LayerZero to bridge ONFTs and OFTs across networks",
    image_url: "/dappgate.png",
    url: "/apps/dappgate",
  },
  {
    title: "Tracker",
    sub_title: "DappGate Tracker",
    description:
      "Track wallet transactions and discover your eligibility for blockchain airdrops!",
    image_url:
      "/tracker.jpg",
    url: "https://tracker.dappgate.io",
  },
];
const dummyProjectsdata = [

  {
    description: "Scroll bridge is a bridge that allows users to transfer assets from Ethereum",
    url: "/bridge",
    image: "/bridge-card.png",
    name: "Scroll Bridge",
    status: "Live",
  },
  {
    description: "Pioneering #LayerZero to bridge ONFTs and OFTs across networks",
    url: "/apps/dappgate",
    image: "/dappgate-card.jpeg",
    name: "DappGate",
    status: "Live",
  },
  {
    description: "Track wallet transactions and discover your eligibility for blockchain airdrops!",
    url: "https://tracker.dappgate.io",
    image: "/tracker.jpg",
    name: "Tracker",
    status: "Live",
  },
  {
    description: "Your entry point to layer 2 EcoSystem",
    url: "https://app.dappad.app/",
    image: "/dappad.png",
    name: "Dappad+",
    status: "Testnet Live",
  },
  {
    description: "First Aggregator at Scroll Network",
    url: "",
    image: "/aggre.jpg",
    name: "Aggre",
    status: "Coming Soon",
  },
  {
    description: "Your Cross-Chain swap, NFT, and Messaging Gate",
    url: "",
    image: "/zetagate.png",
    name: "ZetaGate",
    status: "Coming Soon",
  },
];
const dummyPorjectListData = [
  {
    apps: dummyAppsData,
    title: "Hottest Apps",
  },
  {
    apps: dummyAppsData,
    title: "Most Liked Apps",
  },
];
export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-center">
        <span className="text-blue-400">Explore</span>. <span className="text-purple-400">Discover</span>. <span className="text-pink-400">Earn.</span> 
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {dummyProjectsdata.map((project) => (
          <ProjectCard key={"project-" + project.name} project={project} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyPorjectListData.map((projectList) => (
          <ProjectList
            key={"project-list-" + projectList.title}
            apps={projectList.apps}
            title={projectList.title}
          />
        ))}
      </div>
    </div>
  );
}
