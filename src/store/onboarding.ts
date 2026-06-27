import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingStore {
  hasCompletedTour: boolean;
  tourStep: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
  resetTour: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasCompletedTour: false,
      tourStep: 0,
      startTour: () => set({ tourStep: 0, hasCompletedTour: false }),
      nextStep: () => set((s) => ({ tourStep: s.tourStep + 1 })),
      prevStep: () => set((s) => ({ tourStep: Math.max(0, s.tourStep - 1) })),
      skipTour: () => set({ hasCompletedTour: true, tourStep: 0 }),
      finishTour: () => set({ hasCompletedTour: true, tourStep: 0 }),
      resetTour: () => set({ hasCompletedTour: false, tourStep: 0 }),
    }),
    { name: 'onboarding-store' }
  )
);
