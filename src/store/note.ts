import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note } from '@/types';

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
