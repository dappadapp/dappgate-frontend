import React from "react";

type Props = {
  image: string;
  name: string;
  description: string;
  url: string;
};

const ProjectCard: React.FC<Props> = ({ description, image, name, url }) => {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 68.23%), url(${image})`,
        borderRadius: "8px",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        border: "1px solid #808080",
      }}
      className="flex flex-col  justify-end items-start w-full p-4 md:h-[250px]"
      onClick={() => openInNewTab(url)}
    >
      <h2 className="text-white text-2xl">{name}</h2>
      <h3 className="text-[#808080] text-lg word">{description}</h3>
    </div>
  );
};
export default ProjectCard;
