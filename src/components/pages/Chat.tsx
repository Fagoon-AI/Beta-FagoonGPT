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
import SoundIcon from "../icons/SoundIcon";
import RemoveIcon from "../icons/Remove";
import AddIcon from "../icons/Add";
import ClipboardIcon from "../icons/CipboardIcon";
import CopyIcon from "../icons/CopyIcon";
import { Skeleton } from "../ui/skeleton";
import PulseIcon from "../icons/Pulse";
import { cn } from "@/lib/utils";
import SendIcon from "../icons/SendIcon";
import "./ChatPage.module.css";
import LoadingAnimation from "../ui/loading";

import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
export interface ChatMessage {
  prompt: string;
  response: string | null;
  user_prompt?: string;
  audioBlob?: Blob | null;
  isAudioPlaying: boolean;
  uploadedFileNames?: string[];
}

const Equalizer: React.FC<{ audioLevel: number }> = ({ audioLevel }) => {
  const lines = 5;
  const lineHeight = 6;
  const [maxChatBoxHeight, setMaxChatBoxHeight] = useState(500);
  return (
    <div className="equalizer flex items-end gap-1">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="equalizer-line"
          style={{
            height: `${
              Math.floor(Math.random() * audioLevel * 0.8) + lineHeight
            }px`,
            backgroundColor: "#6C63FF",
            width: "4px",
            marginLeft: "2px",
            animation: "equalizer 0.5s infinite alternate",
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function ChatPage() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [showWave, setShowWave] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const isSpeaking = conversation.some((chat) => chat.isAudioPlaying);
  const isSmallDevice = useSmallDevices();
  const lastChatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(analyzeAudioLevel)
      .catch((error) => console.error("Error accessing microphone:", error));

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  const [scroll, setScroll] = useState(false);

  // Define the props type for the code block component
  type CodeProps = {
    node: any;
    inline: boolean;
    className: string;
    children: React.ReactNode;
    [key: string]: any;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const fileNames = Array.from(files).map((file) => file.name);
        setUploadedFiles(Array.from(files));
        console.log("Uploaded Files:", fileNames);
      } catch (error) {
        console.error("Error handling file upload:", error);
      }
    }
  };

  const toggleMic = () => {
    setMicActive((prev) => !prev);
    setInputText("");
    setUploadedFiles([]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prevUploadedFiles) => {
      const newUploadedFiles = [...prevUploadedFiles];
      newUploadedFiles.splice(index, 1);
      return newUploadedFiles;
    });
  };
  const analyzeAudioLevel = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    microphone.connect(analyzer);

    const data = new Uint8Array(analyzer.frequencyBinCount);

    const updateAudioLevel = () => {
      analyzer.getByteFrequencyData(data);
      const average = data.reduce((acc, val) => acc + val, 0) / data.length;
      setAudioLevel(average);
      requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };
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
      setUploadedFiles([]);
    }
  };

  const startRecording = async () => {
    if (isSpeaking) {
      audioElement?.pause();
      setSpeakingFalse();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      analyzeAudioLevel(stream);
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
      setInputText("");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const glowIntensity = Math.min(1, audioLevel / 100);
  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) {
      console.error("No recording in progress.");
      return;
    }

    mediaRecorder.stop();
    setIsRecording(false);
    setInputText("");
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
          <div className="flex flex-col gap-6 overflow-y-auto scrollbar-none min-h-[100px] max-h-[500px]">
            {conversation.map((chat, index) => (
              <div
                key={index}
                className="flex flex-col gap-4"
                ref={index === conversation.length - 1 ? lastChatRef : null}
              >
                {chat.audioBlob && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">You:</span>
                    <span>{chat.user_prompt}</span>
                  </div>
                )}
                {chat.prompt && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">You:</span>
                    <span>{chat.prompt}</span>
                  </div>
                )}
                {chat.prompt === "Uploaded Files:" && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    {uploadedFiles.map((file, i) => (
                      <span key={i}>{file.name}</span>
                    ))}
                  </div>
                )}
                {chat.response ? (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">FagoonGPT:</span>
                    <span>
                      {" "}
                      <ReactMarkdown
                        components={
                          {
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: CodeProps) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              const codeContent = String(children).replace(
                                /\n$/,
                                ""
                              );

                              const handleCopyCode = () => {
                                navigator.clipboard.writeText(codeContent);
                                toast.success("Code copied to clipboard");
                              };

                              return !inline && match ? (
                                <div className="relative">
                                  <SyntaxHighlighter
                                    style={materialDark as any}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {codeContent}
                                  </SyntaxHighlighter>
                                  <span className="absolute top-2 right-10 p-1  text-white text-sm ">
                                    Copy
                                  </span>
                                  <button
                                    onClick={handleCopyCode}
                                    className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white text-sm focus:outline-none hover:bg-gray-600"
                                  >
                                    <CopyIcon />
                                  </button>
                                </div>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          } as any
                        }
                      >
                        {chat.response.replace(/\n/g, "  \n")}
                      </ReactMarkdown>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAudioToggle(chat, index)}
                        className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
                      >
                        {chat.isAudioPlaying ? <PauseIcon /> : <SoundIcon />}
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
            "flex items-center bg-[#1C1F28] py-2 md:px-8 px-4 rounded-3xl fixed bottom-3 w-[95%] lg:w-[50%] h-[50px]",
            isRecording ? "glow-purple pulse" : "",
            micActive ? "" : ""
          )}
          style={{
            boxShadow: isRecording
              ? `0 0 ${audioLevel}px 2px rgba(0, 255, 0, ${glowIntensity})`
              : "",
          }}
        >
          {isRecording ? (
            <LoadingAnimation />
          ) : (
            uploadedFiles.length === 0 && (
              <label htmlFor="file-upload" className="cursor-pointer">
                <AddIcon
                  width={isSmallDevice ? "16" : "24"}
                  className="cursor-pointer"
                  height={isSmallDevice ? "16" : "24"}
                />
              </label>
            )
          )}

          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          {!micActive && !isRecording && uploadedFiles.length > 0 && (
            <div className="rounded-lg p-2 max-w-[200px] max-h-[100px] overflow-hidden border border-gray-300">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RemoveIcon onClick={() => handleRemoveFile(index)} />
                  <span
                    className="file-name"
                    style={{
                      fontWeight: 400,
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <input
            className="flex-1 bg-transparent placeholder-white focus:outline-none md:ml-5 ml-2 text-xs md:text-sm"
            placeholder={isRecording ? "" : "What are you looking for?"}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            disabled={micActive || isRecording}
            style={{ color: "#BBC1C5" }}
          />

          <div className="flex items-center gap-2">
            <div
              className={cn("mic-animation", isRecording ? "listening" : "")}
            ></div>{" "}
            <button onClick={isRecording ? stopRecording : startRecording}>
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <SendIcon
                    className={`mic-icon cursor-pointer ${
                      micActive ? "glow-high" : ""
                    }`}
                    width={iconSize.toString()}
                    height={iconSize.toString()}
                  />
                </div>
              ) : (
                <MicIcon
                  className={`mic-icon cursor-pointer ${
                    micActive ? "glow-high" : ""
                  }`}
                  width={iconSize.toString()}
                  height={iconSize.toString()}
                />
              )}
            </button>
            {!isRecording && (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
