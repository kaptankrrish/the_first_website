'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSavedStore } from '@/store';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/contexts/LanguageContext';

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
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bookmark className="h-7 w-7 text-emerald-400" />
          {t.nav.saved}
        </h1>
        <p className="text-white/50 mt-1">{t.saved.subtitle}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList className="flex-wrap h-auto p-1">
            {types.map((type) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type === 'all' ? t.todo.all : type}
                {type !== 'all' && (
                  <span className="ml-1.5 text-[10px] opacity-50">
                    ({savedItems.filter((i) => i.type === type).length})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {savedItems.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-white/10" />
              <h3 className="text-xl font-semibold text-white mb-2">{t.saved.nothingSaved}</h3>
              <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
                {t.saved.startSaving}
              </p>
              <Link href="/news">
                <Button variant="default">
                  <Bookmark className="h-4 w-4 mr-2" />
                  {t.common.browseContent}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12">
            <CardContent>
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.saved.noType} {activeType} {t.saved.items}</h3>
              <p className="text-sm text-white/40">Try selecting a different category</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <motion.div key={item.id} variants={itemVariants} layout>
              <Card className="group h-full transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                {item.imageUrl && (
                  <div className="relative h-36 overflow-hidden rounded-t-xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 290px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <CardHeader className={cn(item.imageUrl ? 'pb-2' : '')}>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={typeBadgeVariants[item.type] || 'secondary'} className="text-[10px] px-1.5 py-0">
                      {typeIcons[item.type] || '📌'} {item.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeSavedItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardTitle className="text-sm text-white line-clamp-2 mt-1">{item.title}</CardTitle>
                  {item.description && (
                    <CardDescription className="text-xs line-clamp-2">{item.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/30">
                      {t.common.saved} {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                    {item.url && !item.url.startsWith('/') && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px]">
                          {t.common.open}
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
