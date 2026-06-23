'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Bookmark, BookMarked, Volume2, Share2, ChevronDown, ChevronUp, ArrowLeft, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { vedicContent } from '@/content/vedic';
import { useVedicStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
};

function getSourceColor(source: string): string {
  if (source.includes('Gita')) return 'border-amber-500/30 bg-amber-500/20 text-amber-300';
  if (source.includes('Upanishad')) return 'border-indigo-500/30 bg-indigo-500/20 text-indigo-300';
  if (source === 'Rigveda') return 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300';
  return 'border-rose-500/30 bg-rose-500/20 text-rose-300';
}

export default function TranslationsPage() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addBookmark, removeBookmark, isBookmarked } = useVedicStore();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vedicContent;
    return vedicContent.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.sanskrit.includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.hindi.includes(q) ||
        item.transliteration.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-sky-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(34,211,238,0.2)]"
            >
              <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-200" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-cyan-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  </span>
                  Multilingual
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                  अनुवाद · Translations
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
                {t.nav.translations}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                Side-by-side Sanskrit, Hindi, and English for all Vedic texts
              </p>
            </div>
          </div>

          <div className="mt-5 h-px divider-gradient" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search across all texts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const expanded = expandedId === item.id;
              const bookmarked = isBookmarked(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemAnim}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <Card
                    className={cn(
                      'group cursor-pointer transition-all duration-300 hover:border-white/20',
                      expanded && 'border-blue-500/40'
                    )}
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium">{item.title}</CardTitle>
                          <Badge
                            variant="outline"
                            className={cn('mt-1.5 text-xs', getSourceColor(item.source))}
                          >
                            {item.source}
                          </Badge>
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
                            <BookMarked className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Bookmark className="h-4 w-4 text-white/40" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                            Sanskrit
                          </span>
                          <p className="font-serif text-lg leading-relaxed text-amber-200/90">
                            {item.sanskrit}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                            Hindi
                          </span>
                          <p className="text-sm leading-relaxed text-white/80">
                            {item.hindi}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                            English
                          </span>
                          <p className="text-sm leading-relaxed text-white/70">
                            {item.english}
                          </p>
                        </div>
                      </div>
                    </CardContent>

                    <div className="px-6 pb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-white/40 hover:text-white"
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
                          <>
                            <ChevronUp className="mr-1 h-3 w-3" /> Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-3 w-3" /> View full details
                          </>
                        )}
                      </Button>
                    </div>

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
                              <p className="italic text-white/80">{item.transliteration}</p>
                            </div>

                            <div className="rounded-lg bg-white/5 p-4 space-y-2">
                              <span className="text-xs font-medium uppercase tracking-wider text-blue-400/80">
                                Explanation
                              </span>
                              <p className="text-sm text-white/70 leading-relaxed">{item.explanation}</p>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 space-y-2">
                              <span className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">
                                Philosophy
                              </span>
                              <p className="text-sm text-white/70 leading-relaxed">{item.philosophy}</p>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 text-blue-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Volume2 className="mr-2 h-4 w-4" />
                                Listen
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    `${item.title}\n\nSanskrit: ${item.sanskrit}\nHindi: ${item.hindi}\nEnglish: ${item.english}`
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

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-white/40"
          >
            {t.common.noResults} for &quot;{searchQuery}&quot;
          </motion.p>
        )}
      </div>
    </div>
  );
}
