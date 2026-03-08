"use client";

import { useVulnerabilities } from "./hooks/useVulnerabilities";
import DashboardStats from "./components/DashboardStats";
import DashboardCharts from "./components/DashboardCharts";
import VulnerabilityTable from "./components/VulnerabilityTable";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { vulnerabilities, loading, error } = useVulnerabilities();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (!token && !isLocal) {
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-start justify-between">
          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              시스템 활성
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
              보안 대시보드
            </h1>
            <p className="text-gray-400 text-lg">
              자동화된 취약점 조치 현황을 모니터링하고 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => router.push("/settings")}
              className="px-4 py-2 bg-gray-900 hover:bg-indigo-900/40 hover:text-indigo-400 text-gray-400 rounded-lg text-sm font-medium transition-all border border-gray-800 hover:border-indigo-900/50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              설정
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("token");
                  router.push("/login");
                }
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-red-900/40 hover:text-red-400 text-gray-400 rounded-lg text-sm font-medium transition-all border border-gray-800 hover:border-red-900/50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              로그아웃
            </button>
          </div>
        </header>

        {/* 1. Stats Overview */}
        <DashboardStats vulnerabilities={vulnerabilities} />

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 font-medium">취약점 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl flex items-center shadow-lg backdrop-blur-sm">
            <svg className="w-6 h-6 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-semibold text-red-400">연결 오류</h3>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* 2. Charts Section */}
            {vulnerabilities.length > 0 && <DashboardCharts vulnerabilities={vulnerabilities} />}

            {/* 3. Vulnerability List */}
            <VulnerabilityTable vulnerabilities={vulnerabilities} />
          </>
        )}
      </div>
    </div>
  );
}
