import { useSmallDevices } from "@/hooks/useSmallDevices";
import TextBox from "../TextBox";
import BusinessIcon from "../icons/Business";
import CodeIcon from "../icons/Code";
import CorrectIcon from "../icons/Correct";
import EmailIcon from "../icons/Email";
import PoemIcon from "../icons/Poem";
import RecipeIcon from "../icons/Recipe";
import SolveIcon from "../icons/Solve";
import SummarizeIcon from "../icons/Summarize";
import TranslateIcon from "../icons/Translate";

interface IShowcaseProps {
  handleSubmit: (prompt?: string) => void;
}

export default function Showcase({ handleSubmit }: IShowcaseProps) {
  const isSmallDevice = useSmallDevices();
  const iconSize = isSmallDevice ? "28" : "40";
  return (
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
            <TextBox label="Write a poem" handleSubmit={handleSubmit}>
              <PoemIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Translate anything" handleSubmit={handleSubmit}>
              <TranslateIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Write a code" handleSubmit={handleSubmit}>
              <CodeIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Write an email" handleSubmit={handleSubmit}>
              <EmailIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Give me recipe" handleSubmit={handleSubmit}>
              <RecipeIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Correct text" handleSubmit={handleSubmit}>
              <CorrectIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Solve a problem" handleSubmit={handleSubmit}>
              <SolveIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Business ideas" handleSubmit={handleSubmit}>
              <BusinessIcon width={iconSize} height={iconSize} />
            </TextBox>
            <TextBox label="Summarize text" handleSubmit={handleSubmit}>
              <SummarizeIcon width={iconSize} height={iconSize} />
            </TextBox>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="md:text-xl text-lg">Recent</h2>
        <div className="flex flex-col gap-3">
          <TextBox label="Job finder UX" handleSubmit={handleSubmit}></TextBox>
          <TextBox
            label="Graphic design copy"
            handleSubmit={handleSubmit}
          ></TextBox>
          <TextBox label="Job finder UX" handleSubmit={handleSubmit}></TextBox>
        </div>
      </div>
    </div>
  );
}
