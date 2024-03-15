"use client";

import { IconProps } from "@/types/IconProps";

export default function CodeIcon({ ...props }: IconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.8333 15L18.8333 20L13.8333 25M22.1667 25H27.1667M12.5 33.3333H28.5C30.3668 33.3333 31.3003 33.3333 32.0133 32.97C32.6405 32.6504 33.1504 32.1405 33.47 31.5133C33.8333 30.8003 33.8333 29.8668 33.8333 28V12C33.8333 10.1332 33.8333 9.19973 33.47 8.4867C33.1504 7.85949 32.6405 7.34955 32.0133 7.02998C31.3003 6.66666 30.3668 6.66666 28.5 6.66666H12.5C10.6332 6.66666 9.69974 6.66666 8.9867 7.02998C8.35949 7.34955 7.84956 7.85949 7.52998 8.4867C7.16667 9.19973 7.16667 10.1332 7.16667 12V28C7.16667 29.8668 7.16667 30.8003 7.52998 31.5133C7.84956 32.1405 8.35949 32.6504 8.9867 32.97C9.69974 33.3333 10.6332 33.3333 12.5 33.3333Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
