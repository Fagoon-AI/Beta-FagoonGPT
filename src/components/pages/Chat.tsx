"use client";
import React, { useState, useEffect, useRef } from "react";
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
  audioBlob: Blob | null; // Add audioBlob property to ChatMessage
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const isSmallDevice = useSmallDevices();
  const lastChatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (prompt?: string) => {
    if (!prompt && inputText.trim() === "") return;

    const newChat: ChatMessage = {
      prompt: prompt || inputText,
      response: null,
      audioBlob: null, // Initialize audioBlob to null
    };

    setConversation((prev) => [...prev, newChat]);

    try {
      const response = await axios.post(
        "https://chat.fagoondigital.com/api/prompt/",
        { prompt: prompt || inputText } // Send prompt as JSON data
      );

      newChat.response = response.data.response;
      setConversation((prev) => [...prev.slice(0, -1), newChat]);
    } catch (error) {
      console.log(error);
    }

    setInputText(""); // Clear input text
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = async (event) => {
        const newBlob = new Blob([event.data], { type: "audio/mp3" });

        try {
          const formData = new FormData();
          formData.append("file", newBlob, "recorded_audio.mp3");

          const response = await axios.post(
            "https://chat.fagoondigital.com/api/prompt/",
            formData
          );

          const newChat: ChatMessage = {
            prompt: "",
            response: response.data.response,
            audioBlob: newBlob, // Set audioBlob for the current message
          };

          setConversation((prev) => [...prev, newChat]);
        } catch (error) {
          console.log(error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) {
      console.error("No recording in progress.");
      return;
    }

    mediaRecorder.stop();
    setRecording(false);
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
      <main
        className={`flex mt-14 flex-col justify-between md:h-screen h-fit ${
          recording ? "glow-purple" : ""
        }`}
      >
        {conversation.length === 0 ? (
          <Showcase handleSubmit={handleSubmit} />
        ) : (
          <div className="flex flex-col gap-6 overflow-y-auto scrollbar-none h-[calc(100dvh-124px)]">
            {conversation.map((chat, index) => (
              <div
                key={index}
                className="flex flex-col gap-4"
                ref={index === conversation.length - 1 ? lastChatRef : null}
              >
                {chat.audioBlob && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-semibold">You:</span>
                    <audio controls>
                      <source
                        src={URL.createObjectURL(chat.audioBlob)}
                        type="audio/mp3"
                      />
                    </audio>
                  </div>
                )}
                {chat.prompt && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-semibold">You:</span>
                    <span>{chat.prompt}</span>
                  </div>
                )}
                {chat.response && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-semibold">Fagoon:</span>
                    <span>{chat.response}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className={`flex items-center bg-[#1C1F28] py-2 md:px-8 px-4 rounded-3xl fixed bottom-3 w-[95%] sm:w-[50%] h-[50px] ${
            recording ? "glow-purple" : ""
          }`}
        >
          <SearchIcon
            width={isSmallDevice ? "16" : "24"}
            height={isSmallDevice ? "16" : "24"}
          />
          <input
            className={`flex-1 bg-transparent text-white placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm ${
              recording ? "" : "glow-purple" // Only apply glow when not recording
            }`}
            type="text"
            placeholder="What are you looking for?"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <div className="flex items-center gap-2">
            <FilesIcon
              className="cursor-pointer"
              width={iconSize}
              height={iconSize}
            />
            <button onClick={recording ? stopRecording : startRecording}>
              <MicIcon
                className={`cursor-pointer ${recording ? "text-red-500" : ""}`}
                width={iconSize.toString()}
                height={iconSize.toString()}
              />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
