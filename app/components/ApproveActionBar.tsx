interface ApproveActionBarProps {
  isApproved: boolean;
  approving: boolean;
  onApprove: () => void;
}

export default function ApproveActionBar({ isApproved, approving, onApprove }: ApproveActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#111111]/90 backdrop-blur-xl border-t border-gray-800/80 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isApproved ? (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Patch Applied
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Review the changes above before approving the patch.
            </div>
          )}
        </div>

        <button
          onClick={onApprove}
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Approve & Patch
            </>
          )}
        </button>
      </div>
    </div>
  );
}
