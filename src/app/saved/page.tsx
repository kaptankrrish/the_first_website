'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Heart, Library } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSavedStore } from '@/store';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
};

const typeBadgeVariants: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  news: 'default',
  quote: 'warning',
  movie: 'secondary',
  article: 'success',
  blog: 'secondary',
  vedic: 'secondary',
};

const typeIcons: Record<string, string> = {
  news: '📰',
  quote: '💬',
  movie: '🎬',
  article: '📄',
  blog: '📝',
  vedic: '🕉',
};

const types = ['all', 'news', 'quote', 'movie', 'article', 'blog', 'vedic'] as const;

export default function SavedPage() {
  const { t } = useLanguage();
  const savedItems = useSavedStore((s) => s.savedItems);
  const removeSavedItem = useSavedStore((s) => s.removeSavedItem);
  const [activeType, setActiveType] = useState('all');

  const filtered = useMemo(() => {
    if (activeType === 'all') return savedItems;
    return savedItems.filter((item) => item.type === activeType);
  }, [savedItems, activeType]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6"
    >
      <PageWrapper
        icon={Library}
        title={t.nav.saved}
        subtitle={t.saved.subtitle}
        badgeText="My Library"
        colorScheme="fuchsia"
      />

      <motion.div variants={itemVariants} className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
          {types.map((type) => {
            const isActive = activeType === type;
            const count = savedItems.filter((i) => i.type === type).length;
            
            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none",
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg shadow-lg shadow-fuchsia-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5 capitalize">
                  {type === 'all' ? t.todo.all : type}
                  {type !== 'all' && (
                    <span className={cn(
                      "text-[10px]",
                      isActive ? "text-white/80" : "opacity-50"
                    )}>
                      ({count})
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {savedItems.length === 0 ? (
          <motion.div
            key="empty-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-24 h-24 mb-6"
            >
              <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-2xl" />
              <Heart className="w-full h-full text-white/20" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">{t.saved.nothingSaved}</h3>
            <p className="text-sm text-white/50 max-w-sm mb-8 leading-relaxed">
              {t.saved.startSaving}
            </p>
            <Link href="/news">
              <Button className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white border-none shadow-lg shadow-fuchsia-500/20 rounded-full px-8">
                <Bookmark className="h-4 w-4 mr-2" />
                {t.common.browseContent}
              </Button>
            </Link>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty-filter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <Bookmark className="h-16 w-16 mb-4 text-white/10" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.saved.noType} <span className="capitalize text-fuchsia-400">{activeType}</span> {t.saved.items}</h3>
            <p className="text-sm text-white/40">Try selecting a different category</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="break-inside-avoid"
                >
                  <Card className="group h-full transition-all duration-300 hover:border-fuchsia-500/30 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] bg-white/5 backdrop-blur-md overflow-hidden">
                    {item.imageUrl && (
                      <div className="relative h-48 overflow-hidden rounded-t-xl bg-white/5">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      </div>
                    )}
                    <CardHeader className={cn("relative z-10", item.imageUrl ? '-mt-12 pt-4 pb-2' : '')}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant={typeBadgeVariants[item.type] || 'secondary'} className={cn(
                          "text-[10px] px-2 py-0.5 backdrop-blur-md shadow-sm border-white/10",
                          item.imageUrl ? "bg-black/50 text-white" : ""
                        )}>
                          {typeIcons[item.type] || '📌'} {item.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-all text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-full"
                          onClick={() => removeSavedItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className={cn(
                        "text-base leading-snug line-clamp-3",
                        item.imageUrl ? "text-white" : "text-white/90"
                      )}>
                        {item.title}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className={cn(
                          "text-sm line-clamp-3 mt-2",
                          item.imageUrl ? "text-white/70" : "text-white/60"
                        )}>
                          {item.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="text-xs text-white/40 flex items-center gap-1.5">
                          <Bookmark className="w-3 h-3" />
                          {new Date(item.savedAt).toLocaleDateString()}
                        </span>
                        {item.url && !item.url.startsWith('/') && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10 rounded-full px-3">
                              {t.common.open}
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
