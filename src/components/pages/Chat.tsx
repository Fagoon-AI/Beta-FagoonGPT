"use client";
import React, { useState, useEffect, useRef } from "react";
import Showcase from "./showcase";
import FilesIcon from "../icons/Files";
import MicIcon from "../icons/Mic";
import SearchIcon from "../icons/Search";
import Navbar from "../ui/nav";
import axios from "axios";
import { useSmallDevices } from "@/hooks/useSmallDevices";
import { toast } from "sonner";
import { set } from "react-hook-form";

export interface ChatMessage {
  prompt: string;
  response: string | null;
  user_prompt?: string;
  audioBlob?: Blob | null;
}

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSmallDevice = useSmallDevices();
  const lastChatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handlePlayResponse = async (
    response: string | boolean,
    isVoice?: boolean
  ) => {
    if (isSpeaking) {
      audioElement?.pause();
      setIsSpeaking(false);
    }

    if (typeof response === "string" && !isSpeaking && !isProcessing) {
      try {
        setIsProcessing(true);

        const audioResponse = await axios.post(
          "https://chat.fagoondigital.com/api/fagoonchat_audio/",
          { chat: response },
          { responseType: "blob" }
        );

        const audioBlob = new Blob([audioResponse.data], {
          type: "audio/mpeg",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newAudio = new Audio(audioUrl);

        // Wait for the audio to finish playing before proceeding
        await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust delay as needed

        setAudioElement(newAudio);
        setIsSpeaking(true);
        newAudio.play();
        newAudio.onended = () => {
          setIsSpeaking(false);
        };
      } catch (error) {
        console.error("Error fetching and playing audio:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsSpeaking(false);
    }
  };

  const handleAudioToggle = () => {
    if (isSpeaking) {
      audioElement?.pause();
      setIsSpeaking(false);
    } else {
      audioElement?.play();
      setIsSpeaking(true);
    }
  };

  const handleSubmit = async (prompt?: string) => {
    setInputText("");
    if (!prompt && inputText.trim() === "") return;

    const newChat: ChatMessage = {
      prompt: prompt || inputText,
      response: null,
    };

    setConversation((prev) => [...prev, newChat]);

    try {
      setIsProcessing(true);

      const response = await axios.post(
        "https://chat.fagoondigital.com/api/prompt/",
        { prompt: prompt || inputText }
      );

      newChat.response = response.data.response;
      newChat.user_prompt = response.data.user_prompt;

      if (response.data.response) {
        await handlePlayResponse(
          response.data.response,
          !!response.data.audioBlob
        );
      }

      // Wait for the audio to finish playing before proceeding
      // await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust delay as needed

      setConversation((prev) => [...prev.slice(0, -1), newChat]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (isSpeaking) {
      audioElement?.pause();
      setIsSpeaking(false);
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });

        try {
          setIsProcessing(true);

          const formData = new FormData();
          formData.append("file", blob, "recorded_audio.mp3");

          const response = await axios.post(
            "https://chat.fagoondigital.com/api/prompt/",
            formData
          );

          const newChat: ChatMessage = {
            prompt: "",
            response: response.data.response,
            user_prompt: response.data.user_prompt,
            audioBlob: blob,
          };

          setConversation((prev) => [...prev, newChat]);

          if (response.data.response) {
            handlePlayResponse(
              response.data.response,
              !!response.data.audioBlob
            );
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
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
    setIsRecording(false);
  };

  const handleCopyResponse = (response: string) => {
    navigator.clipboard.writeText(response);
    setCopiedMessage("Copied!");
    setTimeout(() => {
      setCopiedMessage("");
    }, 2000);
    toast.success("Response copied to clipboard");
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
        className={`flex mt-14 flex-col justify-between md:h-screen h-fit `}
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
                    <span>{chat.user_prompt}</span>
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

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAudioToggle}
                        className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
                      >
                        {isSpeaking ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-pause"
                            width="20"
                            height="20"
                          >
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-play"
                            width="20"
                            height="20"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={handleCopyResponse.bind(null, chat.response)}
                        className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-copy"
                          width="20"
                          height="20"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15h11"></path>
                          <path d="M15 9V4h6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="text-center animate-pulse">
                Fagoon is processing your input ...
              </div>
            )}
          </div>
        )}
        <div
          className={`flex items-center bg-[#1C1F28] py-2 md:px-8 px-4 rounded-3xl fixed bottom-3 w-[95%] sm:w-[50%] h-[50px] ${
            isRecording ? "glow-purple" : ""
          }`}
        >
          <SearchIcon
            width={isSmallDevice ? "16" : "24"}
            height={isSmallDevice ? "16" : "24"}
          />
          <input
            className={`flex-1 bg-transparent text-white placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm ${
              isRecording ? "" : "glow-purple"
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
            <button onClick={isRecording ? stopRecording : startRecording}>
              <MicIcon
                className={`cursor-pointer ${
                  isRecording ? "text-red-500" : ""
                }`}
                width={iconSize.toString()}
                height={iconSize.toString()}
                isRecording={isRecording}
              />
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
