'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils';
import type { BlogPost } from '@/types';
import { Search, Clock, User, Calendar, BookOpen } from 'lucide-react';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageWrapper } from '@/components/layout/page-wrapper';

const LOCALIZED_TEXTS = {
  en: {
    title: 'Developer Blog',
    subtitle: 'Insights on programming, AI, technology, and the future',
    searchPlaceholder: 'Search posts...',
    featured: 'Featured',
    loading: 'Loading posts...',
    noPosts: 'No posts match your search',
    readTime: 'min read',
    categories: {
      All: 'All',
      AI: 'AI',
      Programming: 'Programming',
      React: 'React',
      JavaScript: 'JavaScript',
      Python: 'Python',
      Webdev: 'Webdev',
    }
  },
  hi: {
    title: 'डेवलपर ब्लॉग',
    subtitle: 'प्रोग्रामिंग, एआई, प्रौद्योगिकी और भविष्य पर अंतर्दृष्टि',
    searchPlaceholder: 'पोस्ट खोजें...',
    featured: 'विशेष रुप से प्रदर्शित',
    loading: 'पोस्ट लोड हो रहे हैं...',
    noPosts: 'आपकी खोज से मेल खाने वाले कोई पोस्ट नहीं हैं',
    readTime: 'मिनट का पठन',
    categories: {
      All: 'सभी',
      AI: 'एआई (AI)',
      Programming: 'प्रोग्रामिंग',
      React: 'रिएक्ट (React)',
      JavaScript: 'जावास्क्रिप्ट',
      Python: 'पायथन',
      Webdev: 'वेब विकास',
    }
  },
  es: {
    title: 'Blog de Desarrolladores',
    subtitle: 'Perspectivas sobre programación, IA, tecnología y el futuro',
    searchPlaceholder: 'Buscar publicaciones...',
    featured: 'Destacado',
    loading: 'Cargando publicaciones...',
    noPosts: 'Ninguna publicación coincide con tu búsqueda',
    readTime: 'min de lectura',
    categories: {
      All: 'Todo',
      AI: 'IA',
      Programming: 'Programación',
      React: 'React',
      JavaScript: 'JavaScript',
      Python: 'Python',
      Webdev: 'Desarrollo Web',
    }
  }
};

const categoriesKeys = [
  'All',
  'AI',
  'Programming',
  'React',
  'JavaScript',
  'Python',
  'Webdev',
] as const;

export default function BlogsPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof categoriesKeys[number]>('All');

  const localTexts = LOCALIZED_TEXTS[lang] || LOCALIZED_TEXTS.en;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['blogs', activeCategory],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/blogs?page=${pageParam}&tag=${activeCategory}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json.posts as BlogPost[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 12 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const allPosts = useMemo(() => {
    const posts = data?.pages.flat() || [];
    // Deduplicate posts to prevent duplicate key errors
    const uniquePosts = posts.filter((post, index, self) =>
      index === self.findIndex((p) => p.id === post.id)
    );
    
    if (search.trim()) {
      const q = search.toLowerCase();
      return uniquePosts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return uniquePosts;
  }, [data, search]);

  const [featured, ...rest] = allPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 12 },
    },
  };

  return (
    <div className="space-y-8">
      <PageWrapper
        icon={BookOpen}
        title={localTexts.title}
        subtitle={`${localTexts.subtitle} (${allPosts.length} posts)`}
        badgeText="Dev Stories"
        colorScheme="indigo"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder={localTexts.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-hide">
          {categoriesKeys.map((cat) => (
            <motion.div
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'whitespace-nowrap rounded-full',
                  activeCategory === cat ? 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white' : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70'
                )}
              >
                {localTexts.categories[cat] || cat}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {status === 'pending' ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-indigo-500 animate-spin mb-4" />
          <p className="text-sm">{localTexts.loading}</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <Search className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-xl">{localTexts.noPosts}</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {featured && (
            <motion.div variants={itemVariants}>
              <a href={featured.url} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                <Card className="group relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 backdrop-blur-xl transition-all duration-500 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_60%)]" />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                  <div className="relative flex flex-col md:flex-row gap-6 p-6 sm:p-8">
                    {featured.imageUrl && (
                      <div className="relative w-full md:w-2/5 lg:w-1/2 h-64 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={featured.imageUrl} alt={featured.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-indigo-500 text-white border-none shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                          {localTexts.featured}
                        </Badge>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-white/60 leading-relaxed max-w-3xl line-clamp-3 text-sm md:text-base">
                        {featured.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {featured.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featured.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5 text-indigo-300/80">
                          <Clock className="h-4 w-4" />
                          {featured.readingTime} {localTexts.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            </motion.div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="block h-full focus:outline-none">
                  <Card className="group h-full flex flex-col overflow-hidden border-white/5 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:-translate-y-1">
                    {post.imageUrl && (
                      <div className="relative h-48 overflow-hidden bg-white/5">
                        <Image src={post.imageUrl} alt={post.title} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <CardContent className="flex-1 p-6 flex flex-col space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags && post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-wider text-indigo-300/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-2 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <span className="text-xs text-white/40 flex items-center gap-1.5 truncate max-w-[120px]">
                          <User className="h-3 w-3" />
                          <span className="truncate">{post.author}</span>
                        </span>
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}m
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
          
          <InfiniteScroll
            hasMore={!!hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </motion.div>
      )}
    </div>
  );
}
