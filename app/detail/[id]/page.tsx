"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactDiffViewer from "react-diff-viewer-continued";
import axios from "axios";

interface VulnerabilityDetail {
  id: number;
  threatType: string;
  originalCode: string;
  fixedCode: string;
  severity: string;
  status: string;
  approvalStatus: string;
  description: string;
  repoUrl?: string;
  jiraKey?: string;
  prNumber?: number;
  aiExplanation?: string;
}

export default function VulnerabilityDetail() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<VulnerabilityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        // Fetch specific log or just use the summary endpoint if backend logic differs
        // Assume /api/vulnerabilities/{id} exists for fetching details
        const res = await axios.get(`${apiUrl}/api/vulnerabilities/${params.id}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });
        setData(res.data);
      } catch (err: unknown) {
        // Fallback for demo if the specific endpoint isn't ready, try to find it from the list
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
          const res = await axios.get(`${apiUrl}/api/vulnerabilities`, {
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
          });
          const listData = Array.isArray(res.data) ? res.data : res.data.content || [];
          const found = listData.find((item: { id: number | string }) => item.id.toString() === params.id);

          if (found) {
            // Fill in missing fields for demonstration if they don't exist yet
            setData({
              ...found,
              originalCode: found.originalCode || "public void process(String input) {\n  System.out.println(input);\n  // VULNERABLE CODE\n}",
              fixedCode: found.fixedCode || "public void process(String input) {\n  if (input == null) return;\n  // SECURE CODE\n  System.out.println(sanitize(input));\n}",
              description: found.description || "Found a potential vulnerability requiring attention.",
              aiExplanation: found.aiExplanation || "Added null check and input sanitization to prevent potential injection.",
            });
          } else {
            setError("Vulnerability not found.");
          }
        } catch {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || err.message || "Failed to fetch details");
          } else {
            setError(err instanceof Error ? err.message : "Failed to fetch details");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDetail();
    }
  }, [params.id]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await axios.post(
        `${apiUrl}/api/vulnerabilities/approve/${params.id}`,
        {},
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const jiraMessage = data?.jiraKey ? ` (Jira: ${data.jiraKey})` : "";
      setToast({ message: `성공적으로 반영되었습니다.${jiraMessage}`, type: "success" });

      // Update local state to reflect approval
      setData(prev => prev ? { ...prev, approvalStatus: "APPROVED", status: "RESOLVED" } : null);

      // Clear toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setToast({
          message: err.response?.data?.message || "Failed to approve vulnerability.",
          type: "error"
        });
      } else {
        setToast({
          message: err instanceof Error ? err.message : "Failed to approve vulnerability.",
          type: "error"
        });
      }
      setTimeout(() => setToast(null), 3000);
    } finally {
      setApproving(false);
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

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

  const isApproved = data.approvalStatus === "APPROVED" || data.status === "RESOLVED";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto relative pb-24">

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all animate-in fade-in slide-in-from-top-5 max-w-md ${toast.type === 'success'
            ? 'bg-green-950/80 border-green-500/30 text-green-200 backdrop-blur-md'
            : 'bg-red-950/80 border-red-500/30 text-red-200 backdrop-blur-md'
            }`}>
            {toast.type === 'success' ? (
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            <p className="font-medium">{toast.message}</p>
          </div>
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${getSeverityBadgeColor(data.severity)}`}>
                  {data.severity}
                </span>
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
        <div className="bg-[#111111] rounded-2xl border border-gray-800/60 overflow-hidden shadow-2xl">
          <div className="border-b border-gray-800/80 bg-[#161616] px-6 py-4 flex justify-between items-center">
            <h2 className="font-semibold text-gray-300 flex items-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              Proposed Changes
            </h2>
            <div className="flex gap-4 text-sm font-medium">
              <span className="text-red-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500/50"></span> Original
              </span>
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500/50"></span> AI Fixed
              </span>
            </div>
          </div>

          <div className="diff-viewer-container bg-[#0b0b0b]">
            <ReactDiffViewer
              oldValue={data.originalCode}
              newValue={data.fixedCode}
              splitView={true}
              useDarkTheme={true}
              leftTitle="Vulnerable Code"
              rightTitle="Auto-Healed Code"
              styles={{
                variables: {
                  dark: {
                    diffViewerBackground: '#0b0b0b',
                    diffViewerColor: '#d4d4d4',
                    addedBackground: 'rgba(22, 163, 74, 0.15)',
                    addedColor: '#4ade80',
                    removedBackground: 'rgba(220, 38, 38, 0.15)',
                    removedColor: '#f87171',
                    wordAddedBackground: 'rgba(22, 163, 74, 0.3)',
                    wordRemovedBackground: 'rgba(220, 38, 38, 0.3)',
                    addedGutterBackground: 'rgba(22, 163, 74, 0.1)',
                    removedGutterBackground: 'rgba(220, 38, 38, 0.1)',
                    gutterBackground: '#111111',
                    gutterBackgroundDark: '#111111',
                    highlightBackground: '#1a1a1a',
                    highlightGutterBackground: '#1a1a1a',
                    codeFoldGutterBackground: '#1a1a1a',
                    codeFoldBackground: '#161616',
                    emptyLineBackground: '#0b0b0b',
                    gutterColor: '#6b7280',
                    addedGutterColor: '#4ade80',
                    removedGutterColor: '#f87171',
                  }
                },
                contentText: {
                  fontSize: '14px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }
              }}
            />
          </div>
        </div>

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
