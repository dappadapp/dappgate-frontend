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
      "https://pbs.twimg.com/profile_images/1707960655490281472/3mrVLogY_400x400.jpg",
    url: "https://tracker.dappgate.io",
  },
];
const dummyProjectsdata = [
  {
    description: "Pioneering #LayerZero to bridge ONFTs and OFTs across networks",
    url: "/apps/dappgate",
    image: "/dappgate.png",
    name: "DappGate",
    status: "Live",
  },
  {
    description: "First Aggregator at Scroll Network",
    url: "",
    image: "https://i.ibb.co/L6Rhdh6/Whats-App-Image-2023-09-30-at-20-18-33-1.jpg",
    name: "Aggre",
    status: "Coming Soon",
  },
  {
    description: "",
    url: "ZetaGate: Your Cross-Chain, NFT, and Messaging Gate",
    image: "https://i.ibb.co/2NrJrx9/Screenshot-2023-10-01-at-02-35-15.png",
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-7">
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
