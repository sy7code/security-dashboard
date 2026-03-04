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
            <span className="px-3 py-1 bg-[#0052CC]/10 text-[#4C9AFF] border border-[#0052CC]/30 rounded-full text-xs font-bold tracking-wider">
              JIRA: {jiraKey}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          {threatType || "Unknown Threat Detection"}
        </h1>
        <p className="text-gray-400">
          {description || "A security vulnerability was automatically detected in your repository."}
        </p>
      </div>
    </div>
  );
}
