"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, signup } from "@/services/authService";
import { toast } from "sonner";

export default function ForgotPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <form className="flex flex-col items-center w-full max-w-md">
        <Input type="email" placeholder="Enter your email" className="mb-4" />
        <Button type="submit" className="px-6 py-2">
          Submit
        </Button>
      </form>
    </div>
  );
}
