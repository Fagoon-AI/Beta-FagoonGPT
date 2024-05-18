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
import { login, signup } from "@/services/authService";
import { useRouter } from "next/navigation";
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
});

export type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/");
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await login(values);
      if (response.status === 201) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.access_token)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.data.refresh_token)
        );
        router.push("/");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-6 bg-transparent rounded-lg shadow-lg">
        <h1 className="md:text-2xl text-xl bg-gradient-to-br from-[#B664DB] via-[#DDDDDD] to-[#FF3F9B] bg-clip-text text-transparent">
          Fagoon
        </h1>
        <h2 className="mt-4 text-2xl">Login to your account</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-8"
          >
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
        <p className="mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-200 hover:cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
        <p className="mt-4 text-sm text-center">
          Forgot Password?{" "}
          <span
            className="text-blue-200 hover:cursor-pointer"
            onClick={() => router.push("/forgot")}
          >
            Click Here
          </span>
        </p>
      </div>
    </div>
  );
}
