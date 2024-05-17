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
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getCurrentUserAPI, refreshTokenAPI } from "@/services/authService";
import { redirect, useRouter } from "next/navigation";

interface IShowcaseProps {
  handleSubmit: (prompt?: string) => void;
}

export default function Showcase({ handleSubmit }: IShowcaseProps) {
  const isSmallDevice = useSmallDevices();
  const iconSize = isSmallDevice ? "28" : "40";
  const [username, setUsername] = useState<string>("");

  const router = useRouter();

  const getCurrentUser = async (accessToken: string) => {
    try {
      const response = await getCurrentUserAPI({ accessToken });
      setUsername(response.data.username);
      return response.data;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        return await handleUnauthorizedError(accessToken);
      }
      throw error;
    }
  };

  const handleUnauthorizedError = async (accessToken: string) => {
    let refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken || refreshToken === "undefined" || refreshToken === "") {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      return redirect("/login");
    }
    refreshToken = JSON.parse(refreshToken);
    try {
      const response = await refreshTokenAPI({ refreshToken } as {
        refreshToken: string;
      });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("accessToken", JSON.stringify(access_token));
      localStorage.setItem("refreshToken", JSON.stringify(refresh_token));
      const userData = await getCurrentUserAPI({ accessToken: access_token });
      return userData.data;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");
        router.push("/login");
        router.refresh();
        return null;
      }
    }
  };

  const isUnauthorizedError = (error: unknown) => {
    return (
      (error instanceof AxiosError && error.response?.status === 401) || 404
    );
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "undefined" || accessToken === "") {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      redirect("/login");
    } else {
      getCurrentUser(JSON.parse(accessToken));
    }
  }, []);

  return (
    <div className="flex flex-col md:gap-8 gap-6 overflow-y-auto scrollbar-none mb-4 w-[90%] mx-auto">
      <div className="flex flex-col md:gap-8 gap-6">
        <div className="flex flex-col gap-3">
          {username !== "" && (
            <h1 className="md:text-4xl text-2xl bg-gradient-to-r from-[#4285F4] via-[#9B72CB] via-[#D96570] via-[#D96570] via-[#9B72CB] via-[#4285F4] via-[#9B72CB] via-[#D96570] to-[#131314] bg-clip-text text-transparent">
              Hello, {username.split(" ")[0]}
            </h1>
          )}
          <h2 className="md:text-4xl text-2xl">How can I help you today?</h2>
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
