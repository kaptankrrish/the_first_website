'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, FileText, Newspaper, BookOpen, Film, Bitcoin, Cloud, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { useNewsStore, useNoteStore } from '@/store';
import { vedicContent } from '@/content/vedic';
import { searchMovies } from '@/services/movies';
import { searchCoins } from '@/services/crypto';
import { searchCities } from '@/services/weather';
import type { Quote, Movie, CryptoCoin, City } from '@/types';

import { fetchQuotes } from '@/services/quotes';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const colorMap: Record<string, { bg: string; text: string; border: string; hoverBorder: string; shadow: string; badgeBg: string; badgeText: string }> = {
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-500/40', shadow: 'hover:shadow-blue-500/5', badgeBg: 'bg-blue-500/10', badgeText: 'text-blue-300/80' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', hoverBorder: 'hover:border-green-500/40', shadow: 'hover:shadow-green-500/5', badgeBg: 'bg-green-500/10', badgeText: 'text-green-300/80' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-500/40', shadow: 'hover:shadow-purple-500/5', badgeBg: 'bg-purple-500/10', badgeText: 'text-purple-300/80' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', hoverBorder: 'hover:border-orange-500/40', shadow: 'hover:shadow-orange-500/5', badgeBg: 'bg-orange-500/10', badgeText: 'text-orange-300/80' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', hoverBorder: 'hover:border-red-500/40', shadow: 'hover:shadow-red-500/5', badgeBg: 'bg-red-500/10', badgeText: 'text-red-300/80' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', hoverBorder: 'hover:border-yellow-500/40', shadow: 'hover:shadow-yellow-500/5', badgeBg: 'bg-yellow-500/10', badgeText: 'text-yellow-300/80' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', hoverBorder: 'hover:border-indigo-500/40', shadow: 'hover:shadow-indigo-500/5', badgeBg: 'bg-indigo-500/10', badgeText: 'text-indigo-300/80' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', hoverBorder: 'hover:border-pink-500/40', shadow: 'hover:shadow-pink-500/5', badgeBg: 'bg-pink-500/10', badgeText: 'text-pink-300/80' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', hoverBorder: 'hover:border-cyan-500/40', shadow: 'hover:shadow-cyan-500/5', badgeBg: 'bg-cyan-500/10', badgeText: 'text-cyan-300/80' },
  gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', hoverBorder: 'hover:border-gray-500/40', shadow: 'hover:shadow-gray-500/5', badgeBg: 'bg-gray-500/10', badgeText: 'text-gray-300/80' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-500/40', shadow: 'hover:shadow-emerald-500/5', badgeBg: 'bg-emerald-500/10', badgeText: 'text-emerald-300/80' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-500/40', shadow: 'hover:shadow-rose-500/5', badgeBg: 'bg-rose-500/10', badgeText: 'text-rose-300/80' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-500/40', shadow: 'hover:shadow-amber-500/5', badgeBg: 'bg-amber-500/10', badgeText: 'text-amber-300/80' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-slate-500/40 text-white rounded px-1 py-0.5 shadow-sm shadow-slate-500/20">{part}</mark> : part
  );
}

function SearchContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const articles = useNewsStore((s) => s.articles);
  const notes = useNoteStore((s) => s.notes);

  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchQuotes().then((fetched) => {
      if (mounted) setQuotes(fetched);
    });
    return () => { mounted = false; };
  }, []);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      Promise.resolve().then(() => {
        setMovies([]);
        setCoins([]);
        setCities([]);
      });
      return;
    }

    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setIsSearchingExternal(true);
    });

    Promise.allSettled([
      searchMovies(q),
      searchCoins(q),
      searchCities(q)
    ]).then((results) => {
      if (!isMounted) return;
      const movieRes = results[0].status === 'fulfilled' ? results[0].value as Movie[] : [];
      const coinRes = results[1].status === 'fulfilled' ? results[1].value as CryptoCoin[] : [];
      const cityRes = results[2].status === 'fulfilled' ? results[2].value as City[] : [];
      
      setMovies(movieRes.slice(0, 5));
      setCoins(coinRes.slice(0, 5));
      setCities(cityRes.slice(0, 5));
    }).finally(() => {
      if (isMounted) setIsSearchingExternal(false);
    });

    return () => { isMounted = false; };
  }, [debouncedQuery]);

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return { articles: [], notes: [], vedic: [], quotes: [] };

    const matchedArticles = articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );

    const matchedNotes = notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );

    const matchedVedic = vedicContent.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q) ||
        v.explanation.toLowerCase().includes(q)
    );

    const matchedQuotes = quotes.filter(
      (qt) => qt.text.toLowerCase().includes(q) || qt.author.toLowerCase().includes(q)
    );

    return {
      articles: matchedArticles,
      notes: matchedNotes,
      vedic: matchedVedic,
      quotes: matchedQuotes,
    };
  }, [debouncedQuery, articles, notes, quotes]);

  const totalResults = results.articles.length + results.notes.length + results.vedic.length + results.quotes.length + movies.length + coins.length + cities.length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      <PageWrapper
        icon={Search}
        title={t.nav.search}
        subtitle="Search across articles, notes, vedic texts, and more"
        badgeText="Global Search"
        colorScheme="slate"
      />

      {/* Command Palette Style Search */}
      <motion.div variants={itemVariants} className="relative z-20">
        <div className={cn(
          "relative transition-all duration-500 rounded-2xl",
          isFocused ? "shadow-[0_0_60px_rgba(99,102,241,0.25)] scale-[1.01]" : "shadow-none scale-100"
        )}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-500 pointer-events-none" style={{ opacity: isFocused ? 1 : 0 }} />
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
            isFocused ? "text-blue-300" : "text-white/40"
          )} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t.common.search}
            className={cn(
              "pl-12 h-16 text-lg rounded-2xl border-2 transition-all duration-300",
              isFocused 
                ? "bg-slate-900/80 border-blue-500/40 text-white placeholder:text-white/40" 
                : "bg-white/5 border-white/10 text-white/90 placeholder:text-white/30 hover:bg-white/10"
            )}
            autoFocus
          />
          {query && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                onClick={() => setQuery('')}
                className="text-white/40 hover:text-white/80 p-1 rounded-full hover:bg-white/10 transition-colors text-xs font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {debouncedQuery && (
          <motion.div
            key="results-header"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/5"
          >
            <p className="text-sm text-white/60">
              <span className="text-white font-semibold text-base">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &ldquo;<span className="text-white">{debouncedQuery}</span>&rdquo;
            </p>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(debouncedQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all border border-blue-500/20 text-sm font-medium w-full sm:w-auto shadow-sm shadow-blue-500/10 spring-hover"
            >
              <Search className="h-4 w-4" />
              Search Web
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {debouncedQuery && totalResults === 0 && !isSearchingExternal ? (
            <motion.div
              key="no-results"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-slate-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-slate-900/50 border border-slate-500/20 rounded-full flex items-center justify-center backdrop-blur-sm liquid-shape">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.common.noResults}</h3>
              <p className="text-sm text-white/40 max-w-sm">
                Try adjusting your search query or check for typos
              </p>
            </motion.div>
          ) : !debouncedQuery ? (
            <motion.div
              key="initial"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="relative w-28 h-28 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-full h-full bg-slate-900/50 border border-slate-500/20 rounded-full flex items-center justify-center backdrop-blur-sm liquid-shape-morph">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center animate-breathe">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold kinetic-text mb-2">Search Everything</h3>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed">
                Type a query above to search across articles, notes, vedic texts, movies, crypto, and weather.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {['News', 'Notes', 'Vedic', 'Movies', 'Crypto', 'Weather'].map((cat) => (
                  <span key={cat} className="px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/[0.06] text-muted-foreground/50">
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10"
            >
              {isSearchingExternal && (
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                  <Badge variant="outline" className="gap-2 px-3 py-1.5 border-blue-500/30 bg-blue-500/10 text-blue-300">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Searching external sources...
                  </Badge>
                </motion.div>
              )}

              {/* Categories */}
              {[
                { data: results.articles, title: t.nav.news, icon: Newspaper, color: 'blue', link: '/news' },
                { data: results.notes, title: t.nav.notes, icon: FileText, color: 'amber', link: '/notes' },
                { data: results.vedic, title: 'Vedic Texts', icon: BookOpen, color: 'purple', link: '/vedic-learning' },
                { data: results.quotes, title: t.quotes.title, icon: BookOpen, color: 'pink', link: '/quotes' },
                { data: movies, title: t.nav.movies, icon: Film, color: 'indigo', link: (id: string) => `/movies/${id}` },
                { data: coins, title: t.nav.crypto, icon: Bitcoin, color: 'yellow', link: (id: string) => `/crypto/${id}` },
                { data: cities, title: t.nav.weather, icon: Cloud, color: 'cyan', link: (id: string, item: any) => `/weather?lat=${item.lat}&lon=${item.lon}&name=${encodeURIComponent(item.name)}` },
              ].map((category, idx) => {
                if (!category.data.length) return null;
                const Icon = category.icon;
                
                return (
                  <motion.div key={category.title} variants={containerVariants} className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <div className={`p-1.5 rounded-md ${colorMap[category.color]?.bg || 'bg-gray-500/20'}`}>
                        <Icon className={`h-4 w-4 ${colorMap[category.color]?.text || 'text-gray-400'}`} />
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        {category.title}
                      </h2>
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        {category.data.length}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.data.map((item: any, i) => {
                        const title = item.title || item.text || item.name;
                        const desc = item.description || item.content || item.explanation || item.author || item.overview || item.country || '';
                        const badge1 = item.category || item.folder || item.source || new Date(item.releaseDate).getFullYear() || item.symbol || '';
                        const badge2 = item.source || item.lat?.toFixed(2) || '';
                        
                        const href = typeof category.link === 'function' ? category.link(item.id, item) : category.link;

                        return (
                          <motion.div key={item.id || i} variants={itemVariants}>
                            <Link href={href}>
                              <Card className={`group h-full transition-all duration-300 ${colorMap[category.color]?.hoverBorder || 'hover:border-gray-500/40'} hover:bg-white/5 bg-white/[0.02] border-white/5 hover:shadow-lg ${colorMap[category.color]?.shadow || 'hover:shadow-gray-500/5'} card-hover-magnetic`}>
                                <CardContent className="p-4 flex items-start gap-3 h-full">
                                  <div className="min-w-0 flex-1 flex flex-col h-full">
                                    <div className="text-sm font-medium text-white/90 group-hover:text-white transition-colors mb-1">
                                      {highlightText(title, debouncedQuery)}
                                    </div>
                                    {desc && (
                                      <div className="text-xs text-white/50 line-clamp-2 mb-3 flex-1 leading-relaxed">
                                        {highlightText(desc, debouncedQuery)}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                                      {badge1 && (
                                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${colorMap[category.color]?.border || 'border-gray-500/30'} ${colorMap[category.color]?.badgeText || 'text-gray-300/80'} ${colorMap[category.color]?.badgeBg || 'bg-gray-500/10'}`}>
                                          {typeof badge1 === 'string' ? highlightText(badge1, debouncedQuery) : badge1}
                                        </Badge>
                                      )}
                                      {badge2 && typeof badge2 === 'string' && (
                                        <span className="text-[10px] text-white/30 truncate">
                                          {badge2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SearchFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 py-8">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
