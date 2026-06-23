'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Sigma,
  Infinity,
  Sparkles,
  Hash,
  Quote,
  Clock as ClockIcon,
  RefreshCw,
} from 'lucide-react';

import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MathFact } from '@/services/maths';

export default function MathsPage() {
  const router = useRouter();
  const { t } = useLanguage();

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
    queryKey: ['math-facts'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/maths?page=${pageParam}`);
      const json = await res.json();
      return json.facts || [];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 10 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 15,
  });

  const visibleFacts = data?.pages.flat() || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-8">
        <div className="relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(249,115,22,0.2)]"
            >
              <Sigma className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-orange-400/20 inline-flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                  </span>
                  Number Theory
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold inline-flex items-center gap-1.5">
                  <ClockIcon className="h-3 w-3 text-orange-400" />
                  <LiveClock />
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-warm leading-tight text-balance">
                {t.nav.maths}
              </h1>
              <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                Mathematical properties and number theory explored via Numbers API.
              </p>
            </div>
          </div>

          <div className="mt-5 h-px divider-gradient" />
        </div>

        {status === 'pending' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleFacts.map((fact: MathFact) => (
              <motion.div key={fact.id} variants={cardVariants}>
                <Card className="group relative h-full overflow-hidden border-white/5 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-indigo-500/5">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Infinity className="w-16 h-16 text-indigo-400" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-300">
                        Number {fact.number}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-6 h-6 text-white/5" />
                      <p className="text-white/80 leading-relaxed pl-4 italic">
                        {fact.text}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        Mathematical Property
                      </span>
                      <Sparkles className="w-3 h-3 text-amber-400/40" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {status !== 'pending' && visibleFacts.length > 0 && (
           <div className="py-12 flex flex-col items-center gap-4">
           {hasNextPage ? (
              <Button
                 variant="ghost"
                 onClick={() => fetchNextPage()}
                 disabled={isFetchingNextPage}
                 className="text-white/60 hover:text-white hover:bg-white/5 gap-2"
              >
                 {isFetchingNextPage ? (
                   <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                 ) : (
                   <RefreshCw className="h-4 w-4" />
                 )}
                 {isFetchingNextPage ? 'Calculating more properties...' : 'Discover more numbers'}
              </Button>
           ) : (
             <p className="text-white/20 text-sm">You have reached the limit of this numerical sequence.</p>
           )}
         </div>
        )}
      </div>
    </div>
  );
}
