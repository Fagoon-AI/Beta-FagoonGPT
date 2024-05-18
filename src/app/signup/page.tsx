"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signup } from "@/services/authService";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  full_name: z.string(),
  username: z.string(),
});

export type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      full_name: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      redirect("/");
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await signup(values);
      if (response.status === 201) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.access_token)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.data.refresh_token)
        );
      }
      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="flex flex-col justify-center py-5">
      <h1 className="md:text-2xl text-xl bg-gradient-to-br from-[#B664DB] via-[#DDDDDD] to-[#FF3F9B] bg-clip-text text-transparent">
        Fagoon
      </h1>
      <h2 className="mt-4 text-2xl">Signup to chat with FagoonGPT</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="mt-4 text-sm">
        Already have an account ?{" "}
        <span
          className="text-blue-200 hover:cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
      <p className="mt-4 text-sm ">
        Forgot Password?{" "}
        <span
          className="text-blue-200 hover:cursor-pointer"
          onClick={() => router.push("/forgot")}
        >
          Click Here
        </span>
      </p>
    </div>
  );
}
