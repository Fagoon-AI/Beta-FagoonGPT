"use client";
import { useEffect, useRef, useState } from "react";
import Showcase from "./showcase";
import FilesIcon from "../icons/Files";
import MicIcon from "../icons/Mic";
import { useSmallDevices } from "@/hooks/useSmallDevices";
import axios from "axios";
import SearchIcon from "../icons/Search";
import Navbar from "../ui/nav";

export interface ChatMessage {
  prompt: string;
  response: string | null;
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const isSmallDevice = useSmallDevices();

  const conversationContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

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
    setLoading(true);

    // Close the keyboard on mobile devices
    const inputElement = document.getElementById("chatInput");
    if (inputElement) {
      inputElement.blur();
    }

    try {
      const response = await axios.post(
        "https://chat.fagoondigital.com/api/prompt/",
        {
          prompt: inputText,
        }
      );
      newChat.response = response.data.response;

      // Update the conversation state with the new response
      setConversation((prev) => [
        ...prev.slice(0, -1), // Remove the last message (user's input)
        newChat, // Add the new message (user's input)
        { prompt: response.data.response, response: null }, // Add a new message for Fagoon's response
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }

    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight + 200); // Adjust the scroll amount as needed
  };

  const iconSize = isSmallDevice ? "24" : "32";

  return (
    <main className="flex flex-col justify-between min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-1 overflow-y-auto py-4 px-6">
        {conversation.length === 0 ? (
          <Showcase handleSubmit={handleSubmit} />
        ) : (
          <div
            ref={conversationContainerRef}
            className="space-y-4"
            style={{
              minHeight: "calc(100% - 60px)",
              overflowY: "hidden", // Hide scrollbar
              marginBottom: "80px", // Adjusted to make space for input box
            }}
          >
            {conversation.map((chat, index) => (
              <div key={index} className="flex flex-col space-y-2">
                <div
                  className={`flex flex-col ${
                    chat.response ? "items-end" : "items-start"
                  } ${
                    !chat.response
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  } p-4 rounded-md`}
                  style={{
                    marginLeft: chat.response ? "50px" : "0", // Add margin to the right for responses
                    marginRight: !chat.response ? "50px" : "0", // Add margin to the left for user messages
                  }}
                >
                  <span className="font-semibold">
                    {chat.response ? "You:" : "Fagoon:"}
                  </span>
                  <span>{chat.prompt}</span>
                  {loading &&
                    !chat.response &&
                    index === conversation.length - 1 && (
                      <div className="flex justify-end">
                        <div className="loader"></div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="flex items-center bg-[#1C1F28] py-3 md:px-8
        px-4 rounded-3xl fixed bottom-4 w-[85%] sm:w-[50%]"
      >
        <SearchIcon width={iconSize} height={iconSize} />
        <input
          id="chatInput"
          className="flex-1 bg-transparent text-white placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm"
          type="text"
          placeholder="Ask me anything..."
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <div className="flex items-center space-x-4">
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
