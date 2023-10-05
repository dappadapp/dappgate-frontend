import React from "react";

type Props = {
  project: ProjectType;
};
type ProjectType = {
  image: string;
  name: string;
  description: string;
  url: string;
  status: string;
};

const ProjectCard: React.FC<Props> = ({ project }) => {
  const { description, image, name, url, status } = project;
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
        position: "relative", // Make the card relative
      }}
      className="flex flex-col lg:justify-end transition-all hover:scale-105 duration-300  hover:z-10 justify-start items-start w-full lg:pt-4 pt-10 p-4 md:h-[250px] hover:cursor-pointer"
      onClick={url ? () => openInNewTab(url) : () => {}}
    >
      <div
        className="absolute top-1 right-1 lg:top-2 lg:right-2 text-white py-1 px-2 text-xs lg:text-base rounded-md"
        style={{ backgroundColor: status == "Coming Soon" ? "#FF5722" : "#00E676" }} // Use your desired color
      >
        {status}
      </div>
      <h2 className="text-white text-lg lg:text-2xl">{name}</h2>
      <h3 className="text-[#808080] text-xs lg:text-lg ">{description}</h3>
    </div>
  );
};
export default ProjectCard;
