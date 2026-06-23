'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home, Newspaper, Beaker, Cloud, DollarSign, Film, Quote, BookOpen,
  CheckSquare, Timer, Moon, PenTool, Atom, Calculator, GraduationCap,
  BookMarked, BookText, Languages, FileText, Bookmark, Settings,
  LayoutDashboard, Sparkles, ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { BentoCard } from '@/components/ui/bento-card';

interface Feature {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  category: 'Learn' | 'Media' | 'Productivity' | 'Tools';
  highlight?: boolean;
}

const FEATURES: Feature[] = [
  { href: '/', label: 'Home', icon: Home, color: 'from-blue-500 to-cyan-500', description: 'Hub', category: 'Learn' },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-indigo-500 to-purple-500', description: 'Overview', category: 'Learn', highlight: true },
  { href: '/news', label: 'News', icon: Newspaper, color: 'from-rose-500 to-pink-500', description: 'Live news', category: 'Media', highlight: true },
  { href: '/science', label: 'Science', icon: Beaker, color: 'from-emerald-500 to-teal-500', description: 'Research', category: 'Learn' },
  { href: '/chemistry', label: 'Chemistry', icon: Atom, color: 'from-green-500 to-emerald-500', description: 'Compounds', category: 'Learn' },
  { href: '/maths', label: 'Maths', icon: Calculator, color: 'from-orange-500 to-amber-500', description: 'Math facts', category: 'Learn' },
  { href: '/daily-learning', label: 'Daily Learning', icon: GraduationCap, color: 'from-violet-500 to-purple-500', description: 'Insights', category: 'Learn', highlight: true },
  { href: '/vedic-learning', label: 'Vedic', icon: BookMarked, color: 'from-amber-500 to-yellow-500', description: 'Ancient wisdom', category: 'Learn' },
  { href: '/vedas', label: 'Vedas', icon: BookText, color: 'from-yellow-500 to-amber-500', description: 'Sacred texts', category: 'Learn' },
  { href: '/upanishads', label: 'Upanishads', icon: BookText, color: 'from-yellow-600 to-orange-500', description: 'Philosophy', category: 'Learn' },
  { href: '/translations', label: 'Translate', icon: Languages, color: 'from-cyan-500 to-blue-500', description: 'AI translate', category: 'Tools' },
  { href: '/slokas', label: 'Slokas', icon: FileText, color: 'from-orange-400 to-rose-500', description: 'Verses', category: 'Learn' },
  { href: '/weather', label: 'Weather', icon: Cloud, color: 'from-sky-500 to-blue-500', description: 'Forecast', category: 'Media' },
  { href: '/crypto', label: 'Crypto', icon: DollarSign, color: 'from-amber-500 to-yellow-500', description: 'Markets', category: 'Media', highlight: true },
  { href: '/movies', label: 'Movies', icon: Film, color: 'from-red-500 to-rose-500', description: 'Discover', category: 'Media' },
  { href: '/quotes', label: 'Quotes', icon: Quote, color: 'from-pink-500 to-rose-500', description: 'Inspiration', category: 'Media' },
  { href: '/blogs', label: 'Blogs', icon: BookOpen, color: 'from-indigo-500 to-blue-500', description: 'Articles', category: 'Media' },
  { href: '/todo', label: 'Todo', icon: CheckSquare, color: 'from-green-500 to-emerald-500', description: 'Tasks', category: 'Productivity' },
  { href: '/pomodoro', label: 'Pomodoro', icon: Timer, color: 'from-red-500 to-orange-500', description: 'Focus timer', category: 'Productivity' },
  { href: '/habits', label: 'Habits', icon: Moon, color: 'from-indigo-500 to-violet-500', description: 'Daily habits', category: 'Productivity' },
  { href: '/notes', label: 'Notes', icon: PenTool, color: 'from-yellow-500 to-amber-500', description: 'Quick notes', category: 'Productivity' },
  { href: '/password-generator', label: 'Password', icon: Sparkles, color: 'from-fuchsia-500 to-purple-500', description: 'Generator', category: 'Tools' },
  { href: '/gradient-generator', label: 'Gradient', icon: Sparkles, color: 'from-pink-500 to-rose-500', description: 'CSS gen', category: 'Tools' },
  { href: '/tip-calculator', label: 'Tip Calc', icon: Sparkles, color: 'from-emerald-500 to-teal-500', description: 'Quick math', category: 'Tools' },
  { href: '/mortgage-calculator', label: 'Mortgage', icon: Sparkles, color: 'from-blue-500 to-cyan-500', description: 'Calculator', category: 'Tools' },
  { href: '/saved', label: 'Saved', icon: Bookmark, color: 'from-purple-500 to-pink-500', description: 'Your saves', category: 'Productivity' },
  { href: '/settings', label: 'Settings', icon: Settings, color: 'from-zinc-500 to-slate-500', description: 'Preferences', category: 'Tools' },
];

const CATEGORIES: Array<Feature['category'] | 'All'> = ['All', 'Learn', 'Media', 'Productivity', 'Tools'];

export function FeatureShowcase() {
  const [active, setActive] = useState<Feature['category'] | 'All'>('All');

  const filtered = active === 'All' ? FEATURES : FEATURES.filter((f) => f.category === active);

  return (
    <BentoCard variant="default" size="lg" className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-pretty">
              <span className="text-gradient">What You Can Do</span>
            </h2>
            <p className="text-[11px] text-muted-foreground/60">
              {FEATURES.length} features across learning, media, productivity, and tools
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 p-1 rounded-lg glass-strong border border-white/5 self-start sm:self-auto overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                'px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap',
                active === cat
                  ? 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 text-foreground shadow-[0_0_12px_rgba(96,165,250,0.15)]'
                  : 'text-muted-foreground/60 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filtered.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.3 }}
            >
              <Link
                href={feature.href}
                className="group relative block p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 overflow-hidden hover-lift"
              >
                {feature.highlight && (
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-2xl pointer-events-none" />
                )}
                <div className="relative flex items-start gap-2.5">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110',
                      feature.color
                    )}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[12.5px] font-semibold text-foreground/90 truncate leading-tight">
                        {feature.label}
                      </h3>
                      {feature.highlight && (
                        <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)] shrink-0" />
                      )}
                    </div>
                    <p className="text-[10.5px] text-muted-foreground/60 mt-0.5 truncate">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="absolute top-3 right-3 w-3 h-3 text-muted-foreground/0 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </BentoCard>
  );
}
