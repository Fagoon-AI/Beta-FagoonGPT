import { useState } from "react";
<<<<<<< HEAD
import ClipboardIcon from "./icons/CipboardIcon";
import PauseIcon from "./icons/PauseIcon";
import PlayIcon from "./icons/SoundIcon";
import { ChatMessage } from "./pages/Chat";
=======
import ClipboardIcon from "@/components/icons/CipboardIcon";
import PauseIcon from "@/components/icons/PauseIcon";
import PlayIcon from "@/components/icons/PlayIcon";
import { ChatMessage } from "@/components/pages/Chat";
>>>>>>> fagoongpt/master

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
