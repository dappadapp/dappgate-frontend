import React from 'react'

type Props = {
  onArrowClick: (value: any) => void,
  isClickable: boolean,
};

const CircleSvg = ({ 
  onArrowClick,
  isClickable
}: Props) => {
  const handleClick = isClickable ? onArrowClick : undefined;

  return (
    <svg
      width="58"
      height="45"
      viewBox="0 0 48 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      cursor="pointer"
      className="mt-5"
    >
      <circle
        cx="17.4"
        cy="17.4"
        r="16.4"
        stroke="white"
        strokeWidth="2"
      />
      <circle
        cx="30.6031"
        cy="17.4"
        r="16.4"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  )
}

export default CircleSvg;