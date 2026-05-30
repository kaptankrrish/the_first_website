'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, FileText, Newspaper, BookOpen, Film, Bitcoin, Cloud, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsStore, useNoteStore } from '@/store';
import { vedicContent } from '@/content/vedic';
import { searchMovies } from '@/services/movies';
import { searchCoins } from '@/services/crypto';
import { searchCities } from '@/services/weather';
import type { Quote, Movie, CryptoCoin, City } from '@/types';

import { fetchQuotes } from '@/services/quotes';
import { useLanguage } from '@/contexts/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-blue-500/30 text-white rounded px-0.5">{part}</mark> : part
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
      className="max-w-3xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Search className="h-7 w-7 text-blue-400" />
          {t.nav.search}
        </h1>
        <p className="text-white/50 mt-1">Search across articles, notes, vedic texts, and quotes</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.search}
            className="pl-10 h-14 text-lg"
            autoFocus
          />
        </div>
      </motion.div>

      {debouncedQuery && (
        <motion.div variants={itemVariants} className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {t.common.search}: <span className="text-white font-semibold">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(debouncedQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors border border-blue-500/30 text-sm font-medium w-full sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Search on Google
          </a>
        </motion.div>
      )}

      {debouncedQuery && totalResults === 0 && !isSearchingExternal && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.common.noResults}</h3>
              <p className="text-sm text-white/40 max-w-sm mx-auto">
                Try adjusting your search query or browse different categories
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {isSearchingExternal && (
        <motion.div variants={itemVariants} className="flex justify-center my-6">
          <div className="flex items-center gap-2 text-white/50">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Searching external sources...</span>
          </div>
        </motion.div>
      )}

      {!debouncedQuery && (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.common.search}</h3>
              <p className="text-sm text-white/40 max-w-sm mx-auto">
                Type a query above to search across articles, notes, vedic texts, and more
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {results.articles.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <Newspaper className="h-5 w-5 text-blue-400" />
            {t.nav.news} ({results.articles.length})
          </h2>
          <div className="space-y-2">
            {results.articles.map((a) => (
              <Link key={a.id} href={`/news`}>
                <Card className="transition-all duration-200 hover:border-blue-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Newspaper className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{highlightText(a.title, debouncedQuery)}</div>
                      <div className="text-xs text-white/50 line-clamp-1 mt-0.5">{highlightText(a.description, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{a.category}</Badge>
                        <span className="text-[10px] text-white/30">{a.source}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {results.notes.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-amber-400" />
            {t.nav.notes} ({results.notes.length})
          </h2>
          <div className="space-y-2">
            {results.notes.map((n) => (
              <Link key={n.id} href={`/notes`}>
                <Card className="transition-all duration-200 hover:border-amber-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <FileText className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{highlightText(n.title, debouncedQuery)}</div>
                      <div className="text-xs text-white/50 line-clamp-1 mt-0.5">{highlightText(n.content, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{n.folder}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {results.vedic.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-purple-400" />
            Vedic Texts ({results.vedic.length})
          </h2>
          <div className="space-y-2">
            {results.vedic.map((v) => (
              <Link key={v.id} href={`/vedic-learning`}>
                <Card className="transition-all duration-200 hover:border-purple-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{highlightText(v.title, debouncedQuery)}</div>
                      <div className="text-xs text-white/50 line-clamp-1 mt-0.5">{highlightText(v.explanation, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{v.source}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {results.quotes.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-pink-400" />
            {t.quotes.title} ({results.quotes.length})
          </h2>
          <div className="space-y-2">
            {results.quotes.map((qt) => (
              <Link key={qt.id} href="/quotes">
                <Card className="transition-all duration-200 hover:border-pink-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{highlightText(qt.text, debouncedQuery)}</div>
                      <div className="text-xs text-white/50 mt-0.5">&mdash; {highlightText(qt.author, debouncedQuery)}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {movies.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <Film className="h-5 w-5 text-indigo-400" />
            {t.nav.movies} ({movies.length})
          </h2>
          <div className="space-y-2">
            {movies.map((m) => (
              <Link key={m.id} href={`/movies/${m.id}`}>
                <Card className="transition-all duration-200 hover:border-indigo-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Film className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{highlightText(m.title, debouncedQuery)}</div>
                      <div className="text-xs text-white/50 line-clamp-1 mt-0.5">{highlightText(m.overview, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{new Date(m.releaseDate).getFullYear() || 'Unknown'}</Badge>
                        <span className="text-[10px] text-white/30">{t.movies.rating}: {m.voteAverage.toFixed(1)}/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {coins.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <Bitcoin className="h-5 w-5 text-yellow-500" />
            {t.nav.crypto} ({coins.length})
          </h2>
          <div className="space-y-2">
            {coins.map((c) => (
              <Link key={c.id} href={`/crypto/${c.id}`}>
                <Card className="transition-all duration-200 hover:border-yellow-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Bitcoin className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{highlightText(c.name, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{highlightText(c.symbol, debouncedQuery)}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {cities.length > 0 && (
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
            <Cloud className="h-5 w-5 text-cyan-400" />
            {t.nav.weather} ({cities.length})
          </h2>
          <div className="space-y-2">
            {cities.map((city, idx) => (
              <Link key={idx} href={`/weather?lat=${city.lat}&lon=${city.lon}&name=${encodeURIComponent(city.name)}`}>
                <Card className="transition-all duration-200 hover:border-cyan-500/30 hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Cloud className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{highlightText(city.name, debouncedQuery)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{highlightText(city.country, debouncedQuery)}</Badge>
                        <span className="text-[10px] text-white/30">{city.lat.toFixed(2)}, {city.lon.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SearchFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
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
