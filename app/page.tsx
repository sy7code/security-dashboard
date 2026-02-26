"use client";

import { useVulnerabilities } from "./hooks/useVulnerabilities";
import DashboardStats from "./components/DashboardStats";
import DashboardCharts from "./components/DashboardCharts";
import VulnerabilityTable from "./components/VulnerabilityTable";

export default function Dashboard() {
  const { vulnerabilities, loading, error } = useVulnerabilities();

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

        {/* 1. Stats Overview */}
        <DashboardStats vulnerabilities={vulnerabilities} />

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
