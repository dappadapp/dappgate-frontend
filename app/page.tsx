"use client";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ProjectList from "@/components/ProjectList/ProjectList";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ProjectCard
          description="Pioneering #LayerZero to bridge ONFTs and OFTs across networks"
          url="/apps/dappgate"
          image="https://pbs.twimg.com/media/F6Tx4PIW8AAabgn?format=jpg&name=4096x4096"
          name="DappGate"
          status="Live"
        />
        <ProjectCard
          description="First Aggregator at Scroll Network"
          url=""
          image="https://i.ibb.co/L6Rhdh6/Whats-App-Image-2023-09-30-at-20-18-33-1.jpg"
          name="Aggre"
          status="Coming Soon"
        />
        <ProjectCard
          description="Web3 gaming platform & NFT Marketplace
          platform"
          url=""
          image="https://i.ibb.co/2NrJrx9/Screenshot-2023-10-01-at-02-35-15.png"
          name="ZetaGate"
          status="Coming Soon"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectList apps={[]} title="Hottest Apps" />
        <ProjectList apps={[]} title="Most Liked Apps" />
      </div>
    </div>
  );
}
