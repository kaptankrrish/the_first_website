'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';

export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { searchHistory, addSearchHistory } = useAppStore();

  const handleSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    addSearchHistory(q.trim());
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    setQuery('');
  }, [router, addSearchHistory]);

  // Listen for "/" to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === '/' && !isInput && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 group w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-shadow animate-glow-pulse"
        aria-label="Open search"
      >
        <Search className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-background animate-bounce shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] px-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl mx-4 glass-strong rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-center gap-3 p-4 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-300" />
                </div>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Search across news, blogs, notes, vedic content..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm"
                />
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 font-mono border border-white/10">/</kbd>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative p-2 max-h-[320px] overflow-y-auto">
                {searchHistory.length > 0 && !query && (
                  <div className="mb-2">
                    <p className="flex items-center gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                      <History className="w-3 h-3" /> Recent Searches
                    </p>
                    {searchHistory.slice(0, 5).map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(h)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors group"
                      >
                        <History className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-300 transition-colors" />
                        <span className="flex-1 text-left">{h}</span>
                        <Search className="w-3 h-3 text-white/0 group-hover:text-blue-300 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
                {query.length > 0 && (
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                      <Sparkles className="w-3 h-3" /> Quick Search
                    </p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 text-sm transition-colors group border border-transparent hover:border-white/5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                        <Search className="w-3.5 h-3.5 text-blue-300" />
                      </div>
                      <span className="flex-1 text-left">Search for &ldquo;{query}&rdquo;</span>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 font-mono border border-white/10">↵</kbd>
                    </button>
                  </div>
                )}
                {!query && searchHistory.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-5 h-5 text-blue-300" />
                    </div>
                    <p className="text-sm text-white/60">Start typing to search</p>
                    <p className="text-xs text-white/30 mt-1">Across news, blogs, notes, and vedic content</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
