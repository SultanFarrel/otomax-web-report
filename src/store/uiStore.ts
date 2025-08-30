import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UiState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>()(
  devtools(
    (set) => ({
      isSidebarCollapsed: false,
      isSidebarOpen: false,
      toggleSidebarCollapse: () =>
        set(
          (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }),
          false,
          "toggleSidebarCollapse"
        ),
      setSidebarOpen: (isOpen) =>
        set({ isSidebarOpen: isOpen }, false, "setSidebarOpen"),
    }),
    { name: "UI Store" }
  )
);
