import { IconProps } from "@/types/IconProps";

export default function FilesIcon({ ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect y="0.5" width="31" height="31" rx="10" fill="#272B34" />
      <path
        d="M9 7C7.3431 7 6 8.343 6 10V12V21C6 23.209 7.7909 25 10 25H20C22.2091 25 24.0001 23.209 24 21V12C24 11.448 23.5523 11 23 11H18C17.2453 11 17.0024 10.755 16.4062 9.562C15.5025 7.755 14.7452 7 13 7H9ZM9 9H13C13.7547 9 13.9976 9.245 14.5938 10.438C14.7243 10.699 14.7784 10.782 14.9062 11H10.9688C10.4165 11 9.9687 11.448 9.9688 12C9.9688 12.552 10.4165 13 10.9688 13H18H22V21C22 22.105 21.1046 23 20 23H10C8.8954 23 7.9999 22.105 8 21V12V10C8 9.448 8.4477 9 9 9ZM15 15C14.4477 15 14 15.448 14 16V17H13C12.4477 17 12 17.448 12 18C12 18.552 12.4477 19 13 19H14V20C14 20.552 14.4477 21 15 21C15.5523 21 16 20.552 16 20V19H17C17.5523 19 18 18.552 18 18C18 17.448 17.5523 17 17 17H16V16C16 15.448 15.5523 15 15 15Z"
        fill="white"
      />
    </svg>
  );
}
