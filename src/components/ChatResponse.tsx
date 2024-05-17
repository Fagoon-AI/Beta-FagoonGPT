import { useState } from "react";
import ClipboardIcon from "../app/icons/CipboardIcon";
import PauseIcon from "../app/icons/PauseIcon";
import PlayIcon from "../app/icons/SoundIcon";
import { ChatMessage } from "./pages/Chat";

interface IChatResponseProps {
  chat: ChatMessage;
  handleCopyResponse: (response: string) => void;
  audioElement: HTMLAudioElement | null;
  setAudioElement: (audio: HTMLAudioElement) => void;
}

export default function ChatResponse({
  chat,
  handleCopyResponse,
  audioElement,
}: IChatResponseProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAudioToggle = () => {
    if (isSpeaking) {
      audioElement?.pause();
      setIsSpeaking(false);
    } else {
      audioElement?.play();
      setIsSpeaking(true);
    }
  };

  return (
    <div className="flex flex-col gap-1 px-4 rounded-lg">
      <span className="font-semibold">Fagoon:</span>
      <span>{chat.response}</span>

      <div className="flex items-center gap-2">
        <button
          onClick={handleAudioToggle}
          className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
        >
          {isSpeaking ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={handleCopyResponse.bind(null, chat.response!)}
          className="flex items-center justify-center w-8 h-8 bg-transparent rounded-full cursor-pointer relative"
        >
          <ClipboardIcon />
        </button>
      </div>
    </div>
  );
}
