'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/services/quotes';
import { useQuoteStore } from '@/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import type { Quote, QuoteCategory } from '@/types';
import { Quote as QuoteIcon, Heart, Sparkles, Bookmark, Clock as ClockIcon } from 'lucide-react';
import { LiveClock } from '@/components/ui/live-clock';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { useLanguage } from '@/contexts/LanguageContext';

const categories: { label: string; value: QuoteCategory | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Discipline', value: 'discipline' },
  { label: 'Philosophy', value: 'philosophy' },
  { label: 'Science', value: 'science' },
  { label: 'Success', value: 'success' },
  { label: 'Spirituality', value: 'spirituality' },
  { label: 'Business', value: 'business' },
];

const categoryTranslations: Record<string, Record<string, string>> = {
  en: {
    All: 'All',
    Discipline: 'Discipline',
    Philosophy: 'Philosophy',
    Science: 'Science',
    Success: 'Success',
    Spirituality: 'Spirituality',
    Business: 'Business'
  },
  hi: {
    All: 'सभी',
    Discipline: 'अनुशासन',
    Philosophy: 'दर्शन',
    Science: 'विज्ञान',
    Success: 'सफलता',
    Spirituality: 'आध्यात्मिकता',
    Business: 'व्यापार'
  },
  es: {
    All: 'Todo',
    Discipline: 'Disciplina',
    Philosophy: 'Filosofía',
    Science: 'Ciencia',
    Success: 'Éxito',
    Spirituality: 'Espiritualidad',
    Business: 'Negocios'
  }
};

const gradients = [
  'from-pink-500/10 via-purple-500/10 to-blue-500/10',
  'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
  'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
  'from-blue-500/10 via-indigo-500/10 to-violet-500/10',
  'from-rose-500/10 via-pink-500/10 to-fuchsia-500/10',
  'from-cyan-500/10 via-sky-500/10 to-blue-500/10',
];

export default function QuotesPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<QuoteCategory | 'All'>('All');
  const { addFavorite, removeFavorite, isFavorite } = useQuoteStore();

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['infinite-quotes', activeCategory],
    queryFn: ({ pageParam = 1 }) => fetchQuotes(pageParam, 16, activeCategory),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // YTS and quotes are sliced by 16. If we returned less than 16, we hit the end of available items
      return lastPage.length === 16 ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const displayQuotes = useMemo(() => data?.pages.flat() || [], [data?.pages]);
  const dailyQuote = useMemo(() => displayQuotes[0] || null, [displayQuotes]);

  const toggleFavorite = (q: Quote) => {
    if (isFavorite(q.id)) {
      removeFavorite(q.id);
    } else {
      addFavorite(q.id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 120, damping: 14 },
    },
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-pink-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(251,191,36,0.2)]"
            >
              <QuoteIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Badge variant="secondary" className="gap-1.5 py-0.5 text-[10px] font-mono border-white/10">
                  <ClockIcon className="w-3 h-3 text-amber-300" />
                  <LiveClock />
                </Badge>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                  {displayQuotes.length} quotes
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
                {t.quotes.title}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                {t.quotes.subtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 h-px divider-gradient" />
      </div>

      {dailyQuote && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-orange-500/10 backdrop-blur-xl hover-lift shimmer-border">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.1),transparent_50%)]" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-breathe" />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                  {t.quotes.dailyQuote}
                </Badge>
              </div>
              <blockquote className="text-xl sm:text-2xl font-medium text-white/90 leading-relaxed italic">
                &ldquo;{dailyQuote.text}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-amber-300/80 font-medium">&mdash; {dailyQuote.author}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(dailyQuote)}
                  className="gap-2"
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isFavorite(dailyQuote.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white/40'
                    )}
                  />
                  {isFavorite(dailyQuote.id) ? t.common.saved : t.common.save}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-3">
        {categories.map(({ label, value }) => {
          const displayLabel = categoryTranslations[lang]?.[label] || label;
          return (
            <motion.div
              key={value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeCategory === value ? 'default' : 'outline'}
                onClick={() => setActiveCategory(value)}
                className={cn(
                  'gap-2',
                  activeCategory === value && 'shadow-lg shadow-amber-500/20'
                )}
              >
                {displayLabel}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse border-white/5 bg-white/[0.03]" />
          ))}
        </div>
      ) : displayQuotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <QuoteIcon className="h-16 w-16 mb-4" />
          <p className="text-xl">{t.quotes.noQuotes}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2"
          >
            {displayQuotes.map((q, idx) => (
              <motion.div key={q.id} variants={itemVariants}>
                <Card
                  className={cn(
                    'group relative h-full overflow-hidden border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl',
                    'bg-gradient-to-br',
                    gradients[idx % gradients.length]
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.05),transparent_50%)]" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="border-white/10 text-white/60 capitalize"
                      >
                        {categoryTranslations[lang]?.[q.category.charAt(0).toUpperCase() + q.category.slice(1)] || q.category}
                      </Badge>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleFavorite(q)}
                        className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4 transition-all duration-300',
                            isFavorite(q.id)
                              ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                              : 'text-white/30 group-hover:text-white/50'
                          )}
                        />
                      </motion.button>
                    </div>
                    <blockquote className="text-base sm:text-lg text-white/85 leading-relaxed italic">
                      &ldquo;{q.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-sm text-white/50 font-medium">&mdash; {q.author}</span>
                      {isFavorite(q.id) && (
                        <Bookmark className="h-3.5 w-3.5 text-red-400/60" />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {!isPending && displayQuotes.length > 0 && (
            <InfiniteScroll
              hasMore={!!hasNextPage}
              isLoading={isFetchingNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </div>
      )}
    </div>
  );
}
