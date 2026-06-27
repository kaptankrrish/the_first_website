import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article } from '@/types';

interface NewsStore {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  addArticles: (articles: Article[]) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      articles: [],
      setArticles: (articles) => set({ articles }),
      addArticles: (newArticles) =>
        set((state) => {
          const existingIds = new Set(state.articles.map((a) => a.id));
          const unique = newArticles.filter((a) => !existingIds.has(a.id));
          return { articles: [...state.articles, ...unique] };
        }),
      activeCategory: 'All',
      setActiveCategory: (category) => set({ activeCategory: category }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    { name: 'news-store' }
  )
);
