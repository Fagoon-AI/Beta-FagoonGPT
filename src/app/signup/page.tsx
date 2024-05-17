"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/form";
import { Input } from "@/app/ui/input";
import { signup } from "@/services/authService";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import AddIcon from "@/app/icons/Add";
import "./globals.css";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  full_name: z.string(),
  username: z.string(),
  profile_picture: z.any().optional(),
  description: z.enum(["student", "professional", "other"]), // Define the schema for the dropdown options
});

export type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      full_name: "",
      profile_picture: null,
      description: "student", // Set default value for description
    },
  });

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      redirect("/");
    }
  }, []);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("full_name", values.full_name);
      formData.append("username", values.username);
      formData.append("description", values.description); // Append description to form data
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const response = await signup(formData);
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
    <div className="flex flex-col justify-center py-5 overflow-y-auto h-screen hide-scrollbar">
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
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </FormControl>
            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What describes you?</FormLabel>
                <FormControl
                  style={{ border: "1px solid #1E293B", padding: "20px" }}
                >
                  <select
                    {...field}
                    className="block w-full rounded-md border-#1E293B-300 shadow-sm focus:border-#1E293B-300   text-white"
                    style={{
                      backgroundColor: "#020817",
                      color: "white",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      outline: "none",
                      appearance: "none",
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="professional">Professional</option>
                    <option value="other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <span
          className="text-blue-200 hover:cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
}
