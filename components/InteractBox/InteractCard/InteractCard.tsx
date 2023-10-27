import React from "react";
type Props = {
  title: string;
  value: any;
};
function InteractCard(props: Props) {
  return (
    <div className="flex flex-col px-2 bg-white rounded-md items-start">
      <span className="text-[#000] font-semibold">{props.title}</span>
      <span className="text-[#000]/80">{props.value}</span>
    </div>
  );
}

export default InteractCard;
