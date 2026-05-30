'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Newspaper, Beaker, Quote, BookOpen, Cloud, DollarSign, Film,
  LayoutDashboard, GraduationCap, Atom, Calculator, BookMarked,
  BookText, Languages, FileText, CheckSquare, Timer, Moon, PenTool,
  Key, Palette, Percent, HomeIcon, Search, Bookmark, Settings,
  ChevronLeft, ChevronRight, Bot, Menu, X,
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
  translationKey: 'home' | 'dashboard' | 'news' | 'search' | 'science' | 'chemistry' | 'maths' | 'dailyLearning' | 'vedicLearning' | 'vedas' | 'upanishads' | 'translations' | 'slokas' | 'weather' | 'crypto' | 'movies' | 'quotes' | 'blogs' | 'todo' | 'pomodoro' | 'habits' | 'notes' | 'passwordGen' | 'gradientGen' | 'tipCalc' | 'mortgageCalc' | 'saved' | 'settings';
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
  { icon: Newspaper, label: 'News', href: '/news', translationKey: 'news' },
  { icon: Search, label: 'Search', href: '/search', translationKey: 'search' },
];

const learnItems: SidebarItem[] = [
  { icon: Beaker, label: 'Science', href: '/science', translationKey: 'science' },
  { icon: Atom, label: 'Chemistry', href: '/chemistry', translationKey: 'chemistry' },
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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-background/40 backdrop-blur-3xl border-r border-border/50 transition-all duration-300 flex flex-col',
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]',
          'max-lg:fixed max-lg:w-[280px]',
          mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 p-6 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/50 shadow-inner">
            <Bot className="w-5 h-5 text-blue-500" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-base tracking-tight text-foreground/90"
            >
              Knowledge <span className="text-blue-500">Base</span>
            </motion.span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2 py-4">
          <SidebarSection items={mainItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Main || 'Main'} />
          <SidebarSection items={learnItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Learning || 'Learning'} />
          <SidebarSection items={mediaItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Media || 'Media'} />
          <SidebarSection items={productivityItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Productivity || 'Productivity'} />
          <SidebarSection items={toolsItems} pathname={pathname} collapsed={sidebarCollapsed} label={sectionLabels[lang]?.Tools || 'Tools'} />
          <div className="mt-2 border-t border-border/50 pt-2">
            {bottomItems.map((item) => (
              <SidebarItemComponent key={item.href} item={item} pathname={pathname} collapsed={sidebarCollapsed} />
            ))}
          </div>
          <div className="px-2 pt-2">
            <LanguageSwitcher />
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

function SidebarSection({ items, pathname, collapsed, label }: { items: SidebarItem[]; pathname: string; collapsed: boolean; label: string }) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-2">{label}</p>
      )}
      <div className="space-y-1">
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
        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
        isActive
          ? 'bg-blue-500/10 text-blue-500'
          : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
      )}
    >
      <item.icon className={cn('w-4.5 h-4.5 shrink-0 transition-colors', isActive ? 'text-blue-500' : 'text-muted-foreground/70 group-hover:text-foreground')} />
      {!collapsed && (
        <span className="text-sm font-medium tracking-tight">{displayLabel}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="bg-background/90 backdrop-blur-xl border-border/50 text-foreground">
            {displayLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return link;
}
