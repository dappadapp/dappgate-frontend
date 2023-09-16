import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
  setShowInput: any;
}

const FaAngleDown: React.FC<Props> = ({ setShowInput }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      cursor="pointer"
      onClick={() => setShowInput((prev: any) => !prev)}
      className="w-8 h-8 mt-2 cursor-pointer"
    >
      <FontAwesomeIcon icon={faAngleDown} />
    </svg>
  );
};

export default FaAngleDown;
