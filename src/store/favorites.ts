import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecentItem } from './recently-used';

interface FavoritesStore {
  favorites: RecentItem[];
  toggle: (item: Omit<RecentItem, 'visitedAt'>) => boolean;
  remove: (href: string) => void;
  isFavorite: (href: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (item) => {
        const exists = get().favorites.some((f) => f.href === item.href);
        if (exists) {
          set((state) => ({ favorites: state.favorites.filter((f) => f.href !== item.href) }));
          return false;
        }
        set((state) => ({
          favorites: [{ ...item, visitedAt: new Date().toISOString() }, ...state.favorites].slice(0, 20),
        }));
        return true;
      },
      remove: (href) =>
        set((state) => ({ favorites: state.favorites.filter((f) => f.href !== href) })),
      isFavorite: (href) => get().favorites.some((f) => f.href === href),
    }),
    { name: 'favorites-store' }
  )
);
