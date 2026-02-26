export const getSeverityBadgeColor = (severity: string) => {
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

export const getStatusColor = (status: string) => {
  const formatted = status?.toUpperCase() || '';
  if (formatted.includes('RESOLVED') || formatted.includes('APPROVED') || formatted.includes('DONE')) {
    return "bg-green-500";
  }
  if (formatted.includes('PROGRESS') || formatted.includes('PENDING')) {
    return "bg-yellow-500";
  }
  return "bg-red-500";
};

export function SeverityBadge({ severity }: { severity?: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wider uppercase ${getSeverityBadgeColor(severity || 'UNKNOWN')}`}>
      {severity || 'UNKNOWN'}
    </span>
  );
}

export function StatusIndicator({ status, approvalStatus }: { status?: string, approvalStatus?: string }) {
  const finalStatus = status || approvalStatus || 'OPEN';
  const label = finalStatus.toLowerCase().replace('_', ' ');

  return (
    <div className="flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full shadow-sm ${getStatusColor(finalStatus)}`}></span>
      <span className="text-gray-400 text-sm font-medium capitalize">
        {label}
      </span>
    </div>
  );
}
