'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
import { Search, Star, TrendingUp, TrendingDown, DollarSign, BarChart3, Clock as ClockIcon, Bitcoin } from 'lucide-react';
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
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(251,191,36,0.2)]"
            >
              <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
            </motion.div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-amber-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  </span>
                  Live
                </span>
                <Badge variant="secondary" className="gap-1.5 py-0.5 text-[10px] font-mono border-white/10">
                  <ClockIcon className="w-3 h-3 text-amber-300" />
                  <LiveClock />
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
                {t.nav.crypto}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                Live prices, 24h change, and market cap for the top crypto assets.
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-300" />
            <Input
              placeholder={t.crypto.searchCoins}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 glass-strong border-white/10 focus-visible:border-amber-400/40"
            />
          </div>
        </div>
        <div className="mt-5 h-px divider-gradient" />
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
