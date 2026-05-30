'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const routes = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'News', href: '/news', icon: '📰' },
  { label: 'Science', href: '/science', icon: '🔬' },
  { label: 'Weather', href: '/weather', icon: '🌤️' },
  { label: 'Crypto', href: '/crypto', icon: '💰' },
  { label: 'Movies', href: '/movies', icon: '🎬' },
  { label: 'Quotes', href: '/quotes', icon: '💬' },
  { label: 'Todo', href: '/todo', icon: '✅' },
  { label: 'Pomodoro', href: '/pomodoro', icon: '⏱️' },
  { label: 'Habits', href: '/habits', icon: '🌙' },
  { label: 'Notes', href: '/notes', icon: '📝' },
  { label: 'Chemistry', href: '/chemistry', icon: '⚗️' },
  { label: 'Maths', href: '/maths', icon: '📐' },
  { label: 'Vedic Learning', href: '/vedic-learning', icon: '🕉️' },
  { label: 'Blogs', href: '/blogs', icon: '📖' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Saved', href: '/saved', icon: '🔖' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filtered = query
    ? routes.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    : routes;

  const navigate = useCallback((href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  }, [router]);

  useEffect(() => {
    Promise.resolve().then(() => setSelectedIndex(0));
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) { navigate(filtered[selectedIndex].href); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-20 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-all"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, tools, and content..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 font-mono">ESC</kbd>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="p-4 text-center text-white/40 text-sm">No results found</div>
                ) : (
                  filtered.map((item, i) => (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className={cn(
                        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all',
                        i === selectedIndex ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                      )}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {i === selectedIndex && <ArrowRight className="w-4 h-4 text-blue-400" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
