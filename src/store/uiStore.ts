import { create } from "zustand";
import { devtools } from "zustand/middleware"; // <-- 1. Import devtools

interface UiState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  toggleSidebarCollapse: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

// 2. Bungkus store Anda dengan devtools()
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
    { name: "UI Store" } // Nama opsional untuk store Anda
  )
);
