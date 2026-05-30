'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Bookmark, BookMarked, Volume2, Share2, ChevronDown, ChevronUp, Clock as ClockIcon, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';
import { vedicCategories } from '@/content/vedic';
import { useVedicStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { LiveClock } from '@/components/ui/live-clock';
import { useVedic } from '@/hooks/useVedic';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
};

const categoryMap: Record<string, string | undefined> = {
  all: undefined,
  'Bhagavad Gita': 'Bhagavad Gita',
  Upanishads: 'Upanishads',
  Rigveda: 'Rigveda',
  Mantras: 'Slokas',
};

function getSourceColor(source: string): string {
  if (source.includes('Gita')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  if (source.includes('Upanishad')) return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
  if (source === 'Rigveda') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
}

export default function VedicLearningPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { items: vedicContent, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useVedic(categoryMap[activeTab]);
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

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  const { isBookmarked, addBookmark, removeBookmark, progress, markComplete } = useVedicStore();

  const filteredContent = vedicContent.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.sanskrit.includes(q) ||
      item.english.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            वेदान्त
            <span className="ml-3 bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent flex items-center gap-2">
              {t.nav.vedicLearning}
              <Badge variant="secondary" className="gap-1.5 py-1 text-sm font-normal">
                <ClockIcon className="w-4 h-4 text-amber-400" />
                <LiveClock />
              </Badge>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/60"
          >
            Explore the timeless wisdom of the Vedas, Upanishads, and Bhagavad Gita
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-white/70">Mastery Progress</span>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (Object.keys(progress).length / 20) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
                />
              </div>
              <span className="min-w-[4rem] text-right text-sm font-medium text-white/70">
                {Object.keys(progress).length} items learned
              </span>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="overflow-x-auto">
              {vedicCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="whitespace-nowrap">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder={t.common.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && vedicContent.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-40">
                    <CardHeader>
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-10 w-3/4" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredContent.map((item) => {
                    const expanded = expandedId === item.id;
                    const bookmarked = isBookmarked(item.id);
                    const isCompleted = progress[item.id];

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        variants={itemAnim}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      >
                        <Card
                          className={cn(
                            'group cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-amber-500/5',
                            expanded && 'border-amber-500/40 sm:col-span-2 lg:col-span-3'
                          )}
                          onClick={() => setExpandedId(expanded ? null : item.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base font-medium line-clamp-2">
                                  {item.title}
                                </CardTitle>
                                <p className="mt-1.5 font-serif text-lg leading-relaxed text-amber-200/90">
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
                                  <BookMarked className="h-4 w-4 text-amber-400" />
                                ) : (
                                  <Bookmark className="h-4 w-4 text-white/40" />
                                )}
                              </Button>
                            </div>
                            <CardDescription className="mt-2 line-clamp-2">
                              {item.english}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={cn('text-xs', getSourceColor(item.source))}
                              >
                                {item.source}
                              </Badge>
                              <div className="flex items-center gap-2">
                                {isCompleted && (
                                  <span className="text-xs text-emerald-400">&#10003; Complete</span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const id = item.id;
                                    if (expanded) {
                                      setExpandedId(null);
                                    } else {
                                      setExpandedId(id);
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
                                  <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                      <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                                        Transliteration
                                      </span>
                                      <p className="italic text-white/80">{item.transliteration}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                                        Chapter
                                      </span>
                                      <p className="text-white/80">{item.chapter}</p>
                                    </div>
                                  </div>

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

                                  <div className="rounded-lg bg-white/5 p-4 space-y-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
                                      Explanation
                                    </span>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                      {item.explanation}
                                    </p>
                                  </div>

                                  <div className="rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 space-y-2">
                                    <span className="text-xs font-medium uppercase tracking-wider text-indigo-400/80">
                                      Philosophy
                                    </span>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                      {item.philosophy}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markComplete(item.id);
                                      }}
                                      className={cn(
                                        isCompleted && 'border-emerald-500/50 text-emerald-400'
                                      )}
                                    >
                                      {isCompleted ? 'Completed' : 'Mark Complete'}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Volume2 className="h-4 w-4 text-white/40" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(
                                          `${item.title}\n\n${item.sanskrit}\n\n${item.english}`
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
            
            <div ref={loadMoreRef} className="h-24 flex items-center justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-amber-400">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Loading more ancient insights...</span>
                </div>
              )}
              {!hasNextPage && vedicContent.length > 0 && (
                <p className="text-white/20 text-sm">You have reached the end of the collection.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
