'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { Search, Star, TrendingUp, TrendingDown, DollarSign, BarChart3, Clock as ClockIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { fetchTrendingCoins, searchCoins } from '@/services/crypto';
import { useCryptoStore } from '@/store';
import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';

function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  if (price >= 0.01) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumSignificantDigits: 3 });
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumSignificantDigits: 2 });
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return formatPrice(cap);
}

function CoinSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}

export default function CryptoPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useCryptoStore();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['trending-coins'],
    queryFn: ({ pageParam = 1 }) => fetchTrendingCoins(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 100 ? allPages.length + 1 : undefined;
    },
    refetchInterval: 120000,
    staleTime: 60000,
    retry: 2,
    retryDelay: 5000,
  });

  const trendingCoins = useMemo(() => data?.pages.flat() || [], [data]);

  const { data: searchedCoins } = useQuery({
    queryKey: ['search-coins', searchQuery],
    queryFn: () => searchCoins(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 30000,
  });

  const displayCoins = useMemo(() => {
    if (searchQuery.length >= 2 && searchedCoins && searchedCoins.length > 0) {
      return (trendingCoins || []).filter((coin) =>
        searchedCoins.some((s) => s.id === coin.id)
      );
    }
    return trendingCoins || [];
  }, [trendingCoins, searchedCoins, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const toggleWatchlist = (coinId: string) => {
    if (isInWatchlist(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
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
          {t.nav.crypto}
          <Badge variant="secondary" className="gap-1.5 py-1 text-sm font-normal">
            <ClockIcon className="w-4 h-4 text-emerald-400" />
            <LiveClock />
          </Badge>
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder={t.crypto.searchCoins}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {status === 'pending' && <CoinSkeleton />}

      <AnimatePresence mode="wait">
        {status !== 'pending' && displayCoins.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BarChart3 className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">{t.crypto.noCoins}</p>
          </motion.div>
        )}

        {status !== 'pending' && displayCoins.length > 0 && (
          <motion.div
            key="coin-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {displayCoins.map((coin) => {
              const isPositive = coin.priceChangePercentage24h >= 0;
              const inWatchlist = isInWatchlist(coin.id);

              const sparkData = coin.sparklineIn7d.map((price, i) => ({
                index: i,
                price,
              }));

              return (
                <motion.div
                  key={coin.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className="relative overflow-hidden group hover:bg-white/[0.08] transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/5 flex items-center justify-center">
                            {coin.image ? (
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <DollarSign className="h-5 w-5 text-white/20" />
                            )}
                            <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                              {coin.marketCapRank}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm leading-tight">{coin.name}</p>
                            <p className="text-xs text-white/40">{coin.symbol}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleWatchlist(coin.id)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors',
                            inWatchlist
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-white/30 hover:text-white/60'
                          )}
                        >
                          <Star className={cn('h-4 w-4', inWatchlist && 'fill-amber-400')} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold">{formatPrice(coin.currentPrice)}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {isPositive ? (
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                            )}
                            <span
                              className={cn(
                                'text-sm font-medium',
                                isPositive ? 'text-emerald-400' : 'text-red-400'
                              )}
                            >
                              {isPositive ? '+' : ''}{(coin.priceChangePercentage24h ?? 0).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/40">{t.crypto.marketCap}</p>
                          <p className="text-sm font-medium">{formatMarketCap(coin.marketCap)}</p>
                        </div>
                      </div>

                      {sparkData.length > 1 && (
                        <div className="h-12 w-full">
                          <ResponsiveContainer width="100%" height={48}>
                            <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id={`gradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={isPositive ? '#34d399' : '#f87171'} stopOpacity={0.3} />
                                  <stop offset="100%" stopColor={isPositive ? '#34d399' : '#f87171'} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                contentStyle={{ display: 'none' }}
                              />
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke={isPositive ? '#34d399' : '#f87171'}
                                strokeWidth={1.5}
                                fill={`url(#gradient-${coin.id})`}
                                dot={false}
                                activeDot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {status !== 'pending' && displayCoins.length > 0 && (
        <InfiniteScroll
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      )}

      {status !== 'pending' && watchlist.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-medium text-white/70">{t.crypto.watchlist} ({watchlist.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchlist.map((id) => {
              const coin = trendingCoins?.find((c) => c.id === id);
              if (!coin) return null;
              const isPositive = coin.priceChangePercentage24h >= 0;
              return (
                <Badge key={id} variant="secondary" className="flex items-center gap-1.5 py-1.5">
                  {coin.image ? (
                    <Image src={coin.image} alt="" width={16} height={16} className="rounded-full" />
                  ) : (
                    <DollarSign className="h-3 w-3 text-white/40" />
                  )}
                  <span>{coin.symbol}</span>
                  <span className={cn(isPositive ? 'text-emerald-400' : 'text-red-400')}>
                    {isPositive ? '+' : ''}{coin.priceChangePercentage24h.toFixed(1)}%
                  </span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
