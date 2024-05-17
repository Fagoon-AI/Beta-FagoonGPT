"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    // Remove authentication check and directly navigate to home page
    router.push("/");
  }, []);

  return null;
}
