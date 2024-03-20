import { IconProps } from "@/types/IconProps";

export default function MicIcon({
  isRecording,
  ...props
}: IconProps & { isRecording?: boolean }) {
  return (
    <svg
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {!isRecording && (
        <>
          <rect y="0.5" width="31" height="31" rx="10" fill="#272B34" />

          <path
            d="M15.4691 7.00009C12.8633 7.00009 10.7509 9.09915 10.7509 11.6876V15.4376C10.7509 18.026 12.8633 20.1251 15.4691 20.1251C18.0749 20.1251 20.1873 18.026 20.1873 15.4376V11.6876C20.1873 9.09915 18.0749 7.00009 15.4691 7.00009ZM15.4814 8.87509C17.0449 8.87509 18.3123 10.1342 18.3123 11.6876V15.4376C18.3123 16.991 17.0449 18.2501 15.4814 18.2501C13.9179 18.2501 12.6504 16.991 12.6504 15.4376V11.6876C12.6504 10.1342 13.9179 8.87509 15.4814 8.87509ZM9.21709 18.2342C8.98422 18.1704 8.70362 18.1807 8.47694 18.3082C8.02365 18.5642 7.86597 19.1473 8.12312 19.5982C9.46347 21.9448 11.7661 23.5151 14.567 23.8235L14.5623 24.8126C14.5623 25.3301 14.9786 25.7501 15.4998 25.7501C16.0209 25.7501 16.4373 25.3301 16.4373 24.8126L16.4333 23.8188C19.1102 23.5179 21.5177 21.9701 22.8674 19.6563C23.1288 19.2082 22.994 18.656 22.543 18.3964C22.0922 18.1367 21.5069 18.2707 21.2455 18.7188C20.0714 20.7317 17.8837 22.0001 15.4998 22.0001C13.094 22.0001 10.9308 20.7242 9.76478 18.6823C9.63625 18.4573 9.44988 18.2988 9.21709 18.2342Z"
            fill="white"
          />
        </>
      )}
      {isRecording && (
        <rect x="7.5" y="7.5" width="16" height="16" rx="5" fill="#FF0000" />
      )}
    </svg>
  );
}
