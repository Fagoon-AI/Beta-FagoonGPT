"use client";
import ChatPage from "@/components/pages/Chat";
import { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "undefined") {
      redirect("/login");
      return;
    }
  }, [router]);

  return <ChatPage />;
}
