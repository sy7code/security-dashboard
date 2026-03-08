"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScannerForm from "../components/settings/ScannerForm";
import AiEngineForm from "../components/settings/AiEngineForm";
import { Settings, Shield, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"scanners" | "ai">("scanners");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (!token && !isLocal) {
        // Redirection mechanism for production use.
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.15)]">
              <Settings className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                플러그인 설정
              </h1>
              <p className="text-slate-400 mt-1">보안 스캐너 및 AI 엔진을 관리합니다.</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-all border border-slate-700 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            대시보드
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 bg-slate-800/50 backdrop-blur-md rounded-xl w-fit border border-slate-700/50 animate-in slide-in-from-top-2 duration-500 delay-100">
          <button
            onClick={() => setActiveTab("scanners")}
            className={`flex items-center gap-2 px-6 py-2.5 outline-none rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "scanners"
              ? "bg-indigo-600 shadow-md text-white border border-indigo-500"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent"
              }`}
          >
            <Shield className="w-4 h-4" />
            스캐너 관리
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-6 py-2.5 outline-none rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "ai"
              ? "bg-purple-600 shadow-md text-white border border-purple-500"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent"
              }`}
          >
            <Sparkles className="w-4 h-4" />
            AI 엔진 관리
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            {activeTab === "scanners" ? <ScannerForm /> : <AiEngineForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
