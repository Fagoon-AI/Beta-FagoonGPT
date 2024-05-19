import * as React from "react";

interface HistoryIconProps {
  isMenuOpen: boolean;
}

function HistoryIcon(props: HistoryIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      style={{ cursor: "pointer" }}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12h2a8 8 0 101.865-5.135L8 9H2V3l2.447 2.446A9.98 9.98 0 0112 2zm1 5v4.585l3.243 3.243-1.415 1.415L11 12.413V7h2z" />
    </svg>
  );
}

export default HistoryIcon;
