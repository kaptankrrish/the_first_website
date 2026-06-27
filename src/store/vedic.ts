import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VedicStore {
  bookmarks: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  progress: Record<string, boolean>;
  markComplete: (id: string) => void;
}

export const useVedicStore = create<VedicStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (id) => set((state) => ({ bookmarks: [...state.bookmarks, id] })),
      removeBookmark: (id) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b !== id) })),
      isBookmarked: (id) => get().bookmarks.includes(id),
      progress: {},
      markComplete: (id) =>
        set((state) => ({ progress: { ...state.progress, [id]: true } })),
    }),
    { name: 'vedic-store' }
  )
);
