'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Newspaper, Beaker, Cloud, DollarSign, Film, Quote, BookOpen,
  CheckSquare, Timer, Moon, PenTool, Atom, Calculator, GraduationCap,
  BookMarked, BookText, Languages, FileText, Bookmark, Settings,
  LayoutDashboard, Search, Trash2, History, Star, ChevronRight,
} from 'lucide-react';
import { useRecentlyUsedStore, useFavoritesStore, type RecentItem } from '@/store';
import { cn } from '@/utils/cn';
import { BentoCard } from '@/components/ui/bento-card';

const ICON_MAP: Record<string, React.ElementType> = {
  Home, Newspaper, Beaker, Cloud, DollarSign, Film, Quote, BookOpen,
  CheckSquare, Timer, Moon, PenTool, Atom, Calculator, GraduationCap,
  BookMarked, BookText, Languages, FileText, Bookmark, Settings,
  LayoutDashboard, Search,
};

interface ItemDef {
  href: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

const ALL_ITEMS: ItemDef[] = [
  { href: '/', label: 'Home', icon: 'Home', color: 'from-blue-500 to-cyan-500', description: 'Dashboard hub' },
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', color: 'from-indigo-500 to-purple-500', description: 'Overview' },
  { href: '/news', label: 'News', icon: 'Newspaper', color: 'from-rose-500 to-pink-500', description: 'Live news' },
  { href: '/search', label: 'Search', icon: 'Search', color: 'from-slate-500 to-zinc-500', description: 'Find anything' },
  { href: '/science', label: 'Science', icon: 'Beaker', color: 'from-emerald-500 to-teal-500', description: 'Research papers' },
  { href: '/chemistry', label: 'Chemistry', icon: 'Atom', color: 'from-green-500 to-emerald-500', description: 'Compounds' },
  { href: '/maths', label: 'Maths', icon: 'Calculator', color: 'from-orange-500 to-amber-500', description: 'Math facts' },
  { href: '/daily-learning', label: 'Daily Learning', icon: 'GraduationCap', color: 'from-violet-500 to-purple-500', description: 'Daily insights' },
  { href: '/vedic-learning', label: 'Vedic Learning', icon: 'BookMarked', color: 'from-amber-500 to-yellow-500', description: 'Ancient wisdom' },
  { href: '/vedas', label: 'Vedas', icon: 'BookText', color: 'from-yellow-500 to-amber-500', description: 'Sacred texts' },
  { href: '/upanishads', label: 'Upanishads', icon: 'BookText', color: 'from-yellow-600 to-orange-500', description: 'Philosophy' },
  { href: '/translations', label: 'Translations', icon: 'Languages', color: 'from-cyan-500 to-blue-500', description: 'Translate text' },
  { href: '/slokas', label: 'Slokas', icon: 'FileText', color: 'from-orange-400 to-rose-500', description: 'Sacred verses' },
  { href: '/weather', label: 'Weather', icon: 'Cloud', color: 'from-sky-500 to-blue-500', description: 'Live forecast' },
  { href: '/crypto', label: 'Crypto', icon: 'DollarSign', color: 'from-amber-500 to-yellow-500', description: 'Live prices' },
  { href: '/movies', label: 'Movies', icon: 'Film', color: 'from-red-500 to-rose-500', description: 'Discover films' },
  { href: '/quotes', label: 'Quotes', icon: 'Quote', color: 'from-pink-500 to-rose-500', description: 'Inspiration' },
  { href: '/blogs', label: 'Blogs', icon: 'BookOpen', color: 'from-indigo-500 to-blue-500', description: 'Read articles' },
  { href: '/todo', label: 'Todo', icon: 'CheckSquare', color: 'from-green-500 to-emerald-500', description: 'Tasks' },
  { href: '/pomodoro', label: 'Pomodoro', icon: 'Timer', color: 'from-red-500 to-orange-500', description: 'Focus timer' },
  { href: '/habits', label: 'Habits', icon: 'Moon', color: 'from-indigo-500 to-violet-500', description: 'Daily habits' },
  { href: '/notes', label: 'Notes', icon: 'PenTool', color: 'from-yellow-500 to-amber-500', description: 'Quick notes' },
  { href: '/saved', label: 'Saved', icon: 'Bookmark', color: 'from-purple-500 to-pink-500', description: 'Your saves' },
  { href: '/settings', label: 'Settings', icon: 'Settings', color: 'from-zinc-500 to-slate-500', description: 'Preferences' },
];

export function getItemDef(href: string): ItemDef | undefined {
  return ALL_ITEMS.find((i) => i.href === href);
}

export function RecentlyUsedRail() {
  const pathname = usePathname();
  const { items, recordVisit, clear } = useRecentlyUsedStore();
  const { favorites, toggle, isFavorite } = useFavoritesStore();
  const [showFavorites, setShowFavorites] = useState(false);

  // Track current page visit
  useEffect(() => {
    const def = getItemDef(pathname);
    if (def) {
      recordVisit({ href: def.href, label: def.label, icon: def.icon });
    }
  }, [pathname, recordVisit]);

  const visibleItems = (showFavorites ? favorites : items) as (RecentItem & { color?: string; description?: string })[];
  const displayItems = visibleItems
    .map((it) => {
      const def = getItemDef(it.href);
      return def ? { ...it, color: def.color, description: def.description } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, showFavorites ? 8 : 6);

  if (displayItems.length === 0) return null;

  return (
    <BentoCard variant="default" size="md" className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center">
            {showFavorites ? (
              <Star className="w-4 h-4 text-amber-300" />
            ) : (
              <History className="w-4 h-4 text-blue-300" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground/90 leading-tight">
              {showFavorites ? 'Favorites' : 'Recently Used'}
            </h3>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              {showFavorites
                ? `${favorites.length} starred`
                : 'Your last visited features'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFavorites(false)}
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors',
              !showFavorites
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground/60 hover:text-foreground'
            )}
          >
            Recent
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={cn(
              'px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors',
              showFavorites
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground/60 hover:text-foreground'
            )}
          >
            Starred
          </button>
          {!showFavorites && items.length > 0 && (
            <button
              onClick={clear}
              className="ml-1 p-1 rounded-md text-muted-foreground/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear recent"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-1 pb-1">
        <div className="flex gap-2 px-1 min-w-min">
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, idx) => {
              const Icon = ICON_MAP[item.icon] || Home;
              const isActive = pathname === item.href;
              const starred = isFavorite(item.href);
              return (
                <motion.div
                  key={item.href}
                  layout
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ delay: idx * 0.04, type: 'spring', stiffness: 380, damping: 30 }}
                  className="relative group shrink-0"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 pl-2.5 pr-3 py-2 rounded-xl border transition-all duration-300 min-w-[140px]',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 shadow-[0_0_16px_rgba(96,165,250,0.2)]'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0',
                        item.color
                      )}
                    >
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-foreground/90 truncate max-w-[100px]">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 truncate max-w-[100px]">
                        {item.description}
                      </span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-3 h-3 text-muted-foreground/40 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all shrink-0'
                      )}
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle({ href: item.href, label: item.label, icon: item.icon });
                    }}
                    className={cn(
                      'absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100',
                      starred
                        ? 'bg-amber-400 text-amber-900 shadow-[0_0_8px_rgba(251,191,36,0.6)] opacity-100'
                        : 'bg-white/10 text-white/60 hover:bg-amber-400/30'
                    )}
                    title={starred ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={cn('w-2.5 h-2.5', starred && 'fill-current')} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </BentoCard>
  );
}
