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
import PauseIcon from "../icons/PauseIcon";
import PlayIcon from "../icons/PlayIcon";
import ClipboardIcon from "../icons/CipboardIcon";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import SendIcon from "../icons/SendIcon";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export interface ChatMessage {
  prompt: string;
  response: string | null;
  user_prompt?: string;
  audioBlob?: Blob | null;
  isAudioPlaying: boolean;
}

// Define the props type for the code block component
type CodeProps = {
  node: any;
  inline: boolean;
  className: string;
  children: React.ReactNode;
  [key: string]: any;
};

export default function ChatPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isSpeaking = conversation.some((chat) => chat.isAudioPlaying);
  const isSmallDevice = useSmallDevices();
  const lastChatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [scroll, setScroll] = useState(false);

  const setSpeakingFalse = () => {
    setConversation((prev) =>
      prev.map((chat) => ({ ...chat, isAudioPlaying: false }))
    );
    setScroll(false);
  };

  const setSpeakingTrue = (index: number) => {
    setConversation((prev) =>
      prev.map((chat, i) => ({ ...chat, isAudioPlaying: i === index }))
    );
    setScroll(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handlePlayResponse = async (chat: ChatMessage, index: number) => {
    if (isSpeaking) {
      audioElement?.pause();
      setSpeakingFalse();
    }

    if (typeof chat.response === "string" && !isSpeaking && !isProcessing) {
      try {
        setIsProcessing(true);

        const audioResponse = await axios.post(
          "https://gpt.aifagoon.com/api/fagoonchat_audio/",
          { chat: chat.response },
          { responseType: "blob" }
        );

        const audioBlob = new Blob([audioResponse.data], {
          type: "audio/mpeg",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newAudio = new Audio(audioUrl);

        await new Promise((resolve) => setTimeout(resolve, 100));

        setAudioElement(newAudio);
        setSpeakingTrue(index);
        newAudio.play();
        newAudio.onended = () => {
          setSpeakingFalse();
        };
      } catch (error) {
        console.error("Error fetching and playing audio:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      setSpeakingFalse();
    }
  };

  const handleAudioToggle = (chat: ChatMessage, index: number) => {
    if (isSpeaking) {
      audioElement?.pause();
      setSpeakingFalse();
    } else {
      handlePlayResponse(chat, index);
    }
  };

  const handleSubmit = async (prompt?: string) => {
    setInputText("");
    if (!prompt && inputText.trim() === "") return;

    const newChat: ChatMessage = {
      prompt: prompt || inputText,
      response: null,
      isAudioPlaying: false,
    };

    setConversation((prev) => [...prev, newChat]);
    setScroll(true);

    try {
      setIsProcessing(true);

      const response = await axios.post(
        "https://gpt.aifagoon.com/api/prompt/",
        { prompt: prompt || inputText }
      );

      newChat.response = response.data.response;
      newChat.user_prompt = response.data.user_prompt;

      setConversation((prev) => [...prev.slice(0, -1), newChat]);
      setScroll(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    if (isSpeaking) {
      audioElement?.pause();
      setSpeakingFalse();
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
            "https://gpt.aifagoon.com/api/prompt/",
            formData
          );

          const newChat: ChatMessage = {
            prompt: "",
            response: response.data.response,
            user_prompt: response.data.user_prompt,
            audioBlob: blob,
            isAudioPlaying: false,
          };

          setConversation((prev) => [...prev, newChat]);
          setScroll(true);

          if (response.data.response) {
            handlePlayResponse(response.data, conversation.length);
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
    toast.success("Response copied to clipboard");
  };

  useEffect(() => {
    if (lastChatRef.current && scroll) {
      lastChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  const iconSize = isSmallDevice ? "24" : "32";

  return (
    <div className="mt-14">
      <Navbar />
      <main className={`flex flex-col justify-between h-100dvh`}>
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
                {chat.response ? (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-semibold">Fagoon:</span>
                    <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }: CodeProps) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={materialDark as any}  // Cast to 'any' to ensure type compatibility
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {chat.response.replace(/\n/g, "  \n")}
                      </ReactMarkdown>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAudioToggle(chat, index)}
                        className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
                      >
                        {chat.isAudioPlaying ? <PauseIcon /> : <PlayIcon />}
                      </button>

                      <button
                        onClick={handleCopyResponse.bind(null, chat.response)}
                        className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
                      >
                        <ClipboardIcon />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-[95%] mx-auto flex flex-col gap-2">
                    <Skeleton className="w-full h-[20px]" />
                    <Skeleton className="w-full h-[20px]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div
          className={cn(
            "flex items-center bg-[#1C1F28] py-2 md:px-8 px-4 rounded-3xl fixed bottom-3 w-[95%] lg:w-[50%]  h-[50px]",
            isRecording ? "glow-purple" : ""
          )}
        >
          <SearchIcon
            width={isSmallDevice ? "16" : "24"}
            height={isSmallDevice ? "16" : "24"}
          />
          <input
            className={cn(
              "flex-1 bg-transparent text-white placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm",
              isRecording ? "" : "glow-purple"
            )}
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
            <button onClick={isRecording ? stopRecording : startRecording}>
              <MicIcon
                className={cn(
                  "cursor-pointer ",
                  isRecording ? "text-red-500" : ""
                )}
                width={iconSize.toString()}
                height={iconSize.toString()}
                isRecording={isRecording}
              />
            </button>
            <button
              onClick={() => {
                handleSubmit();
              }}
            >
              <SendIcon
                className="cursor-pointer"
                width={iconSize}
                height={iconSize}
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}