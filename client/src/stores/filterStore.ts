import { create } from 'zustand';

interface FilterState {
  activeEras: string[];
  activeCategories: string[];
  activeTags: string[];
  activePeople: string[];
  activePlaces: string[];
  searchQuery: string;

  setActiveEras: (eras: string[]) => void;
  setActiveCategories: (categories: string[]) => void;
  setActiveTags: (tags: string[]) => void;
  setActivePeople: (people: string[]) => void;
  setActivePlaces: (places: string[]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Initial state
  activeEras: [],
  activeCategories: [],
  activeTags: [],
  activePeople: [],
  activePlaces: [],
  searchQuery: '',

  // Actions
  setActiveEras: (eras) => set({ activeEras: eras }),
  setActiveCategories: (categories) => set({ activeCategories: categories }),
  setActiveTags: (tags) => set({ activeTags: tags }),
  setActivePeople: (people) => set({ activePeople: people }),
  setActivePlaces: (places) => set({ activePlaces: places }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () =>
    set({
      activeEras: [],
      activeCategories: [],
      activeTags: [],
      activePeople: [],
      activePlaces: [],
      searchQuery: '',
    }),
}));
