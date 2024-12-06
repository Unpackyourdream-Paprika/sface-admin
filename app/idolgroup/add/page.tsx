"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function IdolGroupAddPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    group_name: "",
    group_name_eng: "",
    group_debut_date: "",
    group_company: "",
    group_num_peoples: "",
    group_status: "Y",
    group_genre: "",
    group_active_status: "Y",
    group_team_type: "S",
    group_official_website: "",
    file: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleChange = (key: string, value: string | File | null) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value); // 파일 추가
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as string); // 일반 데이터 추가
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/idolgroup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      router.push("/idolgroup");
    } catch (error) {
      console.error("Failed to add idol group:", error);
    }
  };

  return (
    <section className="w-full max-w-screen-lg ">
      <div className="mb-4">
        <Button onClick={() => router.back()} variant="secondary">
          돌아가기
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">아이돌 그룹 추가</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">사진</label>
            <div
              className="relative w-[300px] h-[300px] border border-gray-300 rounded-md overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="그룹 이미지 미리보기"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 text-sm">사진 클릭 후 선택</span>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                  handleChange("file", file);
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">그룹명</label>
            <Input
              value={form.group_name}
              onChange={(e) => handleChange("group_name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">그룹 영문명</label>
            <Input
              value={form.group_name_eng}
              onChange={(e) => handleChange("group_name_eng", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">데뷔일</label>
            <Input
              type="date"
              value={form.group_debut_date}
              onChange={(e) => handleChange("group_debut_date", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">소속사</label>
            <Input
              value={form.group_company}
              onChange={(e) => handleChange("group_company", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">멤버 수</label>
            <Input
              type="number"
              value={form.group_num_peoples}
              onChange={(e) =>
                handleChange("group_num_peoples", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium">장르</label>
            <Input
              value={form.group_genre}
              onChange={(e) => handleChange("group_genre", e.target.value)}
            />
          </div>

          {/* 그룹 활동 */}
          <div>
            <label className="block text-sm font-medium">그룹 활동</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {form.group_active_status === "Y"
                    ? "활동중"
                    : form.group_active_status === "H"
                    ? "해체"
                    : "휴식"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>그룹 활동 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={form.group_active_status === "Y"}
                  onCheckedChange={() =>
                    handleChange("group_active_status", "Y")
                  }
                >
                  활동중
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={form.group_active_status === "H"}
                  onCheckedChange={() =>
                    handleChange("group_active_status", "H")
                  }
                >
                  해체
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={form.group_active_status === "N"}
                  onCheckedChange={() =>
                    handleChange("group_active_status", "N")
                  }
                >
                  휴식
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 그룹 타입 */}
          <div>
            <label className="block text-sm font-medium">그룹 타입</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {form.group_team_type === "S" ? "솔로" : "팀"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>그룹 타입 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={form.group_team_type === "S"}
                  onCheckedChange={() => handleChange("group_team_type", "S")}
                >
                  솔로
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={form.group_team_type === "T"}
                  onCheckedChange={() => handleChange("group_team_type", "T")}
                >
                  팀
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <label className="block text-sm font-medium">공식사이트</label>
            <Input
              value={form.group_official_website}
              onChange={(e) =>
                handleChange("group_official_website", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="secondary"
            >
              취소
            </Button>
            <Button type="submit">추가</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
