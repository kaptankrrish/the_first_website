'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bookmark, BookMarked, Volume2, Share2, ChevronDown, ChevronUp, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { useVedicStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVedic } from '@/hooks/useVedic';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
};

export default function SlokasPage() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isBookmarked, addBookmark, removeBookmark } = useVedicStore();
  const { items: mantras, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useVedic('Slokas');

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/vedic-learning">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 via-rose-500/20 to-amber-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(249,115,22,0.2)]"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-orange-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                  </span>
                  Sacred
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                  मन्त्राः · Mantras
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
                {t.nav.slokas}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                Sacred chants and verses for meditation, peace, and spiritual awakening
              </p>
            </div>
          </div>

          <div className="mt-5 h-px divider-gradient" />
        </div>

        {isLoading && mantras.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-48">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {mantras.map((item) => {
                const expanded = expandedId === item.id;
                const bookmarked = isBookmarked(item.id);

                return (
                  <motion.div key={item.id} layout variants={itemAnim} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card
                      className={cn(
                        'group cursor-pointer transition-all duration-300 hover:border-rose-500/30 hover:shadow-xl hover:shadow-rose-500/5',
                        expanded && 'border-rose-500/40 md:col-span-2'
                      )}
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                            <p className="mt-3 font-serif text-3xl leading-relaxed tracking-wide text-rose-200/90">
                              {item.sanskrit}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (bookmarked) {
                                removeBookmark(item.id);
                              } else {
                                addBookmark(item.id);
                              }
                            }}
                          >
                            {bookmarked ? (
                              <BookMarked className="h-4 w-4 text-rose-400" />
                            ) : (
                              <Bookmark className="h-4 w-4 text-white/40" />
                            )}
                          </Button>
                        </div>
                        <CardDescription className="mt-3 text-base leading-relaxed">
                          {item.english}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/20 text-rose-300 text-xs">
                            {item.source} — {item.chapter}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (expanded) {
                                setExpandedId(null);
                              } else {
                                setExpandedId(item.id);
                              }
                            }}
                          >
                            {expanded ? (
                              <ChevronUp className="h-4 w-4 text-white/60" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-white/60" />
                            )}
                          </Button>
                        </div>
                      </CardContent>

                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                            className="overflow-hidden"
                          >
                            <CardContent className="border-t border-white/10 pt-5 space-y-5">
                              <div className="space-y-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                                  Transliteration
                                </span>
                                <p className="text-lg italic leading-relaxed text-white/80">
                                  {item.transliteration}
                                </p>
                              </div>

                              <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                                    Hindi
                                  </span>
                                  <p className="text-white/80 leading-relaxed">{item.hindi}</p>
                                </div>
                                <div className="space-y-2">
                                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                                    English
                                  </span>
                                  <p className="text-white/80 leading-relaxed">{item.english}</p>
                                </div>
                              </div>

                              <div className="rounded-lg bg-rose-500/10 p-4 space-y-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-rose-400/80">
                                  Explanation
                                </span>
                                <p className="text-sm text-white/70 leading-relaxed">{item.explanation}</p>
                              </div>

                              <div className="rounded-lg bg-gradient-to-br from-rose-500/10 to-amber-500/10 p-4 space-y-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                                  Philosophy
                                </span>
                                <p className="text-sm text-white/70 leading-relaxed">{item.philosophy}</p>
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-rose-500/30 text-rose-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Volume2 className="mr-2 h-4 w-4" />
                                  Pronounce
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(
                                      `${item.title}\n\n${item.sanskrit}\n\n${item.transliteration}`
                                    );
                                  }}
                                >
                                  <Share2 className="h-4 w-4 text-white/40" />
                                </Button>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-rose-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Fetching more sacred verses...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
