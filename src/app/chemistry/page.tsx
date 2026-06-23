'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  Atom,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Scale,
  Zap,
  Clock as ClockIcon,
  RefreshCw,
  Box,
} from 'lucide-react';

import { LiveClock } from '@/components/ui/live-clock';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Compound } from '@/types';

export default function ChemistryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

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
    queryKey: ['chemistry-compounds'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/chemistry?page=${pageParam}`);
      const json = await res.json();
      return json.compounds || [];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length >= 10 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 15,
  });

  const visibleCompounds = data?.pages.flat() || [];

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

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen">
      <div className="flex gap-6">
        <div className="flex-1 space-y-8">
          <div className="relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-3 sm:gap-4 min-w-0">
              <motion.div
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(16,185,129,0.2)]"
              >
                <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold uppercase tracking-[0.18em] border border-emerald-400/20 inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    </span>
                    PubChem
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-semibold inline-flex items-center gap-1.5">
                    <ClockIcon className="h-3 w-3 text-emerald-400" />
                    <LiveClock />
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient leading-tight text-balance">
                  {t.nav.chemistry}
                </h1>
                <p className="text-sm text-muted-foreground/80 mt-1.5 max-w-2xl text-pretty">
                  Molecular data explored via PubChem PUG REST API.
                </p>
              </div>
            </div>

            <div className="mt-5 h-px divider-gradient" />
          </div>

          {status === 'pending' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {visibleCompounds.map((compound: Compound) => {
                const isExpanded = expandedTopic === compound.id;

                return (
                  <motion.div key={compound.id} variants={cardVariants} layout>
                    <Card
                      className={cn(
                        'group cursor-pointer overflow-hidden transition-all duration-300 border-white/5 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/5',
                        isExpanded && 'border-blue-500/30 shadow-lg shadow-blue-500/10'
                      )}
                      onClick={() =>
                        setExpandedTopic(isExpanded ? null : compound.id)
                      }
                    >
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                              <Atom className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <CardTitle className="text-white/90 group-hover:text-white transition-colors">
                                {compound.title}
                              </CardTitle>
                              <CardDescription className="text-blue-400/60 font-mono text-xs">
                                {compound.formula}
                              </CardDescription>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key="content"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}
                          >
                            <CardContent className="pt-0 space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-1">
                                    <Scale className="w-3 h-3" />
                                    Weight
                                  </div>
                                  <div className="text-sm font-semibold text-white/80">
                                    {compound.weight} g/mol
                                  </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mb-1">
                                    <Zap className="w-3 h-3 text-amber-400" />
                                    Complexity
                                  </div>
                                  <div className="text-sm font-semibold text-white/80">
                                    {compound.complexity}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-wider">
                                  <Box className="w-3 h-3" />
                                  IUPAC Name
                                </div>
                                <p className="text-xs text-white/70 leading-relaxed font-mono italic">
                                  {compound.iupacName}
                                </p>
                              </div>

                              <div className="pt-2">
                                <a 
                                  href={compound.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/5 px-2.5 py-1.5 rounded-md border border-blue-400/20"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View on PubChem <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {status !== 'pending' && visibleCompounds.length > 0 && (
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
                   {isFetchingNextPage ? 'Analyzing more compounds...' : 'Discover more molecules'}
                </Button>
             ) : (
               <p className="text-white/20 text-sm">You have explored the deep molecular archive.</p>
             )}
           </div>
          )}
        </div>
      </div>
    </div>
  );
}
