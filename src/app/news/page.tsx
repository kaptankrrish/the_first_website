'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle,
  Newspaper,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNews } from '@/hooks/useNews';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSavedStore } from '@/store';
import { getTimeAgo, truncate } from '@/utils';
import type { Article, SavedItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';
import { type Translations } from '@/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const categories = ['All', 'AI', 'Technology', 'Science', 'Crypto', 'Finance', 'Startups', 'World', 'Space'] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function NewsPage() {
  const {
    articles,
    loading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
  } = useNews();

  const { isSaved, addSavedItem, removeSavedItem } = useSavedStore();
  const { t, lang } = useLanguage();
  const { success } = useToast();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearch(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearchQuery(value), 400);
    },
    [setSearchQuery]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, loadMore]);

  const handleSave = useCallback(
    (article: Article) => {
      if (isSaved(article.id)) {
        removeSavedItem(article.id);
        success('Article removed from reading list');
      } else {
        const item: SavedItem = {
          id: article.id,
          type: 'news',
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.imageUrl,
          savedAt: new Date().toISOString(),
        };
        addSavedItem(item);
        success('Article saved to your reading list');
      }
    },
    [isSaved, addSavedItem, removeSavedItem, success]
  );

  const handleTabChange = useCallback(
    (value: string) => setActiveCategory(value),
    [setActiveCategory]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 noise-overlay pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(244,114,182,0.2)]"
            >
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200" />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-emerald-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  </span>
                  {t.news.live}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold">
                  AI News
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold kinetic-text leading-tight text-balance">
                {t.news.title}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                Real-time headlines from BBC, Reuters, TechCrunch, WIRED, NPR, and Al Jazeera.
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300" />
            <Input
              placeholder={t.news.searchNews}
              value={localSearch}
              onChange={handleSearchChange}
              className="pl-10 glass-strong border-white/10 focus-visible:border-blue-400/40"
            />
          </div>
        </div>

        <div className="mt-5 h-px divider-gradient" />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={handleTabChange} className="w-full">
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="inline-flex h-auto w-max gap-1 glass-strong p-1.5 border border-white/5">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-white data-[state=active]:shadow-[0_0_12px_rgba(96,165,250,0.2)] data-[state=active]:border data-[state=active]:border-blue-400/20 text-muted-foreground/70 hover:text-foreground"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            {loading && articles.length === 0 ? (
              <SkeletonGrid />
            ) : articles.length === 0 ? (
              <EmptyState searchQuery={searchQuery} t={t} />
            ) : (
              <ArticleGrid
                articles={articles}
                isSaved={isSaved}
                onSave={handleSave}
                onCardClick={setSelectedArticle}
                t={t}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-10" />
      {loading && articles.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-white/60">
          <RefreshCw className="h-4 w-4 animate-spin" />
          {t.news.loadingMore}
        </div>
      )}

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(o) => { if (!o) setSelectedArticle(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{selectedArticle.source}</Badge>
                    <Badge variant="default" className="text-xs">{selectedArticle.category}</Badge>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(selectedArticle.publishedAt)}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              {selectedArticle.imageUrl && (
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white/50 mb-1">{t.news.summary}</h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <>{children}</>,
                      }}
                    >
                      {selectedArticle.description || 'No summary available.'}
                    </ReactMarkdown>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-white/40">
                  {selectedArticle.author && selectedArticle.author !== 'Unknown' && (
                    <span>{t.news.author}: {selectedArticle.author}</span>
                  )}
                  <span>{t.news.published}: {new Date(selectedArticle.publishedAt).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'hi' ? 'hi-IN' : 'es-ES')}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="default" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    {t.news.readFullArticle}
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const article = selectedArticle;
                    if (isSaved(article.id)) {
                      removeSavedItem(article.id);
                      success('Article removed from reading list');
                    } else {
                      const item: SavedItem = {
                        id: article.id,
                        type: 'news',
                        title: article.title,
                        description: article.description,
                        url: article.url,
                        imageUrl: article.imageUrl,
                        savedAt: new Date().toISOString(),
                      };
                      addSavedItem(item);
                      success('Article saved to your reading list');
                    }
                  }}
                  className="gap-2"
                >
                  {isSaved(selectedArticle.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {isSaved(selectedArticle.id) ? t.common.saved : t.common.save}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="bento-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className={cn("overflow-hidden", i === 0 ? "bento-span-2" : "")}>
          <Skeleton className="h-48 w-full rounded-none" />
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ searchQuery, t }: { searchQuery: string; t: Translations }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center glass-strong rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-white/5 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-blue-300" />
      </div>
      <h3 className="text-base font-semibold text-foreground/90">
        {searchQuery ? `${t.news.noResults} "${searchQuery}"` : t.news.noArticles}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground/70 max-w-md text-pretty">
        {searchQuery ? t.news.tryDifferent : t.news.checkBack}
      </p>
    </div>
  );
}

function ArticleGrid({
  articles,
  isSaved,
  onSave,
  onCardClick,
  t,
}: {
  articles: Article[];
  isSaved: (id: string) => boolean;
  onSave: (article: Article) => void;
  onCardClick?: (article: Article) => void;
  t: Translations;
}) {
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bento-grid"
      >
        <AnimatePresence mode="popLayout">
          {articles.map((article, index) => (
          <motion.div
            key={article.id}
            layout
            variants={cardVariants}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              index % 5 === 0 ? 'bento-span-2' : ''
            )}
          >
            <Card
              className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer shimmer-border card-hover-magnetic"
              onClick={() => onCardClick?.(article)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-500/20', 'via-purple-500/20', 'to-pink-500/20');
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Newspaper className="h-12 w-12 text-white/10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-xs backdrop-blur-md"
                  >
                    {article.source}
                  </Badge>
                  <Badge variant="default" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(article);
                  }}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60"
                >
                  {isSaved(article.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-white" />
                  )}
                </Button>
              </div>

              {/* Content */}
              <CardHeader className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeAgo(article.publishedAt)}</span>
                </div>
                <CardTitle className="line-clamp-2 text-base leading-snug">
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white/80"
                  >
                    {article.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <>{children}</>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-white/60 underline underline-offset-2 hover:text-white"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {truncate(article.description, 150)}
                  </ReactMarkdown>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <Link
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-white/50 transition-colors hover:text-white"
                >
                  {t.common.readMore}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
