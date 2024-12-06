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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface IdolGroupImage {
  attach_file_path: string;
}

interface IdolGroup {
  group_idx: number;
  group_name: string;
  group_name_eng: string;
  group_debut_date: string;
  group_company: string;
  group_num_peoples: number;
  group_status: "Y" | "N";
  group_active_status: "Y" | "N" | "H";
  group_team_type: "S" | "T";
  group_genre: string;
  group_official_website?: string;
  group_img?: number;
  group_created_at?: string;
  group_updated_at?: string;
  image?: IdolGroupImage;
}

export default function IdolGroupPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<IdolGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IdolGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  async function fetchGroups(page: number) {
    try {
      const response = await axios.get(
        "http://localhost:3000/v1/idolgroup/admin/idolList",
        {
          params: { page, limit: itemsPerPage },
        }
      );

      console.log(response, "response?");

      setGroups(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
      setCurrentPage(response.data.pagination.currentPage);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch idol groups");
      setIsLoading(false);
    }
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchGroups(page);
  }

  useEffect(() => {
    fetchGroups(currentPage);
  }, [currentPage]);

  const handleEdit = (group: IdolGroup) => {
    setSelectedGroup({
      ...group,
      group_num_peoples: group.group_num_peoples || 0,
      group_team_type: group.group_team_type || "S",
      group_active_status: group.group_active_status || "Y",
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedGroup(null);
    setIsDialogOpen(false);
    setPreviewUrl("");
    setSelectedFileName("");
    setSelectedFile(null);
  };

  // 그룹 수정 API 호출
  async function updateGroup(group: IdolGroup, file: File | null) {
    try {
      const formData = new FormData();

      // JSON 데이터를 FormData에 추가
      Object.entries(group).forEach(([key, value]) => {
        if (key === "image" && value) {
          // `image`는 `attach_file_path`만 추가
          formData.append("image", value.attach_file_path as string);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // 선택된 이미지 파일 추가
      if (file) {
        formData.append("file", file);
      }

      await axios.patch(
        `http://localhost:3000/v1/idolgroup/${group.group_idx}`,
        formData
      );
      setIsDialogOpen(false);
      setPreviewUrl("");
      setSelectedFileName("");
      setSelectedFile(null);
      fetchGroups(currentPage); // 목록 갱신
    } catch (err) {
      console.error("Failed to update group:", err);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // 메모리 해제
      }
    };
  }, [previewUrl]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <section className="w-full max-w-screen-2xl p-6">
      <div className="w-full flex justify-end pr-10">
        <Button
          onClick={() => router.push("/idolgroup/add")}
          className="mb-4 p-2"
        >
          그룹 추가하기
        </Button>
      </div>
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
              <TableCell>
                <Button onClick={() => handleEdit(group)}>수정</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isDialogOpen && selectedGroup && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            aria-describedby="dialog-description"
            className="fixed top-1/2 left-1/2 max-h-[500px]   w-full max-w-3xl transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white rounded-lg shadow-lg"
          >
            <DialogHeader>
              <DialogTitle>{selectedGroup.group_name} 수정</DialogTitle>
              <DialogDescription>
                여기에 다이얼로그 내용을 설명합니다.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedGroup) {
                  const transformedGroup = {
                    ...selectedGroup,
                    // group_debut_date를 MySQL DATETIME 형식으로 변환
                    group_debut_date: new Date(selectedGroup.group_debut_date)
                      .toISOString()
                      .slice(0, 19) // 'YYYY-MM-DDTHH:MM:SS' 형태를 자르기
                      .replace("T", " "), // MySQL DATETIME 형식으로 변환
                  };

                  updateGroup(transformedGroup, selectedFile);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">사진</label>
                <div
                  className="relative w-[300px] h-[300px] border border-gray-300 rounded-md overflow-hidden cursor-pointer flex items-center justify-center bg-gray-100"
                  onClick={() => document.getElementById("fileInput")?.click()} // 클릭 시 파일 선택 창 열기
                >
                  {selectedGroup?.image || previewUrl ? (
                    <Image
                      src={
                        previewUrl // 새로 선택한 파일이 있으면 미리보기 URL 사용
                          ? previewUrl
                          : `http://localhost:3000/${selectedGroup?.image}`
                      }
                      alt="그룹 이미지"
                      className="object-cover w-full h-full"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      사진 클릭 후 변경
                    </span>
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
                      // 선택한 파일의 로컬 URL 생성 및 상태 업데이트
                      const preview = URL.createObjectURL(file);
                      setSelectedGroup((prev) =>
                        prev
                          ? {
                              ...prev,
                              image: {
                                ...prev.image,
                                attach_file_path: preview,
                              },
                            }
                          : prev
                      );
                      setPreviewUrl(preview); // 미리보기 URL 업데이트
                      setSelectedFileName(file.name);
                      setSelectedFile(file);
                    }
                  }}
                />
                {selectedFileName && (
                  <p className="mt-2 text-sm text-gray-600">
                    선택된 파일: {selectedFileName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">그룹명</label>
                <Input
                  value={selectedGroup.group_name}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev ? { ...prev, group_name: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">그룹 영문</label>
                <Input
                  value={selectedGroup.group_name_eng}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev ? { ...prev, group_name_eng: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">그룹인원</label>
                <Input
                  value={selectedGroup.group_num_peoples}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev
                        ? {
                            ...prev,
                            group_num_peoples:
                              parseInt(e.target.value, 10) || 0,
                          }
                        : prev
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">그룹 타입</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedGroup.group_team_type === "S" ? "솔로" : "팀"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>그룹 타입 선택</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedGroup.group_team_type === "S"}
                      onCheckedChange={() =>
                        setSelectedGroup((prev) =>
                          prev ? { ...prev, group_team_type: "S" } : prev
                        )
                      }
                    >
                      솔로
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedGroup.group_team_type === "T"}
                      onCheckedChange={() =>
                        setSelectedGroup((prev) =>
                          prev ? { ...prev, group_team_type: "T" } : prev
                        )
                      }
                    >
                      팀
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="block text-sm font-medium">소속사</label>
                <Input
                  value={selectedGroup.group_company}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev ? { ...prev, group_company: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">장르</label>
                <Input
                  value={selectedGroup.group_genre}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev ? { ...prev, group_genre: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">그룹활동</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedGroup.group_active_status === "Y"
                        ? "솔로"
                        : "팀"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>그룹 타입 선택</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedGroup.group_active_status === "Y"}
                      onCheckedChange={() =>
                        setSelectedGroup((prev) =>
                          prev ? { ...prev, group_active_status: "Y" } : prev
                        )
                      }
                    >
                      활동중
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedGroup.group_active_status === "H"}
                      onCheckedChange={() =>
                        setSelectedGroup((prev) =>
                          prev ? { ...prev, group_active_status: "H" } : prev
                        )
                      }
                    >
                      해체
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedGroup.group_active_status === "N"}
                      onCheckedChange={() =>
                        setSelectedGroup((prev) =>
                          prev ? { ...prev, group_active_status: "N" } : prev
                        )
                      }
                    >
                      휴식
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  그룹 공식 사이트
                </label>
                <Input
                  value={selectedGroup.group_official_website}
                  onChange={(e) =>
                    setSelectedGroup((prev) =>
                      prev
                        ? { ...prev, group_official_website: e.target.value }
                        : prev
                    )
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleDialogClose}
                  variant="secondary"
                >
                  취소
                </Button>
                <Button type="submit">변경</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
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
            // 현재 페이지 주변의 페이지만 표시
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
