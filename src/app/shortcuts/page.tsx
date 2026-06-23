'use client';
import { motion } from 'framer-motion';
import {
  Keyboard, Search, Compass, Zap, ArrowRight, Sparkles,
  Command, Home, Newspaper, LayoutDashboard, Quote as QuoteIcon,
  CheckSquare, Cloud, Settings, ChevronLeft, Sun,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { BentoCard } from '@/components/ui/bento-card';

const SECTIONS = [
  {
    title: 'Global shortcuts',
    description: 'These work from anywhere in the app',
    icon: Zap,
    items: [
      { keys: ['⌘', 'K'], description: 'Open command palette', icon: Command },
      { keys: ['/'], description: 'Focus floating search', icon: Search },
      { keys: ['?'], description: 'Toggle this shortcuts panel', icon: Keyboard },
      { keys: ['Esc'], description: 'Close any open modal', icon: ChevronLeft },
      { keys: ['['], description: 'Toggle sidebar collapse', icon: Compass },
    ],
  },
  {
    title: 'Quick navigation',
    description: 'Press G then a key to instantly jump',
    icon: Compass,
    items: [
      { keys: ['G', 'H'], description: 'Go to Home', icon: Home },
      { keys: ['G', 'N'], description: 'Go to News', icon: Newspaper },
      { keys: ['G', 'D'], description: 'Go to Dashboard', icon: LayoutDashboard },
      { keys: ['G', 'Q'], description: 'Go to Quotes', icon: QuoteIcon },
      { keys: ['G', 'T'], description: 'Go to Todo', icon: CheckSquare },
      { keys: ['G', 'W'], description: 'Go to Weather', icon: Cloud },
      { keys: ['G', 'S'], description: 'Go to Settings', icon: Settings },
    ],
  },
  {
    title: 'Appearance',
    description: 'Customize your visual experience',
    icon: Sparkles,
    items: [
      { keys: ['T'], description: 'Toggle theme (light / dark / system)', icon: Sun },
    ],
  },
];

export default function ShortcutsPage() {
  return (
    <div className="pb-12">
      <PageHeader
        title="Keyboard Shortcuts"
        description="Master the keyboard to fly through the entire ecosystem without lifting your hands."
        icon={Keyboard}
        badge="Power user"
      />

      {/* Quick start cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <BentoCard variant="aurora" size="md" className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Command className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Command Palette</h3>
              <p className="text-[11px] text-muted-foreground/60">Search 25+ features</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">
            The fastest way to jump anywhere. Type a feature name, hit enter, done.
          </p>
          <div className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-white/10 text-[11px] font-mono border border-white/10">⌘</kbd>
            <span className="text-muted-foreground/40">+</span>
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-white/10 text-[11px] font-mono border border-white/10">K</kbd>
          </div>
        </BentoCard>

        <BentoCard variant="gradient" size="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Quick Search</h3>
              <p className="text-[11px] text-muted-foreground/60">Find anything</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">
            Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] font-mono">/</kbd> from anywhere to launch global content search.
          </p>
          <div className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-white/10 text-[11px] font-mono border border-white/10">/</kbd>
          </div>
        </BentoCard>

        <BentoCard variant="gradient" size="md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Quick nav</h3>
              <p className="text-[11px] text-muted-foreground/60">G + key combo</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">
            Combine G with a letter to teleport to a page. Example: G then N for News.
          </p>
          <div className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-white/10 text-[11px] font-mono border border-white/10">G</kbd>
            <span className="text-muted-foreground/40">+</span>
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-white/10 text-[11px] font-mono border border-white/10">N</kbd>
          </div>
        </BentoCard>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section, sIdx) => {
          const SectionIcon = section.icon;
          return (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: sIdx * 0.05 }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center">
                  <SectionIcon className="w-3.5 h-3.5 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground/90">{section.title}</h2>
                  <p className="text-[11px] text-muted-foreground/60">{section.description}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-blue-300" />
                        </div>
                        <span className="text-sm text-foreground/80">{item.description}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, ki) => (
                          <span key={ki} className="flex items-center gap-1">
                            <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-white/10 text-[11px] font-mono text-foreground/90 border border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_-1px_0_rgba(0,0,0,0.2)_inset]">
                              {k}
                            </kbd>
                            {ki < item.keys.length - 1 && (
                              <span className="text-muted-foreground/40 text-[10px]">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <Link
          href="/"
          className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-strong border border-white/5 hover:border-blue-400/30 transition-all hover-lift"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/90">Ready to try them out?</h3>
              <p className="text-[11px] text-muted-foreground/70">Open the command palette with ⌘K and explore</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
        </Link>
      </motion.div>
    </div>
  );
}
