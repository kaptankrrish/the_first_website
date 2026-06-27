import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '@/types';

interface AppStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'dark',
        language: 'en',
        fontSize: 'md',
        animationsEnabled: true,
        sidebarCollapsed: false,
        notificationsEnabled: true,
        searchHistory: [],
      },
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      searchHistory: [],
      addSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      focusMode: false,
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
    }),
    { name: 'app-store' }
  )
);
