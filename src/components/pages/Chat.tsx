"use client";

import { useSmallDevices } from "@/hooks/useSmallDevices";
import TextBox from "../TextBox";
import PoemIcon from "../icons/Poem";
import TranslateIcon from "../icons/Translate";
import CodeIcon from "../icons/Code";
import EmailIcon from "../icons/Email";
import RecipeIcon from "../icons/Recipe";
import CorrectIcon from "../icons/Correct";
import SolveIcon from "../icons/Solve";
import BusinessIcon from "../icons/Business";
import SummarizeIcon from "../icons/Summarize";
import ChatInput from "../ChatInput";

export default function ChatPage() {
  const isSmallDevice = useSmallDevices();
  const iconSize = isSmallDevice ? "28" : "40";
  return (
    <main className="flex flex-col py-7 justify-between md:h-screen h-fit">
      <div className="flex flex-col md:gap-8 gap-6 overflow-y-auto scrollbar-none mb-4">
        <div className="flex flex-col md:gap-8 gap-6">
          <h1 className="md:text-2xl text-xl bg-gradient-to-br from-[#B664DB] via-[#DDDDDD] to-[#FF3F9B] bg-clip-text text-transparent">
            Fagoon
          </h1>
          <div className="flex flex-col gap-1">
            <h1 className="md:text-5xl text-2xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] via-[#D96570] via-[#D96570] via-[#9B72CB] via-[#4285F4] via-[#9B72CB] via-[#D96570] to-[#131314] bg-clip-text text-transparent">
              Hello, this is FagoonGPT
            </h1>
            <h2 className="md:text-5xl text-2xl">How can I help you today?</h2>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <span className="md:text-xl text-lg">You Might Want To Try</span>
          <div className="flex overflow-x-auto max-w-full scrollbar-none">
            <div className="flex items-center justify-between gap-3">
              <TextBox label="Write a poem">
                <PoemIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Translate anything">
                <TranslateIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Write a code">
                <CodeIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Write an email">
                <EmailIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Give me recipe">
                <RecipeIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Correct text">
                <CorrectIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Solve a problem">
                <SolveIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Business ideas">
                <BusinessIcon width={iconSize} height={iconSize} />
              </TextBox>
              <TextBox label="Summarize text">
                <SummarizeIcon width={iconSize} height={iconSize} />
              </TextBox>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="md:text-xl text-lg">Recent</h2>
          <div className="flex flex-col gap-3">
            <TextBox label="Job finder UX"></TextBox>
            <TextBox label="Graphic design copy"></TextBox>
            <TextBox label="Job finder UX"></TextBox>
          </div>
        </div>
      </div>
      <ChatInput />
    </main>
  );
}
