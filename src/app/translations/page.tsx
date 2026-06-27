'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, BookMarked, Volume2, Share2, ChevronDown, ChevronUp, Languages, ArrowRightLeft, Type } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';
import { vedicContent } from '@/content/vedic';
import { useVedicStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 15 } },
};

function getSourceColor(source: string): string {
  if (source.includes('Gita')) return 'border-amber-500/30 bg-amber-500/20 text-amber-300';
  if (source.includes('Upanishad')) return 'border-indigo-500/30 bg-indigo-500/20 text-indigo-300';
  if (source === 'Rigveda') return 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300';
  return 'border-rose-500/30 bg-rose-500/20 text-rose-300';
}

function TranslationWidget() {
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Sanskrit');
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setSourceText(targetText);
      setTargetText(sourceText);
      setIsSwapping(false);
    }, 300);
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl mb-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <CardContent className="p-1 sm:p-2">
        <div className="flex flex-col md:flex-row gap-2 relative">
          
          {/* Source Panel */}
          <motion.div 
            layout
            className="flex-1 rounded-xl bg-black/20 border border-white/5 overflow-hidden flex flex-col min-h-[200px]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
              <span className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <Type className="w-4 h-4" />
                {sourceLang}
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-white/40 hover:text-white">
                Detect Language
              </Button>
            </div>
            <Textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                // Mock translation
                if (e.target.value) {
                  setTargetText(`[Translated to ${targetLang}]: ${e.target.value}`);
                } else {
                  setTargetText('');
                }
              }}
              placeholder="Enter text to translate..."
              className="flex-1 resize-none bg-transparent border-none text-white placeholder:text-white/20 focus-visible:ring-0 p-4 text-lg"
            />
          </motion.div>

          {/* Swap Button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: isSwapping ? 180 : 0, scale: isSwapping ? 0.8 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Button
                variant="default"
                size="icon"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 shadow-xl shadow-black/50 text-cyan-400 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Target Panel */}
          <motion.div 
            layout
            className="flex-1 rounded-xl bg-blue-900/10 border border-blue-500/10 overflow-hidden flex flex-col min-h-[200px]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/10 bg-blue-500/5">
              <span className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {targetLang}
              </span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-white/40 hover:text-white">
                Copy
              </Button>
            </div>
            <div className="flex-1 p-4">
              {targetText ? (
                <p className="text-lg text-blue-100/90 leading-relaxed">
                  {targetText}
                </p>
              ) : (
                <p className="text-lg text-blue-200/20 leading-relaxed italic">
                  Translation will appear here...
                </p>
              )}
            </div>
          </motion.div>

        </div>
      </CardContent>
    </Card>
  );
}

export default function TranslationsPage() {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addBookmark, removeBookmark, isBookmarked } = useVedicStore();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vedicContent;
    return vedicContent.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.sanskrit.includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.hindi.includes(q) ||
        item.transliteration.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageWrapper
        icon={Languages}
        title={t.nav.translations}
        subtitle="Side-by-side Sanskrit, Hindi, and English for all Vedic texts"
        badgeText="Multilingual"
        colorScheme="cyan"
      />

      <TranslationWidget />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center justify-between"
      >
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search across Vedic texts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const expanded = expandedId === item.id;
            const bookmarked = isBookmarked(item.id);

            return (
              <motion.div
                key={item.id}
                layout
                variants={itemAnim}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Card
                  className={cn(
                    'group cursor-pointer transition-all duration-300 hover:border-white/20 bg-white/[0.02] backdrop-blur-md',
                    expanded ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/5'
                  )}
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium text-white/90 group-hover:text-white transition-colors">{item.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={cn('mt-2 text-[10px] px-2 py-0', getSourceColor(item.source))}
                        >
                          {item.source}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 hover:bg-white/10 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (bookmarked) {
                            removeBookmark(item.id);
                          } else {
                            addBookmark(item.id);
                          }
                        }}
                      >
                        {bookmarked ? (
                          <BookMarked className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-white/40 group-hover:text-white/60" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-amber-400/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" /> Sanskrit
                        </span>
                        <p className="font-serif text-lg leading-relaxed text-amber-100">
                          {item.sanskrit}
                        </p>
                      </div>
                      <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> Hindi
                        </span>
                        <p className="text-sm leading-relaxed text-emerald-50">
                          {item.hindi}
                        </p>
                      </div>
                      <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-blue-400/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" /> English
                        </span>
                        <p className="text-sm leading-relaxed text-blue-50">
                          {item.english}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-6 pb-4 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-white/40 hover:text-white hover:bg-white/10 rounded-full px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expanded ? null : item.id);
                      }}
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="mr-1 h-3 w-3" /> Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 h-3 w-3" /> View Explanations
                        </>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                        className="overflow-hidden"
                      >
                        <CardContent className="border-t border-white/5 pt-5 space-y-5 bg-black/20">
                          <div className="space-y-2">
                            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                              Transliteration
                            </span>
                            <p className="italic text-white/80">{item.transliteration}</p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-white/5 p-4 space-y-2 border border-white/5">
                              <span className="text-xs font-medium uppercase tracking-wider text-cyan-400/80">
                                Explanation
                              </span>
                              <p className="text-sm text-white/70 leading-relaxed">{item.explanation}</p>
                            </div>

                            <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 space-y-2 border border-cyan-500/10">
                              <span className="text-xs font-medium uppercase tracking-wider text-blue-400/80">
                                Philosophy
                              </span>
                              <p className="text-sm text-white/70 leading-relaxed">{item.philosophy}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Volume2 className="mr-2 h-4 w-4" />
                              Listen to Audio
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  `${item.title}\n\nSanskrit: ${item.sanskrit}\nHindi: ${item.hindi}\nEnglish: ${item.english}`
                                );
                              }}
                            >
                              <Share2 className="h-4 w-4 text-white/60" />
                            </Button>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Search className="h-12 w-12 text-white/10 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No texts found</h3>
          <p className="text-white/40 text-sm">
            {t.common.noResults} for &quot;{searchQuery}&quot;
          </p>
        </motion.div>
      )}
    </div>
  );
}
