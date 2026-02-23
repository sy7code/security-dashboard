"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Vulnerability {
  id: number;
  threatType?: string;
  title?: string;
  severity: string;
  status?: string;
  approvalStatus?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/api/vulnerabilities`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch vulnerabilities");
        }
        const data = await res.json();

        // Handle both pagination responses or direct array responses
        const parsedData = Array.isArray(data) ? data : data?.content || [];
        setVulnerabilities(parsedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "HIGH":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    const formatted = status?.toUpperCase() || '';
    if (formatted.includes('RESOLVED') || formatted.includes('APPROVED') || formatted.includes('DONE')) {
      return "bg-green-500";
    }
    if (formatted.includes('PROGRESS') || formatted.includes('PENDING')) {
      return "bg-yellow-500";
    }
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col items-start gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Active
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">
            Security Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor and manage automated vulnerability remediations.
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-gray-400 font-medium text-sm mb-2">Total Scanned</h3>
            <div className="text-3xl font-bold text-gray-100">{vulnerabilities.length || 0}</div>
          </div>
          <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-gray-400 font-medium text-sm mb-2">AI 패치 성공률</h3>
            <div className="text-3xl font-bold text-green-400 flex items-baseline gap-1">
              {vulnerabilities.length > 0
                ? Math.round((vulnerabilities.filter(v => v.status === "RESOLVED" || v.approvalStatus === "APPROVED").length / vulnerabilities.length) * 100)
                : 100}%
            </div>
          </div>
          <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-gray-400 font-medium text-sm mb-2">평균 해결 시간</h3>
            <div className="text-3xl font-bold text-purple-400">2m 45s</div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 font-medium">Loading vulnerabilities...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl flex items-center shadow-lg backdrop-blur-sm">
            <svg className="w-6 h-6 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h3 className="font-semibold text-red-400">Connection Error</h3>
              <p className="text-sm opacity-80 mt-1">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] rounded-2xl border border-gray-800/60 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161616] border-b border-gray-800/80 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="px-6 py-5 font-semibold">ID</th>
                    <th className="px-6 py-5 font-semibold">Threat Type</th>
                    <th className="px-6 py-5 font-semibold">Severity</th>
                    <th className="px-6 py-5 font-semibold">Status</th>
                    <th className="px-6 py-5 font-semibold">Detected At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {vulnerabilities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          </div>
                          <p className="text-gray-300 font-medium text-lg">현재 탐지된 취약점이 없습니다.</p>
                          <p className="text-gray-500 text-sm">모든 시스템이 안전하게 보호되고 있습니다.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    vulnerabilities.map((vuln) => (
                      <tr
                        key={vuln.id}
                        onClick={() => router.push(`/detail/${vuln.id}`)}
                        className="group hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer"
                      >
                        <td className="px-6 py-5 text-gray-500 font-mono text-sm group-hover:text-blue-400 transition-colors">
                          #{vuln.id}
                        </td>
                        <td className="px-6 py-5 font-medium text-gray-300 group-hover:text-white transition-colors">
                          {vuln.threatType || vuln.title || 'Unknown Threat'}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wider uppercase ${getSeverityBadgeColor(vuln.severity)}`}>
                            {vuln.severity || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full shadow-sm ${getStatusColor(vuln.status || vuln.approvalStatus || '')}`}></span>
                            <span className="text-gray-400 text-sm font-medium capitalize">
                              {(vuln.status || vuln.approvalStatus || 'OPEN').toLowerCase().replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-500 text-sm">
                          {vuln.createdAt ? new Date(vuln.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
