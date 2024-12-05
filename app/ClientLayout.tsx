// 클라이언트 컴포넌트로 분리
"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = sessionStorage.getItem("at");
      const isLoginPage = pathname === "/login";

      if (!accessToken && !isLoginPage) {
        router.push("/login");
      } else if (accessToken && isLoginPage) {
        router.push("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const isLoginPage = pathname === "/login";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isLoginPage ? (
        // 로그인 페이지일 때는 Sidebar 없이 전체 화면 사용
        <main className="w-full h-screen">{children}</main>
      ) : (
        // 다른 페이지들은 기존 레이아웃 유지
        <div className="w-full flex">
          <Sidebar />
          <main className="flex-1 ml-[90px] lg:ml-72 pt-12 pl-12 w-full h-screen">
            {children}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}
