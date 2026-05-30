'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, History } from 'lucide-react';
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow"
      >
        <Search className="w-5 h-5 text-white" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              className="relative w-full max-w-xl mx-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Search across news, blogs, notes, vedic content..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm"
                />
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                {searchHistory.length > 0 && !query && (
                  <div className="mb-2">
                    <p className="flex items-center gap-2 px-3 py-2 text-xs text-white/40">
                      <History className="w-3 h-3" /> Recent Searches
                    </p>
                    {searchHistory.slice(0, 5).map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(h)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-sm"
                      >
                        <History className="w-4 h-4" /> {h}
                      </button>
                    ))}
                  </div>
                )}
                {query.length > 0 && (
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 px-3 py-2 text-xs text-white/40">
                      <TrendingUp className="w-3 h-3" /> Search Suggestions
                    </p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white hover:bg-white/5 text-sm"
                    >
                      <Search className="w-4 h-4 text-blue-400" /> Search for &ldquo;{query}&rdquo;
                    </button>
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
