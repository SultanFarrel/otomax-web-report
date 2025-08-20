import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";
import { hmacPinWithKode } from "@/utils/crypto";

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
          const hashedPin = hmacPinWithKode(pin, kode);
          const response = await apiClient.post("/auth/login", {
            kode: kode,
            pin: hashedPin,
          });
          const { token } = response.data;
          localStorage.setItem("authToken", token);
          set({ token, isLoading: false, error: null });
          window.location.href = "/";
        } catch (err: any) {
          if (err.response) {
            set({
              error: err.response.data?.error || "Login gagal.",
              isLoading: false,
              token: null,
            });
          } else {
            set({
              error: "Gagal terhubung ke server.",
              isLoading: false,
              token: null,
            });
          }
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

useAuthStore.getState().initialize();
