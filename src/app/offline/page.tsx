'use client';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 2.121a2 2 0 112.828 2.828M7 17l.003-.003" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">You&apos;re Offline</h1>
      <p className="text-muted-foreground max-w-md">
        It looks like you&apos;ve lost your internet connection. Some features may be unavailable until you reconnect.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-400 hover:to-purple-400 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}