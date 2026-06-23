'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Newspaper, Beaker, Quote, BookOpen, Cloud, DollarSign, Film,
  LayoutDashboard, GraduationCap, Atom, Calculator, BookMarked,
  BookText, Languages, FileText, CheckSquare, Timer, Moon, PenTool,
  Key, Palette, Percent, HomeIcon, Search, Bookmark, Settings,
  ChevronLeft, ChevronRight, Bot, Menu, X, Sparkles, BarChart3, Zap,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LanguageSwitcher from '@/components/layout/language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  translationKey: 'home' | 'dashboard' | 'news' | 'search' | 'science' | 'chemistry' | 'physics' | 'maths' | 'dailyLearning' | 'vedicLearning' | 'vedas' | 'upanishads' | 'translations' | 'slokas' | 'weather' | 'crypto' | 'movies' | 'quotes' | 'blogs' | 'todo' | 'pomodoro' | 'habits' | 'notes' | 'passwordGen' | 'gradientGen' | 'tipCalc' | 'mortgageCalc' | 'saved' | 'settings' | 'analytics';
}

const sectionLabels: Record<string, Record<string, string>> = {
  en: {
    Main: 'Main',
    Learning: 'Learning',
    Media: 'Media',
    Productivity: 'Productivity',
    Tools: 'Tools'
  },
  hi: {
    Main: 'मुख्य',
    Learning: 'सीखना',
    Media: 'मीडिया',
    Productivity: 'उत्पादकता',
    Tools: 'उपकरण'
  },
  es: {
    Main: 'Principal',
    Learning: 'Aprendizaje',
    Media: 'Medios',
    Productivity: 'Productividad',
    Tools: 'Herramientas'
  }
};

const mainItems: SidebarItem[] = [
  { icon: Home, label: 'Home', href: '/', translationKey: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', translationKey: 'dashboard' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', translationKey: 'analytics' },
  { icon: Newspaper, label: 'News', href: '/news', translationKey: 'news' },
  { icon: Search, label: 'Search', href: '/search', translationKey: 'search' },
];

const learnItems: SidebarItem[] = [
  { icon: Beaker, label: 'Science', href: '/science', translationKey: 'science' },
  { icon: Atom, label: 'Chemistry', href: '/chemistry', translationKey: 'chemistry' },
  { icon: Zap, label: 'Physics', href: '/physics', translationKey: 'physics' },
  { icon: Calculator, label: 'Maths', href: '/maths', translationKey: 'maths' },
  { icon: GraduationCap, label: 'Daily Learning', href: '/daily-learning', translationKey: 'dailyLearning' },
  { icon: BookMarked, label: 'Vedic Learning', href: '/vedic-learning', translationKey: 'vedicLearning' },
  { icon: BookText, label: 'Vedas', href: '/vedas', translationKey: 'vedas' },
  { icon: BookText, label: 'Upanishads', href: '/upanishads', translationKey: 'upanishads' },
  { icon: Languages, label: 'Translations', href: '/translations', translationKey: 'translations' },
  { icon: FileText, label: 'Slokas', href: '/slokas', translationKey: 'slokas' },
];

const mediaItems: SidebarItem[] = [
  { icon: Cloud, label: 'Weather', href: '/weather', translationKey: 'weather' },
  { icon: DollarSign, label: 'Crypto', href: '/crypto', translationKey: 'crypto' },
  { icon: Film, label: 'Movies', href: '/movies', translationKey: 'movies' },
  { icon: Quote, label: 'Quotes', href: '/quotes', translationKey: 'quotes' },
  { icon: BookOpen, label: 'Blogs', href: '/blogs', translationKey: 'blogs' },
];

const productivityItems: SidebarItem[] = [
  { icon: CheckSquare, label: 'Todo', href: '/todo', translationKey: 'todo' },
  { icon: Timer, label: 'Pomodoro', href: '/pomodoro', translationKey: 'pomodoro' },
  { icon: Moon, label: 'Habits', href: '/habits', translationKey: 'habits' },
  { icon: PenTool, label: 'Notes', href: '/notes', translationKey: 'notes' },
];

const toolsItems: SidebarItem[] = [
  { icon: Key, label: 'Password Gen', href: '/password-generator', translationKey: 'passwordGen' },
  { icon: Palette, label: 'Gradient Gen', href: '/gradient-generator', translationKey: 'gradientGen' },
  { icon: Percent, label: 'Tip Calc', href: '/tip-calculator', translationKey: 'tipCalc' },
  { icon: HomeIcon, label: 'Mortgage Calc', href: '/mortgage-calculator', translationKey: 'mortgageCalc' },
];

const bottomItems: SidebarItem[] = [
  { icon: Bookmark, label: 'Saved', href: '/saved', translationKey: 'saved' },
  { icon: Settings, label: 'Settings', href: '/settings', translationKey: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang } = useLanguage();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass-strong text-foreground hover:text-foreground h-10 w-10"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen glass-strong border-r border-white/5 transition-all duration-300 flex flex-col overflow-hidden',
          sidebarCollapsed ? 'w-[76px]' : 'w-[264px]',
          'max-lg:fixed max-lg:w-[288px]',
          mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
        )}
      >
        {/* Aurora gradient strip on the right edge */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3 p-5 border-b border-white/5">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 animate-glow-pulse">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 animate-breathe" />
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
            >
              <div className="font-semibold text-[15px] tracking-tight text-pretty">
                <span className="text-foreground/90">Knowledge</span>{' '}
                <span className="text-gradient">Base</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-0.5">AI Ecosystem v3</div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex h-7 w-7 text-muted-foreground/60 hover:text-foreground hover:bg-white/5 rounded-md"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </Button>
        </div>

        <ScrollArea className="relative flex-1 px-2.5 py-4">
          <SidebarSection items={mainItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Main || 'Main'} />
          <SidebarSection items={learnItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Learning || 'Learning'} />
          <SidebarSection items={mediaItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Media || 'Media'} />
          <SidebarSection items={productivityItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Productivity || 'Productivity'} />
          <SidebarSection items={toolsItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Tools || 'Tools'} />
          <div className="mt-3 pt-3 border-t border-white/5">
            {bottomItems.map((item) => (
              <SidebarItemComponent key={item.href} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
            ))}
          </div>
          <div className="px-1 pt-3">
            <LanguageSwitcher />
          </div>
        </ScrollArea>

        {!sidebarCollapsed && (
          <div className="relative p-3 border-t border-white/5">
            <div className="rounded-xl p-3 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-semibold text-foreground/90">Pro Tip</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-muted-foreground">
                Press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-foreground/90 font-mono text-[9px] border border-white/10">⌘K</kbd>{' '}
                to instantly jump anywhere.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function SidebarSection({ items, pathname, collapsed, label }: { items: SidebarItem[]; pathname: string; collapsed: boolean; label: string }) {
  return (
    <div className="mb-3">
      {!collapsed && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50 px-3 mb-2">{label}</p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => (
          <SidebarItemComponent key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

function SidebarItemComponent({ item, pathname, collapsed }: { item: SidebarItem; pathname: string; collapsed: boolean }) {
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
  const { t } = useLanguage();
  const displayLabel = t.nav[item.translationKey] || item.label;

  const link = (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 overflow-hidden min-h-[36px]',
        isActive
          ? 'bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-transparent text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <item.icon
        className={cn(
          'w-4 h-4 shrink-0 transition-all duration-300',
          isActive
            ? 'text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]'
            : 'text-muted-foreground/70 group-hover:text-foreground group-hover:scale-110'
        )}
      />
      {!collapsed && (
        <span className={cn('text-[13px] font-medium tracking-tight transition-colors', isActive && 'text-foreground')}>
          {displayLabel}
        </span>
      )}
      {isActive && !collapsed && (
        <span className="ml-auto w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="glass-strong border-white/10 text-foreground text-xs font-medium px-2.5 py-1.5"
          >
            {displayLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return link;
}
