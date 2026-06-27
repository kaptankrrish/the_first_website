"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-fade-in">
      <div className="relative p-8 rounded-2xl glass-strong border-red-500/20 max-w-md w-full overflow-hidden">
        {/* Aurora accents for error state */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-pulse-glow" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle size={32} />
          </div>
          
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
            Something went wrong!
          </h2>
          
          <p className="text-muted-foreground mb-4 text-sm">
            {error.message || "An unexpected error occurred while loading this page."}
          </p>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
          >
            <RefreshCcw size={18} />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
