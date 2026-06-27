import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MovieStore {
  watchlist: number[];
  addToWatchlist: (id: number) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (id) => set((state) => ({ watchlist: [...state.watchlist, id] })),
      removeFromWatchlist: (id) =>
        set((state) => ({ watchlist: state.watchlist.filter((w) => w !== id) })),
      isInWatchlist: (id) => get().watchlist.includes(id),
    }),
    { name: 'movie-store' }
  )
);
