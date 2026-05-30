'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                  <FlaskConical className="w-6 h-6 text-blue-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient flex items-center gap-2">
                  {t.nav.chemistry}
                  <Badge variant="secondary" className="ml-2 gap-1.5 py-1 text-sm font-normal">
                    <ClockIcon className="w-4 h-4 text-blue-400" />
                    <LiveClock />
                  </Badge>
                </h1>
              </div>
              <p className="text-white/50 text-sm sm:text-base ml-1">
                Molecular data explored via PubChem PUG REST API.
              </p>
            </div>
          </motion.div>

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
