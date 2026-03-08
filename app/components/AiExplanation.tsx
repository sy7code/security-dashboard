interface AiExplanationProps {
  explanation?: string;
}

export default function AiExplanation({ explanation }: AiExplanationProps) {
  if (!explanation) return null;

  return (
    <div className="mt-6 bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-blue-300 mb-1">AI 해결 전략</h3>
          <p className="text-blue-200/80 text-sm leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
