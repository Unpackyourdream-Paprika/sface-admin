"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  mem_email: z.string().min(2, "아이디는 최소 2자 이상이어야 합니다."),
  mem_password: z.string().min(2, "비밀번호는 최소 2자 이상이어야 합니다."),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mem_email: "",
      mem_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:3000/v1/auth/authorize",
        values
      );

      console.log(response, "response?");

      if (response.status === 200) {
        const { accessToken, refreshToken, accessTokenExpiry, userInfo } =
          response.data;

        sessionStorage.setItem("at", accessToken);
        sessionStorage.setItem("rt", refreshToken);
        sessionStorage.setItem("attime", accessTokenExpiry);
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

        console.log("로그인 성공:", userInfo);
        alert("로그인 완료");
        router.push("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <section className="w-full h-screen ">
      <div className="w-full h-screen flex justify-center items-center">
        <div></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mem_email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mem_password"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>PASSWORD</FormLabel>
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
      </div>
    </section>
  );
}
