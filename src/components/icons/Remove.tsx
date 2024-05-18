import React from "react";

interface RemoveIconProps {
  onClick?: () => void;
}

const RemoveIcon: React.FC<RemoveIconProps> = ({ onClick }) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      onClick={onClick}
    >
      <path fill="currentColor" d="M8 11a1 1 0 100 2h8a1 1 0 100-2H8z" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-2 0a9 9 0 11-18 0 9 9 0 0118 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default RemoveIcon;
