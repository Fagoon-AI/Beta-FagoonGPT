"use client";
import { useState } from "react";
import Showcase from "./showcase";
import FilesIcon from "../icons/Files";
import MicIcon from "../icons/Mic";
import { useSmallDevices } from "@/hooks/useSmallDevices";
import axios from "axios";
import SearchIcon from "../icons/Search";

export interface ChatMessage {
  prompt: string;
  response: string | null;
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const isSmallDevice = useSmallDevices();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (prompt?: string) => {
    let newChat: ChatMessage;
    if (prompt) {
      newChat = {
        prompt,
        response: null,
      };
    } else {
      newChat = {
        prompt: inputText,
        response: null,
      };
    }
    setConversation((prev) => [...prev, newChat]);
    setInputText("");
    try {
      const response = await axios.post(
        "https://chat.fagoondigital.com/api/prompt/",
        {
          prompt: inputText,
        }
      );
      newChat.response = response.data.response;

      setConversation((prev) => [...prev.slice(0, -1), newChat]);
    } catch (error) {
      console.log(error);
    }
  };

  const iconSize = isSmallDevice ? "24" : "32";

  return (
    <main className="flex flex-col py-3 justify-between md:h-screen h-fit">
      {conversation.length === 0 ? (
        <Showcase handleSubmit={handleSubmit} />
      ) : (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto scrollbar-none mb-16">
          {conversation.map((chat, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-500"></div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 bg-gray-700 p-4 rounded-lg">
                  <span className="text-white font-semibold">You:</span>
                  <span className="text-white">{chat.prompt}</span>
                </div>
                {chat.response && (
                  <div className="flex flex-col gap-1 bg-blue-600 p-4 rounded-lg">
                    <span className="text-white font-semibold">Fagoon:</span>
                    <span className="text-white">{chat.response}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
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
    </main>
  );
}
