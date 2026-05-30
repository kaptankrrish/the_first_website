'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchScienceArticles } from '@/services/science';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { formatDate, truncate } from '@/utils';
import { BookOpen, Calendar, User, Atom, Rocket, Dna, Telescope, Sparkles, Search, FlaskConical, Sigma, Clock as ClockIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';

const categories = [
  { label: 'All', value: 'All', icon: Sparkles },
  { label: 'Physics', value: 'Physics', icon: Telescope },
  { label: 'Chemistry', value: 'Chemistry', icon: FlaskConical },
  { label: 'Maths', value: 'Maths', icon: Sigma },
  { label: 'AI', value: 'AI', icon: Atom },
  { label: 'Space', value: 'Space', icon: Rocket },
  { label: 'Biology', value: 'Biology', icon: Dna },
];

const categoryBadgeClass: Record<string, string> = {
  Space: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  AI: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Physics: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Biology: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Science: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Chemistry: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Maths: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
};

const sourceBadgeClass: Record<string, string> = {
  NASA: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  arXiv: 'bg-red-600/20 text-red-400 border-red-600/30',
};

export default function SciencePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

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
    status,
  } = useInfiniteQuery({
    queryKey: ['science-articles'],
    queryFn: ({ pageParam = 1 }) => fetchScienceArticles(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 10 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 15,
  });

  const articles = useMemo(() => data?.pages.flat() || [], [data?.pages]);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, activeCategory, search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-400" />
          {t.nav.science}
          <Badge variant="secondary" className="ml-2 gap-1.5 py-1 text-sm font-normal">
            <ClockIcon className="w-4 h-4 text-blue-400" />
            <LiveClock />
          </Badge>
        </h1>
        <p className="text-white/60 text-lg">
          Explore breakthroughs from NASA, arXiv, and CERN in real-time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder={t.common.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map(({ label, value, icon: Icon }) => (
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
                  activeCategory === value && 'shadow-lg shadow-blue-500/20'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {status === 'pending' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-white/5">
              <div className="p-6 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <Telescope className="h-16 w-16 mb-4" />
          <p className="text-xl">{t.science.noArticles}</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <Card className="group h-full overflow-hidden border-white/5 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-blue-500/5">
                {article.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden relative">
                    <Image 
                      src={article.imageUrl} 
                      alt={article.title}
                      fill
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 border',
                          categoryBadgeClass[article.category] || 'border-white/20'
                        )}
                      >
                        {article.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 border',
                          sourceBadgeClass[article.source] || 'border-white/10 bg-white/5'
                        )}
                      >
                        {article.source}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-3 line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                    {truncate(article.title, 100)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
                    {truncate(article.description, 200)}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-white/40">
                    <div className="flex items-center gap-4">
                      {article.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {truncate(article.author, 20)}
                        </span>
                      )}
                      {article.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.publishedAt)}
                        </span>
                      )}
                    </div>
                    {article.url && (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        Explore <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {status !== 'pending' && filtered.length > 0 && (
        <div className="py-12 flex flex-col items-center gap-4">
          {hasNextPage ? (
             <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-white/60 hover:text-white hover:bg-white/5 gap-2"
             >
                {isFetchingNextPage ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isFetchingNextPage ? 'Discovering more breakthroughs...' : 'Load more discoveries'}
             </Button>
          ) : (
            <p className="text-white/20 text-sm">You have reached the edge of current scientific knowledge.</p>
          )}
          <div className="h-1 w-1" id="infinite-scroll-trigger" />
        </div>
      )}
    </div>
  );
}
