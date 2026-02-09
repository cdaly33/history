import { create } from 'zustand';

interface TourState {
  activeTourId: string | null;
  currentStepIndex: number;
  isPlaying: boolean;

  startTour: (tourId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  jumpToStep: (index: number) => void;
  exitTour: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  // Initial state
  activeTourId: null,
  currentStepIndex: 0,
  isPlaying: false,

  // Actions
  startTour: (tourId) =>
    set({ activeTourId: tourId, currentStepIndex: 0, isPlaying: true }),
  nextStep: () =>
    set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
  previousStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(0, state.currentStepIndex - 1),
    })),
  jumpToStep: (index) => set({ currentStepIndex: index }),
  exitTour: () =>
    set({ activeTourId: null, currentStepIndex: 0, isPlaying: false }),
}));
