"use client";
import ChatPage from "@/components/pages/Chat";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "undefined") {
      return redirect("/login");
    }
  }, []);
  return <ChatPage />;
}
