import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
