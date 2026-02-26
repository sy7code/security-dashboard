"use client";

import { useParams, useRouter } from "next/navigation";
import { useVulnerabilityDetail } from "../../hooks/useVulnerabilityDetail";
import { SeverityBadge } from "../../components/Badge";
import CodeDiffViewer from "../../components/CodeDiffViewer";
import Toast from "../../components/Toast";

export default function VulnerabilityDetail() {
  const params = useParams();
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl max-w-lg w-full text-center">
          <h3 className="font-semibold text-red-400 mb-2">Error Loading Details</h3>
          <p className="opacity-80 mb-6">{error || "Vulnerability not found"}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 rounded-lg transition-colors border border-red-800/50"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
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

        {/* Back Button & Header Component */}
        <button
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>

        <div className="bg-[#111111] rounded-2xl border border-gray-800/60 p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <SeverityBadge severity={data.severity} />
                <span className="text-gray-500 font-mono text-sm">#{data.id}</span>
                {data.jiraKey && (
                  <span className="px-3 py-1 bg-[#0052CC]/10 text-[#4C9AFF] border border-[#0052CC]/30 rounded-full text-xs font-bold tracking-wider">
                    JIRA: {data.jiraKey}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                {data.threatType || "Unknown Threat Detection"}
              </h1>
              <p className="text-gray-400">
                {data.description || "A security vulnerability was automatically detected in your repository."}
              </p>
            </div>
          </div>

          {/* AI Explanation section if present */}
          {data.aiExplanation && (
            <div className="mt-6 bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">AI Remediation Strategy</h3>
                  <p className="text-blue-200/80 text-sm leading-relaxed">{data.aiExplanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Diff Viewer Component */}
        <CodeDiffViewer
          originalCode={data.originalCode}
          fixedCode={data.fixedCode}
        />

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#111111]/90 backdrop-blur-xl border-t border-gray-800/80 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
          <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isApproved ? (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Patch Applied
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Review the changes above before approving the patch.
                </div>
              )}
            </div>

            <button
              onClick={handleApprove}
              disabled={isApproved || approving}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${isApproved
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : approving
                  ? 'bg-blue-600/50 text-white/70 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                }`}
            >
              {approving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : isApproved ? (
                <>Approved</>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Approve & Patch
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
