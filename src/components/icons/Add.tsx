import { IconProps } from "@/types/IconProps";

export default function AddIcon({ ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="41" height="40" rx="10" fill="#272B34" />

      <path
        d="M20.5 10V30M10 20.5H30"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
