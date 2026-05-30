'use client';
import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNewsStore } from '@/store';
import { fetchAllNews } from '@/services/news';
import { useLanguage } from '@/contexts/LanguageContext';

export function useNews() {
  const { lang } = useLanguage();
  const { articles, setArticles, activeCategory, setActiveCategory, searchQuery, setSearchQuery, loading, setLoading } = useNewsStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['news', lang],
    queryFn: () => fetchAllNews(lang),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setArticles(data);
      setLoading(false);
    }
  }, [data, setArticles, setLoading]);

  const filteredArticles = articles.filter((a) => {
    if (activeCategory !== 'All' && a.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  const loadMore = useCallback(async () => {
    setLoading(true);
    await refetch();
  }, [refetch, setLoading]);

  return {
    articles: filteredArticles,
    allArticles: articles,
    loading: loading || isLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    loadMore,
    refetch,
  };
}
