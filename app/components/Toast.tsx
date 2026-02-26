"use client";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all animate-in fade-in slide-in-from-top-5 max-w-md ${type === 'success'
      ? 'bg-green-950/80 border-green-500/30 text-green-200 backdrop-blur-md'
      : 'bg-red-950/80 border-red-500/30 text-red-200 backdrop-blur-md'
      }`}>
      {type === 'success' ? (
        <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      ) : (
        <svg className="w-6 h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      )}
      <p className="font-medium">{message}</p>

      {onClose && (
        <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      )}
    </div>
  );
}
