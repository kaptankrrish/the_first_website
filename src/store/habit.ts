import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit } from '@/types';

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

export { calculateStreak };
