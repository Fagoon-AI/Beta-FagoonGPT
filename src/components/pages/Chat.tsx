import Showcase from "./showcase";
import React, { useState, useEffect, useRef } from "react";
import FilesIcon from "../icons/Files";
import MicIcon from "../icons/Mic";
import SearchIcon from "../icons/Search";
import Navbar from "../ui/nav";
import axios from "axios";
import { useSmallDevices } from "@/hooks/useSmallDevices";
import { toast } from "sonner";
import PdfIcon from "../icons/Pdf";
import PauseIcon from "../icons/PauseIcon";
import SoundIcon from "../icons/SoundIcon";
import RemoveIcon from "../icons/Remove";
import AddIcon from "../icons/Add";
import ClipboardIcon from "../icons/CipboardIcon";
import { Skeleton } from "../ui/skeleton";
import PulseIcon from "../icons/Pulse";
import { cn } from "@/lib/utils";
import SendIcon from "../icons/SendIcon";
import "./ChatPage.module.css";
import AddFileIcon from "../icons/AddFile";
import LoadingAnimation from "../ui/loading";
export interface ChatMessage {
  prompt: string;
  response: string | null;
  imageUrl?: string;
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
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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
    setConversation((prev: any) =>
      prev.map((chat: any, i: any) => ({
        ...chat,
        isAudioPlaying: i === index,
      }))
    );
    setScroll(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputText(input);
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
    const input = prompt || inputText;
    setInputText("");

    if (!input && uploadedFiles.length === 0) {
      toast.error("Please enter a message or upload a file.");
      return;
    }

    const newChat: ChatMessage = {
      prompt: input,
      response: null,
      isAudioPlaying: false,
    };

    setConversation((prev) => [...prev, newChat]);
    setScroll(true);

    try {
      setIsProcessing(true);

      if (input.toLowerCase().includes("imagine a photo")) {
        const response = await axios.post(
          "https://gpt.aifagoon.com/imagine/a/photo",
          { prompt: input },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        newChat.imageUrl = response.data.imageUrl;
      } else {
        let requestBody;
        let contentType;
        if (uploadedFiles.length > 0) {
          const formData = new FormData();
          formData.append("prompt", input);
          uploadedFiles.forEach((file) => {
            formData.append("document", file);
          });
          requestBody = formData;
          contentType = "multipart/form-data";
        } else {
          requestBody = { prompt: input };
          contentType = "application/json";
        }

        const response = await axios.post(
          "https://gpt.aifagoon.com/api/prompt/",
          requestBody,
          {
            headers: {
              "Content-Type": contentType,
            },
          }
        );

        newChat.response = response.data.response;
        newChat.user_prompt = response.data.user_prompt;
        newChat.uploadedFileNames = uploadedFiles.map((file) => file.name);
      }

      setConversation((prev) => [...prev.slice(0, -1), newChat]);
      setScroll(true);

      setUploadedFiles([]);
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
      setMicActive(true);
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
    setMicActive(false);
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
    <div className="mt-14" style={{ fontFamily: "Poppins" }}>
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
                    <span style={{ fontWeight: 100, fontSize: "small" }}>
                      {chat.user_prompt}
                    </span>
                    {chat.uploadedFileNames &&
                      chat.uploadedFileNames.length > 0 && (
                        <div className="flex flex-col gap-1 px-4 rounded-lg">
                          {chat.uploadedFileNames.map((fileName, i) => (
                            <span
                              key={i}
                              style={{ fontWeight: 100, fontSize: "small" }}
                            >
                              {fileName}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                )}
                {chat.prompt && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">You:</span>
                    <span style={{ fontWeight: 100, fontSize: "small" }}>
                      {chat.prompt}
                    </span>
                    {chat.uploadedFileNames &&
                      chat.uploadedFileNames.length > 0 && (
                        <div
                          className="flex flex-col gap-1 px-4 rounded-lg"
                          style={{
                            padding: "2px",
                            maxWidth: "30%",
                            border: "1px solid #393938",
                            overflowX: "auto",
                            marginTop: "10px",
                          }}
                        >
                          {chat.uploadedFileNames.map((fileName, i) => (
                            <div
                              key={i}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <PdfIcon />
                              <span
                                style={{
                                  fontWeight: 100,
                                  fontSize: "12px",
                                  marginLeft: "5px",
                                  maxWidth: "100%",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {fileName}
                                <p style={{ color: "#9B9A9A" }}> PDF</p>
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}
                {chat.prompt === "Uploaded Files:" && (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    {uploadedFiles.map((file, i) => (
                      <span
                        key={i}
                        style={{ fontWeight: 100, fontSize: "small" }}
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
                {chat.imageUrl ? (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">FagoonGPT:</span>
                    <img
                      src={chat.imageUrl}
                      alt="Generated"
                      style={{ maxWidth: "100%", height: "auto" }} // Ensure the image takes up space based on its aspect ratio
                    />
                  </div>
                ) : chat.response ? (
                  <div className="flex flex-col gap-1 px-4 rounded-lg">
                    <span className="font-bold">FagoonGPT:</span>
                    <span style={{ fontWeight: 100, fontSize: "small" }}>
                      {chat.response}{" "}
                      <img
                        src={chat.imageUrl}
                        alt="Generated"
                        style={{ maxWidth: "100%", height: "auto" }} // Ensure the image takes up space based on its aspect ratio
                      />
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
                <FilesIcon />
              </label>
            )
          )}
          <div
            className={`upload-container ${
              isFileUploading ? "uploading-animation" : ""
            }`}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            {!micActive && !isRecording && uploadedFiles.length > 0 && (
              <div
                style={{ border: "1px solid #393938", position: "relative" }}
                className="rounded-lg p-1  pr-5 max-w-[150px] max-h-[100px] overflow-hidden"
              >
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AddFileIcon />
                    <span
                      className="file-name"
                      style={{
                        fontWeight: 400,
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                      <br />
                      <p style={{ color: "#42464E", fontSize: "10px" }}>PDF</p>
                    </span>
                    <RemoveIcon
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        position: "absolute",
                        top: "-1px",
                        right: "-1px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
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
