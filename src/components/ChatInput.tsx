"use client";
import SearchIcon from "@/components/icons/Search";
import FilesIcon from "@/components/icons/Files";
import MicIcon from "@/components/icons/Mic";
import { useSmallDevices } from "@/hooks/useSmallDevices";
export default function ChatInput() {
  const isSmallDevice = useSmallDevices();

  const iconSize = isSmallDevice ? "24" : "32";
  return (
    <div
      className="flex items-center bg-[#1C1F28] py-3 md:px-8
    px-4 rounded-3xl fixed bottom-4 w-[85%] sm:w-[50%]"
    >
      <SearchIcon
        width={isSmallDevice ? "16" : "24"}
        height={isSmallDevice ? "16" : "24"}
      />
      <input
        className="flex-1 bg-transparent text-white placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm"
        type="text"
        placeholder="What are you looking for?"
      />
      <div className="flex items-center gap-2">
        <FilesIcon
          className="cursor-pointer"
          width={iconSize}
          height={iconSize}
        />
        <MicIcon
          className="cursor-pointer"
          width={iconSize}
          height={iconSize}
        />
      </div>
    </div>
  );
}
