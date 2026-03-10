import { Severity } from "../types/vulnerability";
import { SeverityBadge } from "./Badge";

interface DetailHeaderProps {
  id: number;
  threatType: string;
  description: string;
  severity: Severity;
  jiraKey?: string;
}

export default function DetailHeader({
  id,
  threatType,
  description,
  severity,
  jiraKey,
}: DetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <SeverityBadge severity={severity} />
          <span className="text-gray-500 font-mono text-sm">#{id}</span>
          {jiraKey && (
            <a
              href={`https://jira.yourcompany.com/browse/${jiraKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold tracking-wider transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.53 12.016L6.5 7v10.032l5.03-5.016zm5.016-5.016l-5.016-5v10.032l5.016-5.016zM11.53 22v-4.984l-5.03-5.016v10.032l5.03-5.016zM6.5 2v4.984l5.03 5.016V1.968l-5.03 5.016z" /></svg>
              JIRA: {jiraKey}
              <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          {threatType || "알 수 없는 위협 탐지"}
        </h1>
        <p className="text-gray-400">
          {description || "저장소에서 보안 취약점이 자동으로 탐지되었습니다."}
        </p>
      </div>
    </div>
  );
}
