"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useVulnerabilityDetail } from "../../hooks/useVulnerabilityDetail";
import CodeDiffViewer from "../../components/CodeDiffViewer";
import Toast from "../../components/Toast";
import DetailHeader from "../../components/DetailHeader";
import AiExplanation from "../../components/AiExplanation";
import ApproveActionBar from "../../components/ApproveActionBar";
import { LoadingSpinner, ErrorFeedback } from "../../components/StateFeedback";

export default function VulnerabilityDetail() {
  const params = useParams();
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

  const {
    data,
    loading,
    error,
    approving,
    isApproved,
    toast,
    setToast,
    handleApprove
  } = useVulnerabilityDetail(params.id || "");

  if (loading) return <LoadingSpinner />;

  if (error || !data) {
    return <ErrorFeedback error={error || "취약점을 찾을 수 없습니다"} />;
  }

  const isCspm = data.source && data.source.toUpperCase() !== 'SNYK';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto relative pb-24">

        {/* Global Toast Component */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          대시보드로 돌아가기
        </button>

        <div className="bg-[#111111] rounded-2xl border border-gray-800/60 p-8 shadow-2xl mb-8">
          <DetailHeader
            id={data.id}
            threatType={data.threatType}
            description={data.description}
            severity={data.severity}
            jiraKey={data.jiraKey}
          />

          {!isCspm && <AiExplanation explanation={data.aiExplanation} />}

          {isCspm && (
            <div className="mt-8 bg-purple-900/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white">인프라 설정 변경 필요</h3>
                <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-xs font-bold uppercase tracking-wider">Manual Review</span>
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-gray-800/80 mb-4">
                <h4 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">대상 리소스</h4>
                <p className="text-lg font-mono text-purple-300 break-all">{data.filePath || "알 수 없는 리소스"}</p>
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-gray-800/80">
                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">가이드라인</h4>
                <p className="text-gray-300 text-base leading-relaxed">{data.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Diff Viewer Component ONLY for SAST */}
        {!isCspm && (
          <CodeDiffViewer
            originalCode={data.originalCode}
            fixedCode={data.fixedCode}
          />
        )}

        {/* Floating Action Bar ONLY for SAST that supports auto approval */}
        {!isCspm && (
          <ApproveActionBar
            isApproved={isApproved}
            approving={approving}
            onApprove={handleApprove}
          />
        )}
      </div>
    </div>
  );
}
