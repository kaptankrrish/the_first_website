'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { Search, Star, Film, Calendar, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { fetchTrendingMovies, searchMovies } from '@/services/movies';
import { useMovieStore } from '@/store';
import type { Movie } from '@/types';
import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

function getYear(dateStr: string): string {
  return dateStr ? dateStr.split('-')[0] : '';
}

function getRatingColor(rating: number): string {
  if (rating >= 8) return 'bg-emerald-600 border-emerald-400';
  if (rating >= 6) return 'bg-amber-600 border-amber-400';
  return 'bg-red-600 border-red-400';
}

function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
}

function MovieSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function MoviesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovieStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['trending-movies'],
    queryFn: ({ pageParam = 1 }) => fetchTrendingMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined; // TMDB default page size is 20
    },
    staleTime: 10 * 60 * 1000,
  });

  const trendingMovies = useMemo(() => data?.pages.flat() || [], [data?.pages]);

  const { data: searchedMovies } = useQuery({
    queryKey: ['search-movies', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length >= 3,
    staleTime: 30000,
  });

  const displayMovies = useMemo(() => {
    let movies: Movie[];
    if (searchQuery.length >= 3 && searchedMovies && searchedMovies.length > 0) {
      movies = searchedMovies;
    } else {
      movies = trendingMovies || [];
    }

    // Deduplicate movies by ID to guarantee unique React keys during infinite scroll
    const seen = new Set<number>();
    movies = movies.filter((m) => {
      if (!m || !m.id || seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    if (selectedGenres.length > 0) {
      movies = movies.filter((m) =>
        m.genreIds.some((g) => selectedGenres.includes(g))
      );
    }

    return movies;
  }, [trendingMovies, searchedMovies, searchQuery, selectedGenres]);

  const allGenres = useMemo(() => {
    const ids = new Set<number>();
    (trendingMovies || []).forEach((m) => m.genreIds.forEach((g) => ids.add(g)));
    (searchedMovies || []).forEach((m) => m.genreIds.forEach((g) => ids.add(g)));
    return Array.from(ids)
      .map((id) => ({ id, name: genreMap[id] || 'Unknown' }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [trendingMovies, searchedMovies]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  };

  const toggleWatchlist = (movieId: number) => {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  useEffect(() => {
    // 5 minute auto-refresh
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {t.movies.title}
          <Badge variant="secondary" className="gap-1.5 py-1 text-sm font-normal">
            <Clock className="w-4 h-4 text-white/50" />
            <LiveClock />
          </Badge>
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder={t.movies.searchMovies}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {allGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => toggleGenre(genre.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                selectedGenres.includes(genre.id)
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              )}
            >
              {genre.name}
            </button>
          ))}
          {selectedGenres.length > 0 && (
            <button
              onClick={() => setSelectedGenres([])}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              {t.common.clear}
            </button>
          )}
        </div>
      )}

      {status === 'pending' && <MovieSkeleton />}

      <AnimatePresence mode="wait">
        {status !== 'pending' && displayMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Film className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">{t.movies.noMovies}</p>
          </motion.div>
        )}

        {status !== 'pending' && displayMovies.length > 0 && (
          <motion.div
            key="movie-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {displayMovies.map((movie) => {
              const inWatchlist = isInWatchlist(movie.id);
              const year = getYear(movie.releaseDate);

              return (
                <motion.div
                  key={movie.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="group overflow-hidden border-0 bg-transparent shadow-none">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                        {movie.posterPath && isSafeUrl(movie.posterPath) ? (
                          <Image
                            src={movie.posterPath}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Film className="h-12 w-12 text-white/20" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => toggleWatchlist(movie.id)}
                            className={cn(
                              'p-1.5 rounded-lg backdrop-blur-md transition-colors shadow-lg',
                              inWatchlist
                                ? 'bg-amber-500/80 text-white'
                                : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/70'
                            )}
                          >
                            {inWatchlist ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="absolute top-2 left-2">
                          <Badge
                            className={cn(
                              'border text-white text-[10px] px-1.5 py-0.5 shadow-lg',
                              getRatingColor(movie.voteAverage)
                            )}
                          >
                            <Star className="h-2.5 w-2.5 fill-white mr-0.5" />
                            {movie.voteAverage.toFixed(1)}
                          </Badge>
                        </div>

                        {year && (
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="outline" className="text-[10px] bg-black/40 backdrop-blur-sm border-white/10">
                              <Calendar className="h-2.5 w-2.5 mr-0.5" />
                              {year}
                            </Badge>
                          </div>
                        )}

                        {inWatchlist && (
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/80 text-white border-0">
                              <BookmarkCheck className="h-2.5 w-2.5 mr-0.5" />
                              {t.movies.saved}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 px-0.5">
                        <h3 className="text-sm font-medium leading-tight line-clamp-1 group-hover:text-white transition-colors">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {movie.genreIds.slice(0, 2).map((id) => (
                            <span key={id} className="text-[10px] text-white/40">
                              {genreMap[id]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {status !== 'pending' && displayMovies.length > 0 && (
        <InfiniteScroll
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}

      {status !== 'pending' && watchlist.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <BookmarkCheck className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-medium text-white/70">{t.movies.watchlist} ({watchlist.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchlist.map((movieId) => {
              const movie = (trendingMovies || []).find((m) => m.id === movieId)
                || (searchedMovies || []).find((m) => m.id === movieId);
              if (!movie) return null;
              return (
                <Badge key={movieId} variant="secondary" className="flex items-center gap-1.5 py-1.5">
                  {movie.title}
                  <span className="text-white/40">·</span>
                  <span className="text-amber-400">{movie.voteAverage.toFixed(1)}</span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
