'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, Home, LayoutDashboard, Newspaper, Beaker, Cloud,
  DollarSign, Film, Quote, BookOpen, CheckSquare, Timer, Moon, PenTool,
  Atom, Calculator, GraduationCap, BookMarked, BookText, Languages, FileText,
  Bookmark, Settings, Keyboard,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store';
import { useRecentlyUsedStore } from '@/store';

const ICON_MAP: Record<string, React.ElementType> = {
  Home, LayoutDashboard, Newspaper, Search, Beaker, Cloud, DollarSign, Film,
  Quote, CheckSquare, Timer, Moon, PenTool, Atom, Calculator, GraduationCap,
  BookMarked, BookText, Languages, FileText, BookOpen, Bookmark, Settings,
};

interface CommandItem {
  label: string;
  href: string;
  icon: React.ElementType;
  group: 'Navigation' | 'Recently Used' | 'Quick Actions';
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { addSearchHistory } = useAppStore();
  const { items: recentItems } = useRecentlyUsedStore();

  const baseRoutes: CommandItem[] = useMemo(() => [
    { label: 'Home', href: '/', icon: Home, group: 'Navigation' },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navigation' },
    { label: 'News', href: '/news', icon: Newspaper, group: 'Navigation' },
    { label: 'Search', href: '/search', icon: Search, group: 'Navigation' },
    { label: 'Science', href: '/science', icon: Beaker, group: 'Navigation' },
    { label: 'Weather', href: '/weather', icon: Cloud, group: 'Navigation' },
    { label: 'Crypto', href: '/crypto', icon: DollarSign, group: 'Navigation' },
    { label: 'Movies', href: '/movies', icon: Film, group: 'Navigation' },
    { label: 'Quotes', href: '/quotes', icon: Quote, group: 'Navigation' },
    { label: 'Todo', href: '/todo', icon: CheckSquare, group: 'Navigation' },
    { label: 'Pomodoro', href: '/pomodoro', icon: Timer, group: 'Navigation' },
    { label: 'Habits', href: '/habits', icon: Moon, group: 'Navigation' },
    { label: 'Notes', href: '/notes', icon: PenTool, group: 'Navigation' },
    { label: 'Chemistry', href: '/chemistry', icon: Atom, group: 'Navigation' },
    { label: 'Maths', href: '/maths', icon: Calculator, group: 'Navigation' },
    { label: 'Daily Learning', href: '/daily-learning', icon: GraduationCap, group: 'Navigation' },
    { label: 'Vedic Learning', href: '/vedic-learning', icon: BookMarked, group: 'Navigation' },
    { label: 'Vedas', href: '/vedas', icon: BookText, group: 'Navigation' },
    { label: 'Upanishads', href: '/upanishads', icon: BookText, group: 'Navigation' },
    { label: 'Translations', href: '/translations', icon: Languages, group: 'Navigation' },
    { label: 'Slokas', href: '/slokas', icon: FileText, group: 'Navigation' },
    { label: 'Blogs', href: '/blogs', icon: BookOpen, group: 'Navigation' },
    { label: 'Settings', href: '/settings', icon: Settings, group: 'Navigation' },
    { label: 'Saved', href: '/saved', icon: Bookmark, group: 'Navigation' },
    { label: 'Keyboard Shortcuts', href: '/shortcuts', icon: Keyboard, group: 'Quick Actions' },
  ], []);

  const allItems: CommandItem[] = useMemo(() => {
    const recents: CommandItem[] = recentItems.slice(0, 4).map((r) => ({
      label: r.label,
      href: r.href,
      icon: ICON_MAP[r.icon] ?? ArrowRight,
      group: 'Recently Used' as const,
    }));
    return [...recents, ...baseRoutes];
  }, [recentItems, baseRoutes]);

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
    ? allItems.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    : allItems;

  const navigate = useCallback((href: string, label: string) => {
    setOpen(false);
    setQuery('');
    if (href !== '/' && !href.startsWith('/shortcuts')) {
      addSearchHistory(label);
    }
    router.push(href);
  }, [router, addSearchHistory]);

  useEffect(() => {
    Promise.resolve().then(() => setSelectedIndex(0));
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href, filtered[selectedIndex].label);
    }
  };

  // Group items
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filtered]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-20 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-white/50 text-sm transition-all group"
      >
        <Search className="w-3.5 h-3.5 group-hover:text-blue-300 transition-colors" />
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono border border-white/10">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl glass-strong rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
            >
              {/* Aurora gradient inside palette */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex items-center gap-3 p-4 border-b border-white/5">
                <Search className="w-4 h-4 text-blue-300" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, tools, and content..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-sm"
                />
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50 font-mono border border-white/10">ESC</kbd>
              </div>
              <div className="relative max-h-[420px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-white/40 text-sm">No results found</div>
                    <div className="text-white/20 text-xs mt-1">Try a different search</div>
                  </div>
                ) : (
                  Object.entries(grouped).map(([groupName, items]) => (
                    <div key={groupName} className="mb-2">
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
                        {groupName}
                      </p>
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const globalIdx = filtered.indexOf(item);
                          return (
                            <button
                              key={item.href + groupName}
                              onClick={() => navigate(item.href, item.label)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={cn(
                                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150 group',
                                globalIdx === selectedIndex
                                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 text-white border border-blue-400/20'
                                  : 'text-white/70 hover:bg-white/5 border border-transparent'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                                  globalIdx === selectedIndex
                                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-blue-200'
                                    : 'bg-white/5 text-white/50'
                                )}
                              >
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="flex-1 text-sm font-medium">{item.label}</span>
                              {globalIdx === selectedIndex && (
                                <ArrowRight className="w-4 h-4 text-blue-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="relative flex items-center justify-between gap-2 px-4 py-2.5 border-t border-white/5 text-[10px] text-white/40">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono border border-white/10">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono border border-white/10">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono border border-white/10">↵</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono border border-white/10">?</kbd>
                  shortcuts
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
