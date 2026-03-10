import { Vulnerability } from "../types/vulnerability";
import { TabType } from "../page";

interface DashboardStatsProps {
  vulnerabilities: Vulnerability[];
  activeTab?: TabType;
}

export default function DashboardStats({ vulnerabilities, activeTab = 'sast' }: DashboardStatsProps) {
  const totalScanned = vulnerabilities.length || 0;

  const resolvedCount = vulnerabilities.filter(v =>
    v.status === "RESOLVED" || v.approvalStatus === "APPROVED"
  ).length;

  const successRate = totalScanned > 0
    ? Math.round((resolvedCount / totalScanned) * 100)
    : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className={`w-16 h-16 ${activeTab === 'sast' ? 'text-blue-500' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        </div>
        <h3 className="text-gray-400 font-medium text-sm mb-2">전체 스캔 수</h3>
        <div className="text-3xl font-bold text-gray-100">{totalScanned}</div>
      </div>
      <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 className="text-gray-400 font-medium text-sm mb-2">AI 패치 성공률</h3>
        <div className="text-3xl font-bold text-green-400 flex items-baseline gap-1">
          {successRate}%
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
  );
}
