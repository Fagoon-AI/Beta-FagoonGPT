"use client";
import { useState, useEffect, useRef } from "react";
import Showcase from "./showcase";
import FilesIcon from "../icons/Files";
import MicIcon from "../icons/Mic";
import { useSmallDevices } from "@/hooks/useSmallDevices";
import axios from "axios";
import SearchIcon from "../icons/Search";
import Navbar from "../ui/nav";
import { Skeleton } from "../ui/skeleton";

export interface ChatMessage {
  prompt: string;
  response: string | null;
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const isSmallDevice = useSmallDevices();
  const lastChatRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (lastChatRef.current) {
      lastChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const iconSize = isSmallDevice ? "24" : "32";

  return (
    <>
      <Navbar />
      <main className="flex mt-12 flex-col justify-between md:h-screen h-fit">
        {conversation.length === 0 ? (
          <Showcase handleSubmit={handleSubmit} />
        ) : (
          <div className="flex flex-col gap-6 overflow-y-auto scrollbar-none h-[calc(100vh-124px)]">
            {conversation.map((chat, index) => (
              <div
                key={index}
                className="flex flex-col gap-4"
                ref={index === conversation.length - 1 ? lastChatRef : null}
              >
                <div className="flex flex-col gap-1 px-4 rounded-lg">
                  <span className="font-semibold">You:</span>
                  <span>{chat.prompt}</span>
                </div>
                <div className="flex flex-col gap-1 px-4 rounded-lg">
                  <span className="font-semibold">Fagoon:</span>
                  {chat.response ? (
                    <span>{chat.response}</span>
                  ) : (
                    <>
                      <Skeleton className="w-full h-[20px] mt-2" />
                      <Skeleton className="w-full h-[20px] mt-2" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className="flex items-center bg-[#1C1F28] py-2 mb-3 md:px-8
            px-4 rounded-3xl fixed bottom-4 w-[90%] sm:w-[50%]"
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
    </>
  );
}
