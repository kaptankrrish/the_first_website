import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuoteStore {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
      removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((f) => f !== id) })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: 'quote-store' }
  )
);
