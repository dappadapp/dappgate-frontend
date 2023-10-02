import React from "react";

type Props = {
  image: string;
  name: string;
  description: string;
  url: string;
  status: string;
};

const ProjectCard: React.FC<Props> = ({ description, image, name, url, status }) => {
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
      className="flex flex-col  justify-end items-start w-full p-4 md:h-[250px]"
      onClick={() => openInNewTab(url)}
    >
      <div
        className="absolute top-2 right-2 text-white py-1 px-2 rounded-md"
        style={{ backgroundColor: status == "Coming Soon" ? '#FF5722' : '#00E676' }} // Use your desired color
      >
        {status}
      </div>
      <h2 className="text-white text-2xl">{name}</h2>
      <h3 className="text-[#808080] text-lg word">{description}</h3>
    </div>
  );
};
export default ProjectCard;
