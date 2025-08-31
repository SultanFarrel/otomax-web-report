import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";
import { SiteInfo } from "@/types";

interface SiteState {
  siteInfo: SiteInfo | null;
  isLoading: boolean;
  fetchSiteInfo: () => Promise<void>;
}

export const useSiteStore = create<SiteState>()(
  devtools(
    (set, get) => ({
      siteInfo: null,
      isLoading: false,
      fetchSiteInfo: async () => {
        // Mencegah panggilan ganda jika data sudah ada atau sedang diambil
        if (get().siteInfo || get().isLoading) return;

        set({ isLoading: true });
        try {
          const response = await apiClient.get("/webreport/me");
          set({ siteInfo: response.data, isLoading: false });
        } catch (error) {
          console.error("Gagal mengambil info situs:", error);
          set({ isLoading: false });
        }
      },
    }),
    { name: "Site Store" }
  )
);
