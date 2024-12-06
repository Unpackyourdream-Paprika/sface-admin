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

import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface User {
  // 사용자 데이터의 타입을 정의
  mem_idx: number;
  mem_name: string;
  mem_nickname: string;
  mem_phone: string;
  mem_ad_agree: string;
  mem_created_at: string;
  mem_deleted_at?: string;
  mem_email: string;
  mem_favorite_groups: number[];
  mem_favorite_artists: number[];
  mem_public_status: string;
  mem_shop_uuid: string;
  mem_soc_id?: number;
  mem_status: string;
  mem_updated_at: string;
  member_grade: number;
  member_profile_img?: number;
}

interface PaginationResponse {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

interface ApiResponse {
  data: User[];
  pagination: PaginationResponse;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { get, loading, error } = useFetch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const fetchUsers = async (page: number) => {
    const response = await get<ApiResponse>(
      `/v1/member/userList?page=${page}&limit=${itemsPerPage}`
    );

    console.log(response, "response??");
    if (response) {
      setUsers(response.data);
      setTotalItems(response.pagination.totalItems);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">번호</TableHead>
            <TableHead className="w-[100px]">그룹명</TableHead>
            <TableHead className="w-[120px]">소속사</TableHead>
            <TableHead className="w-[100px]">데뷔일</TableHead>
            <TableHead className="w-[100px]">멤버 수</TableHead>
            <TableHead className="w-[100px]">장르</TableHead>
            <TableHead className="w-[100px]">상태</TableHead>
            <TableHead className="w-[80px] pl-7">수정</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.mem_idx}>
              <TableCell>{user.mem_idx}</TableCell>
              <TableCell className="font-medium">{user.mem_nickname}</TableCell>
              <TableCell>{user.mem_shop_uuid}</TableCell>
              <TableCell>{user.mem_soc_id}</TableCell>
              {/* <TableCell>{user.mem_soc_id}</TableCell> */}
              <TableCell>
                {new Date(user.mem_created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{user.mem_status}</TableCell>
              <TableCell>{user.member_grade}</TableCell>

              <TableCell>
                <Button>수정</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }).map((_, index) => {
            if (
              index + 1 === 1 ||
              index + 1 === totalPages ||
              (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2)
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              (index === 1 && currentPage - 2 > 2) ||
              (index === totalPages - 2 && currentPage + 2 < totalPages - 1)
            ) {
              return (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </section>
  );
}
