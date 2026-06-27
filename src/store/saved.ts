import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedItem } from '@/types';

interface SavedStore {
  savedItems: SavedItem[];
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedItems: [],
      addSavedItem: (item) =>
        set((state) => ({
          savedItems: [item, ...state.savedItems.filter((i) => i.id !== item.id)],
        })),
      removeSavedItem: (id) =>
        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.id !== id),
        })),
      isSaved: (id) => get().savedItems.some((i) => i.id === id),
    }),
    { name: 'saved-store' }
  )
);
