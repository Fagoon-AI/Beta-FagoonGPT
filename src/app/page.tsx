import ChatInput from "@/components/ChatInput";
import TextBox from "@/components/TextBox";
import BusinessIcon from "@/components/icons/Business";
import CodeIcon from "@/components/icons/Code";
import CorrectIcon from "@/components/icons/Correct";
import EmailIcon from "@/components/icons/Email";
import PoemIcon from "@/components/icons/Poem";
import RecipeIcon from "@/components/icons/Recipe";
import SolveIcon from "@/components/icons/Solve";
import SummarizeIcon from "@/components/icons/Summarize";
import TranslateIcon from "@/components/icons/Translate";

export default function Home() {
  return (
    <main className="flex flex-col py-7 justify-between h-screen">
      <div className="flex flex-col gap-8 overflow-y-auto scrollbar-none mb-4">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl bg-gradient-to-br from-[#B664DB] via-[#DDDDDD] to-[#FF3F9B] bg-clip-text text-transparent">
            Fagoon
          </h1>
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] via-[#D96570] via-[#D96570] via-[#9B72CB] via-[#4285F4] via-[#9B72CB] via-[#D96570] to-[#131314] bg-clip-text text-transparent">
              Hello, ashbin
            </h1>
            <h2 className="text-5xl">How can I help you today?</h2>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <span className="text-xl">You Might Want To Try</span>
          <div className="flex overflow-x-auto max-w-[619px] scrollbar-none">
            <div className="flex items-center justify-between gap-3">
              <TextBox label="Write a poem">
                <PoemIcon />
              </TextBox>
              <TextBox label="Translate anything">
                <TranslateIcon />
              </TextBox>
              <TextBox label="Write a code">
                <CodeIcon />
              </TextBox>
              <TextBox label="Write an email">
                <EmailIcon />
              </TextBox>
              <TextBox label="Give me recipe">
                <RecipeIcon />
              </TextBox>
              <TextBox label="Correct text">
                <CorrectIcon />
              </TextBox>
              <TextBox label="Solve a problem">
                <SolveIcon />
              </TextBox>
              <TextBox label="Business ideas">
                <BusinessIcon />
              </TextBox>
              <TextBox label="Summarize text">
                <SummarizeIcon />
              </TextBox>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="text-xl">Recent</h2>
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
