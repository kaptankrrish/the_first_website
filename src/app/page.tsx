'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles, Clock as ClockIcon, ArrowRight, Search, Zap,
  Newspaper, Atom, GraduationCap,
  Keyboard, BookOpen,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { LiveClock } from '@/components/ui/live-clock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDailyQuote } from '@/services/quotes';
import { QuickAccessWidgets } from '@/components/features/quick-access-widgets';
import { RecentlyUsedRail } from '@/components/features/recently-used-rail';
import { FeatureShowcase } from '@/components/features/feature-showcase';
import { useOnboardingStore } from '@/store';

const stats = [
  { key: 'articlesAnalyzed', label: 'Articles Analyzed', value: 15420, suffix: '+', icon: BookOpen, color: 'from-blue-500/20 to-cyan-500/20' },
  { key: 'topicsCovered', label: 'Topics Covered', value: 893, suffix: '+', icon: Atom, color: 'from-purple-500/20 to-pink-500/20' },
  { key: 'learningModules', label: 'Modules', value: 247, suffix: '+', icon: GraduationCap, color: 'from-emerald-500/20 to-teal-500/20' },
  { key: 'dailyUsers', label: 'Daily Users', value: 12800, suffix: '+', icon: Zap, color: 'from-amber-500/20 to-orange-500/20' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [quote, setQuote] = useState({ text: 'Loading wisdom...', author: 'AI Ecosystem' });
  const { startTour, hasCompletedTour } = useOnboardingStore();

  useEffect(() => {
    let mounted = true;
    getDailyQuote().then(q => {
      if (mounted && q) setQuote(q);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="pb-8 sm:pb-12 space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24 lg:py-28 text-center flex flex-col items-center justify-center">
        {/* Layered aurora glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/12 blur-[120px] rounded-full pointer-events-none animate-aurora" />
        <div
          className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-500/12 blur-[100px] rounded-full pointer-events-none animate-aurora"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/8 blur-[100px] rounded-full pointer-events-none animate-aurora"
          style={{ animationDelay: '-12s' }}
        />
        {/* Mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 noise-overlay pointer-events-none" />
        {/* Animated grid lines */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 text-[11px] font-semibold tracking-wider bg-white/5 border-white/10 text-foreground/80 uppercase backdrop-blur-md">
              <ClockIcon className="h-3 w-3 mr-1.5 text-blue-400" />
              <LiveClock />
            </Badge>
            <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 text-[11px] font-semibold tracking-wider bg-gradient-to-r from-blue-500/15 to-purple-500/15 border-blue-400/20 text-blue-300 uppercase backdrop-blur-md animate-pulse-soft">
              <Sparkles className="h-3 w-3 mr-1.5" />
              {(t.home as { knowledgeEcosystem?: string }).knowledgeEcosystem || 'Knowledge Ecosystem'}
            </Badge>
          </div>

          <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] mb-6 leading-[1.05] text-balance">
            <span className="kinetic-text text-shadow-glow">Infinite</span>
            <br />
            <span className="text-foreground/90">Knowledge Base</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light text-pretty">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/news" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 text-white px-6 sm:px-8 py-6 sm:py-7 rounded-2xl text-sm sm:text-base font-semibold transition-all group shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 ai-glow spring-hover"
              >
                <Newspaper className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                {t.home.newsFeed}
                <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/search" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto glass hover:bg-white/[0.06] border-white/10 hover:border-white/20 px-6 sm:px-8 py-6 sm:py-7 rounded-2xl text-sm sm:text-base font-medium transition-all group ai-border spring-hover"
              >
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-blue-300 transition-colors" />
                {t.common.search}
                <kbd className="ml-2 hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono border border-white/10">⌘K</kbd>
              </Button>
            </Link>
          </div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-8"
          >
            {['Real-time News', 'AI Learning', 'Crypto Tracking', 'Weather', 'Productivity'].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/[0.06] text-muted-foreground/60 hover:text-foreground/80 hover:bg-white/[0.08] hover:border-white/[0.12] transition-all cursor-default micro-scale"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {!hasCompletedTour && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={() => startTour()}
              className="mt-6 text-xs text-muted-foreground/50 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 group"
            >
              <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform" />
              New here? Take the 30-second tour
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* Quick Access Widgets */}
      <section className="px-4 sm:px-0 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <QuickAccessWidgets />
        </motion.div>
      </section>

      {/* Recently Used / Favorites */}
      <section className="px-4 sm:px-0 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <RecentlyUsedRail />
        </motion.div>
      </section>

      {/* Bento Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="px-4 sm:px-0 max-w-7xl mx-auto"
      >
        <div className="bento-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const statsTranslation = t.home.stats as Record<string, string>;
            const displayLabel = statsTranslation[stat.key] || stat.label;
            const spanClass = index === 0 ? 'bento-span-2' : '';
            return (
              <motion.div
                key={stat.key}
                variants={itemVariants}
                className={cn(
                  "relative overflow-hidden glass-premium rounded-2xl p-4 sm:p-6 text-center hover-lift group card-magnetic noise-overlay",
                  spanClass
                )}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.color)} />
                <div className="relative inline-flex items-center justify-center p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500/12 to-purple-500/12 border border-white/5 text-blue-300 mb-3 sm:mb-4 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(96,165,250,0.3)] transition-all duration-300">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="relative text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="relative text-[10px] sm:text-xs font-semibold text-muted-foreground/60 uppercase tracking-[0.15em]">{displayLabel}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Bento Box Features (Premium) */}
      <section className="px-4 sm:px-0 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <FeatureShowcase />
        </motion.div>
      </section>

      {/* Quote Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 sm:px-0"
      >
        <div className="max-w-4xl mx-auto relative p-8 sm:p-12 lg:p-16 rounded-3xl glass-premium shadow-2xl overflow-hidden group noise-overlay">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/12 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/12 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />
          <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70 font-semibold">
                Quote of the moment
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl text-foreground font-medium italic leading-tight mb-6 text-balance text-pretty">
              &ldquo;{quote.text}&rdquo;
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-blue-400 to-purple-400" />
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                {quote.author}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Shortcuts hint */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-4 sm:px-0 max-w-3xl mx-auto"
      >
        <Link
          href="/shortcuts"
          className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl glass-strong border border-white/5 hover:border-blue-400/20 transition-all hover-lift spring-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Keyboard className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground/90">Master the keyboard</h3>
              <p className="text-[11px] text-muted-foreground/60">Learn shortcuts to fly through the ecosystem</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
        </Link>
      </motion.section>
    </div>
  );
}
