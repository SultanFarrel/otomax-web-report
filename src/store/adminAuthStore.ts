import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";

interface AdminAuthState {
  adminToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  devtools(
    (set, get) => ({
      adminToken: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      initialize: () => {
        try {
          const token = localStorage.getItem("adminAuthToken");
          set({ adminToken: token, isInitialized: true });
        } catch (error) {
          set({ isInitialized: true });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Ganti dengan endpoint login admin yang sesuai (MOCK)
          const response = await apiClient.post("/mock/adm/auth/login", {
            email,
            password,
          });
          const { token } = response.data;
          localStorage.setItem("adminAuthToken", token);
          set({ adminToken: token, isLoading: false, error: null });
          return true;
        } catch (err: any) {
          if (err.response) {
            set({
              error: err.response.data?.error || "Login admin gagal.",
              isLoading: false,
              adminToken: null,
            });
          } else {
            set({
              error: "Gagal terhubung ke server.",
              isLoading: false,
              adminToken: null,
            });
          }
          return false;
        }
      },

      logout: async () => {
        const adminToken = get().adminToken;
        try {
          await apiClient.post(`/auth/logout?${adminToken}`);
        } catch (error) {
          console.error("Gagal melakukan logout di server:", error);
        } finally {
          localStorage.removeItem("adminAuthToken");
          set({ adminToken: null });
          window.location.href = "/adm/login";
        }
      },
    }),
    { name: "Admin Auth Store" }
  )
);

useAdminAuthStore.getState().initialize();
