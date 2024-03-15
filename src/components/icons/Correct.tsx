import { IconProps } from "@/types/IconProps";

export default function CorrectIcon({ ...props }: IconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 41 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.1667 5H14.1667C12.2999 5 11.3664 5 10.6534 5.36331C10.0262 5.68289 9.51626 6.19282 9.19669 6.82003C8.83337 7.53307 8.83337 8.46649 8.83337 10.3333V29.6667C8.83337 31.5335 8.83337 32.4669 9.19669 33.18C9.51626 33.8072 10.0262 34.3171 10.6534 34.6367C11.3664 35 12.2999 35 14.1667 35H17.1667M22.1667 5L32.1667 15M22.1667 5V12.3333C22.1667 13.2668 22.1667 13.7335 22.3484 14.09C22.5082 14.4036 22.7631 14.6586 23.0767 14.8183C23.4332 15 23.9 15 24.8334 15H32.1667M32.1667 15V16.6667M15.5 28.3333H19.6667M15.5 21.6667H23.8334M15.5 15H17.1667M23.8334 35L27.2083 34.325C27.5026 34.2662 27.6497 34.2367 27.7869 34.1829C27.9087 34.1351 28.0245 34.0732 28.1318 33.9984C28.2526 33.9141 28.3588 33.808 28.571 33.5957L35.5 26.6667C36.4205 25.7462 36.4205 24.2538 35.5 23.3333C34.5796 22.4129 33.0872 22.4129 32.1667 23.3333L25.2376 30.2624C25.0254 30.4746 24.9193 30.5807 24.835 30.7016C24.7602 30.8089 24.6982 30.9246 24.6505 31.0464C24.5966 31.1836 24.5672 31.3308 24.5084 31.6251L23.8334 35Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}