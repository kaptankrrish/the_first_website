import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecentItem {
  href: string;
  label: string;
  icon: string;
  visitedAt: string;
}

interface RecentlyUsedStore {
  items: RecentItem[];
  recordVisit: (item: Omit<RecentItem, 'visitedAt'>) => void;
  clear: () => void;
}

const MAX_RECENT = 8;

export const useRecentlyUsedStore = create<RecentlyUsedStore>()(
  persist(
    (set) => ({
      items: [],
      recordVisit: (item) =>
        set((state) => {
          const filtered = state.items.filter((i) => i.href !== item.href);
          const next: RecentItem = { ...item, visitedAt: new Date().toISOString() };
          return { items: [next, ...filtered].slice(0, MAX_RECENT) };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: 'recently-used-store' }
  )
);
