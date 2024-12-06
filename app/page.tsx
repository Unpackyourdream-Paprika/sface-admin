"use client";

import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";
export default function Home() {
  const accessToken =
    typeof window !== "undefined" ? sessionStorage.getItem("at") : null;

  if (!accessToken) {
    redirect("/login");
  }

  return <div>Main</div>;
}
