import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CryptoStore {
  watchlist: string[];
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
}

export const useCryptoStore = create<CryptoStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (id) => set((state) => ({ watchlist: [...state.watchlist, id] })),
      removeFromWatchlist: (id) =>
        set((state) => ({ watchlist: state.watchlist.filter((w) => w !== id) })),
      isInWatchlist: (id) => get().watchlist.includes(id),
    }),
    { name: 'crypto-store' }
  )
);
