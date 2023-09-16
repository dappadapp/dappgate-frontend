"use client";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import ProjectList from "@/components/ProjectList/ProjectList";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ProjectCard
          description="Web3 gaming platform & NFT Marketplace
          platform"
          url="deneme.com"
          image="https://i7x7p5b7.stackpathcdn.com/codrops/wp-content/uploads/2015/01/blend-mode-example-screenshot.png"
          name="Lifty.io"
        />
        <ProjectCard
          description="Web3 gaming platform & NFT Marketplace
          platform"
          url="deneme.com"
          image="https://i7x7p5b7.stackpathcdn.com/codrops/wp-content/uploads/2015/01/blend-mode-example-screenshot.png"
          name="Lifty.io"
        />
        <ProjectCard
          description="Web3 gaming platform & NFT Marketplace
          platform"
          url="deneme.com"
          image="https://i7x7p5b7.stackpathcdn.com/codrops/wp-content/uploads/2015/01/blend-mode-example-screenshot.png"
          name="Lifty.io"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectList apps={[]} title="Hottest Apps" />
        <ProjectList apps={[]} title="Most Liked Apps" />
      </div>
    </div>
  );
}
