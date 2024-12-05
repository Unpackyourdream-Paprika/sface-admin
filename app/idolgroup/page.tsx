"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

interface IdolGroupImage {
  attach_file_path: string;
}

interface IdolGroup {
  group_idx: number;
  group_name: string;
  group_debut_date: string;
  group_company: string;
  group_num_peoples: number;
  group_status: "Y" | "N" | "H";
  group_genre: string;
  group_official_website?: string;
  group_img?: number;
  group_created_at?: string;
  group_updated_at?: string;
  image?: IdolGroupImage;
}

export default function IdolGroupPage() {
  const [groups, setGroups] = useState<IdolGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchGroups() {
    try {
      const response = await axios.get("http://localhost:3000/v1/idolgroup");

      console.log(response, "response?");

      setGroups(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch idol groups");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full max-w-screen-2xl p-6">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">번호</TableHead>
            <TableHead>그룹명</TableHead>
            <TableHead>소속사</TableHead>
            <TableHead>데뷔일</TableHead>
            <TableHead>멤버 수</TableHead>
            <TableHead>장르</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.group_idx}>
              <TableCell className="font-medium">{group.group_idx}</TableCell>
              <TableCell>{group.group_name}</TableCell>
              <TableCell>{group.group_company}</TableCell>
              <TableCell>
                {new Date(group.group_debut_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{group.group_num_peoples}</TableCell>
              <TableCell>{group.group_genre}</TableCell>
              <TableCell>{group.group_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
