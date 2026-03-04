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
      if (!token) {
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
    return <ErrorFeedback error={error || "Vulnerability not found"} />;
  }

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
          Back to Dashboard
        </button>

        <div className="bg-[#111111] rounded-2xl border border-gray-800/60 p-8 shadow-2xl mb-8">
          <DetailHeader
            id={data.id}
            threatType={data.threatType}
            description={data.description}
            severity={data.severity}
            jiraKey={data.jiraKey}
          />
          <AiExplanation explanation={data.aiExplanation} />
        </div>

        {/* Diff Viewer Component */}
        <CodeDiffViewer
          originalCode={data.originalCode}
          fixedCode={data.fixedCode}
        />

        {/* Floating Action Bar */}
        <ApproveActionBar
          isApproved={isApproved}
          approving={approving}
          onApprove={handleApprove}
        />
      </div>
    </div>
  );
}
