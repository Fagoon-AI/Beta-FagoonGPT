"use client";
import SearchIcon from "@/components/icons/Search";
import FilesIcon from "@/components/icons/Files";
import MicIcon from "@/components/icons/Mic";
export default function ChatInput() {
  return (
    <div className="flex items-center bg-[#1C1F28] py-3 px-8 rounded-3xl">
      <SearchIcon />
      <input
        className="flex-1 bg-transparent text-white placeholder-white focus:outline-none ml-5"
        type="text"
        placeholder="What are you looking for?"
      />
      <div className="flex items-center gap-2">
        <FilesIcon className="cursor-pointer" />
        <MicIcon className="cursor-pointer" />
      </div>
    </div>
  );
}
