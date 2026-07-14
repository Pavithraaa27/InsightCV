export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(5, 7, 16, 0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      <div className="glass-elevated px-7 py-5 flex flex-col items-center gap-4 max-w-[260px]">
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 rounded-full"
            style={{ border: '2.5px solid rgba(255, 255, 255, 0.04)' }}
          />
          <div className="absolute inset-0 rounded-full animate-spin-slow"
            style={{ border: '2.5px solid transparent', borderTopColor: '#60a5fa' }}
          />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-semibold text-white">Analyzing Resumes</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Extracting text and matching skills</p>
        </div>
        <div className="w-full rounded-full h-[3px] overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.03)' }}
        >
          <div
            className="h-full rounded-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)',
              backgroundSize: '200% 100%',
              width: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
