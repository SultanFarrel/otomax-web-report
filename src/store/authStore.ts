import { create } from "zustand";
import { devtools } from "zustand/middleware";
import apiClient from "@/api/axios";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (kode: string, pin: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      initialize: () => {
        try {
          const token = localStorage.getItem("authToken");
          set({ token, isInitialized: true });
        } catch (error) {
          set({ isInitialized: true });
        }
      },

      login: async (kode, pin) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post("/auth/login", {
            kode: kode,
            pin: pin,
          });
          const { token } = response.data;
          localStorage.setItem("authToken", token);
          set({ token, isLoading: false, error: null });
          window.location.href = "/";
        } catch (err) {
          const errorMessage = "Kode atau PIN salah.";
          set({ error: errorMessage, isLoading: false, token: null });
        }
      },

      logout: () => {
        localStorage.removeItem("authToken");
        set({ token: null });
        window.location.href = "/login";
      },
    }),
    { name: "Auth Store" }
  )
);

// Panggil initialize saat aplikasi pertama kali dimuat
useAuthStore.getState().initialize();
