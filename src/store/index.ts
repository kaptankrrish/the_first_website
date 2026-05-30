import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article, Todo, Habit, Note, SavedItem, AppSettings } from '@/types';

interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));

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

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],
      addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      removeTodo: (id) => set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),
      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    }),
    { name: 'todo-store' }
  )
);

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  toggleHabit: (id: string, date: string) => void;
  removeHabit: (id: string) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) => set((state) => ({ habits: [habit, ...state.habits] })),
      toggleHabit: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const logs = h.logs.includes(date) ? h.logs.filter((l) => l !== date) : [...h.logs, date];
            const streak = calculateStreak(logs);
            return { ...h, logs, streak };
          }),
        })),
      removeHabit: (id) => set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
    }),
    { name: 'habit-store' }
  )
);

function calculateStreak(logs: string[]): number {
  if (logs.length === 0) return 0;
  const sorted = [...logs].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const checkDate = new Date(today);
  for (const log of sorted) {
    const logDate = new Date(log).toISOString().split('T')[0];
    const expected = checkDate.toISOString().split('T')[0];
    if (logDate === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

interface NoteStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  folders: string[];
  addFolder: (folder: string) => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)),
        })),
      removeNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
      folders: ['General', 'Work', 'Personal', 'Learning'],
      addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
    }),
    { name: 'note-store' }
  )
);

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

interface AppStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
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
    }),
    { name: 'app-store' }
  )
);

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

interface PomodoroStore {
  workDuration: number;
  breakDuration: number;
  sessionsCompleted: number;
  totalFocusTime: number;
  setWorkDuration: (d: number) => void;
  setBreakDuration: (d: number) => void;
  incrementSessions: () => void;
  addFocusTime: (minutes: number) => void;
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set) => ({
      workDuration: 25,
      breakDuration: 5,
      sessionsCompleted: 0,
      totalFocusTime: 0,
      setWorkDuration: (d) => set({ workDuration: d }),
      setBreakDuration: (d) => set({ breakDuration: d }),
      incrementSessions: () => set((s) => ({ sessionsCompleted: s.sessionsCompleted + 1 })),
      addFocusTime: (minutes) => set((s) => ({ totalFocusTime: s.totalFocusTime + minutes })),
    }),
    { name: 'pomodoro-store' }
  )
);
