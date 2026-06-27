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
  RefreshCw,
} from 'lucide-react';

import { PageWrapper } from '@/components/layout/page-wrapper';
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
    <PageWrapper
      icon={Sigma}
      title={t.nav.maths}
      subtitle="Mathematical properties and number theory explored via Numbers API."
      badgeText="Number Theory"
      colorScheme="amber"
    >
      <div className="space-y-8">
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
              <motion.div key={fact.id} variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-amber-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/0 transition-all duration-500" />
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:rotate-12 transition-all duration-500">
                    <Infinity className="w-16 h-16 text-amber-400" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                        <Hash className="w-4 h-4" />
                      </div>
                      <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-300 bg-amber-500/5">
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
                      <div className="relative">
                        <Sparkles className="w-3 h-3 text-amber-400/40 group-hover:text-amber-400 transition-colors" />
                        <div className="absolute inset-0 group-hover:animate-ping opacity-0 group-hover:opacity-100 bg-amber-400/20 rounded-full" />
                      </div>
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
                   <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
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
    </PageWrapper>
  );
}
