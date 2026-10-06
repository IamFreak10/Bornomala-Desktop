import { create } from 'zustand';
import type { Department } from './types';

interface BooksUIState {
  // UI / filter state only — server data is owned by TanStack Query
  selectedDeptId: number | null;
  selectedSemId: number | null;
  searchQuery: string;

  // Called once when data first arrives so we can seed the default selection
  initSelection: (departments: Department[]) => void;
  setSelectedDept: (deptId: number | null, departments: Department[]) => void;
  setSelectedSem: (semId: number | null) => void;
  setSearchQuery: (q: string) => void;
}

export const useBooksStore = create<BooksUIState>((set) => ({
  selectedDeptId: null,
  selectedSemId: null,
  searchQuery: '',

  initSelection: (departments) => {
    set((s) => {
      // Only initialise if nothing is selected yet
      if (s.selectedDeptId !== null) return s;
      return {
        selectedDeptId: departments[0]?.departmentId ?? null,
        selectedSemId: departments[0]?.semesters[0]?.semesterId ?? null,
      };
    });
  },

  setSelectedDept: (deptId, departments) => {
    const dept = departments.find((d) => d.departmentId === deptId);
    set({
      selectedDeptId: deptId,
      selectedSemId: dept?.semesters[0]?.semesterId ?? null,
    });
  },

  setSelectedSem: (semId) => set({ selectedSemId: semId }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
