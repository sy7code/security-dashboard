import { useRouter } from "next/navigation";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function ErrorFeedback({
  error,
  title = "오류 발생",
  onRetry,
}: {
  error: string;
  title?: string;
  onRetry?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="bg-red-950/30 border border-red-900/50 text-red-200 px-6 py-4 rounded-xl max-w-lg w-full text-center shadow-lg backdrop-blur-sm">
        <svg className="w-8 h-8 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="font-semibold text-red-400 mb-2">{title}</h3>
        <p className="opacity-80 mb-6 text-sm">{error}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors border border-gray-800"
          >
            대시보드
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 rounded-lg transition-colors border border-red-800/50"
            >
              재시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
