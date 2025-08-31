import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";
import { hmacPinWithKode, hmacPinWithNoHp } from "@/utils/crypto";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (kode: string, nomorHp: string, pin: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
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

      login: async (kode, nomorHp, pin) => {
        set({ isLoading: true, error: null });
        try {
          const hashedPin = hmacPinWithKode(pin, kode);
          const hashedNoHp = hmacPinWithNoHp(pin, nomorHp);
          const response = await apiClient.post("/auth/login", {
            kode: kode,
            nomorHp: hashedNoHp,
            pin: hashedPin,
          });
          const { token } = response.data;
          localStorage.setItem("authToken", token);
          set({ token, isLoading: false, error: null });
          return true; // Mengembalikan true jika login berhasil
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
          return false; // Mengembalikan false jika login gagal
        }
      },

      logout: async () => {
        const token = get().token;
        try {
          await apiClient.post(`/auth/logout?${token}`);
        } catch (error) {
          console.error("Gagal melakukan logout di server:", error);
        } finally {
          // Hapus token dari local storage dan state
          localStorage.removeItem("authToken");
          set({ token: null });
          window.location.href = "/login";
        }
      },
    }),
    { name: "Auth Store" }
  )
);

useAuthStore.getState().initialize();
