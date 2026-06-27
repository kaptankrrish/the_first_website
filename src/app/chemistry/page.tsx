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
  RefreshCw,
  Box,
} from 'lucide-react';

import { PageWrapper } from '@/components/layout/page-wrapper';
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeOut' as const } },
  };

  return (
    <PageWrapper
      icon={FlaskConical}
      title={t.nav.chemistry}
      subtitle="Molecular data explored via PubChem PUG REST API."
      badgeText="PubChem"
      colorScheme="emerald"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-8">
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
                  <motion.div 
                    key={compound.id} 
                    variants={cardVariants} 
                    layout
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={cn(
                        'group cursor-pointer overflow-hidden transition-all duration-300 border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/20',
                        isExpanded && 'border-emerald-500/50 shadow-lg shadow-emerald-500/20 bg-white/[0.05]'
                      )}
                      onClick={() =>
                        setExpandedTopic(isExpanded ? null : compound.id)
                      }
                    >
                      <CardHeader className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                              <Atom className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <CardTitle className="text-white/90 group-hover:text-white transition-colors">
                                {compound.title}
                              </CardTitle>
                              <CardDescription className="text-emerald-400/80 font-mono text-xs font-bold tracking-wider">
                                {compound.formula}
                              </CardDescription>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-400" />
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
                                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-2.5 py-1.5 rounded-md border border-emerald-400/20"
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
                     <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
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
    </PageWrapper>
  );
}
