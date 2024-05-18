import * as React from "react";

function Collapse() {
  return (
    <svg viewBox="0 0 21 21" fill="currentColor" height="25px" width="25px">
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 15.5v-10a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-10a2 2 0 01-2-2z" />
        <path
          fill="currentColor"
          d="M5.5 15.5v-10a2 2 0 012-2h-2c-1 0-2 .895-2 2v10c0 1.105 1 2 2 2h2a2 2 0 01-2-2z"
        />
        <path d="M10.5 13.5l-3-3 3-3M15.5 10.5h-8" />
      </g>
    </svg>
  );
}

export default Collapse;
