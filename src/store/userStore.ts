import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "@/api/axios";
import { useAuthStore } from "./authStore";

interface JwtPayload {
  reseller: {
    kode: string;
  };
  // Tambahkan iat dan exp jika ada di dalam token untuk kelengkapan
  iat: number;
  exp: number;
}

interface UserData {
  kode: string;
  nama: string;
  saldo: number;
}

interface UserState {
  user: UserData | null;
  isLoading: boolean;
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      user: null,
      isLoading: false,
      fetchUserData: async () => {
        // Jangan fetch jika data sudah ada atau sedang loading
        if (get().user || get().isLoading) return;

        set({ isLoading: true });
        try {
          // Ambil token dari authStore
          const token = useAuthStore.getState().token;
          if (!token) throw new Error("Tidak ada token otorisasi.");

          // const decoded: JwtPayload = jwtDecode(token);
          const response = await apiClient.get(
            "/reseller/me" //'/reseller/${decoded.reseller.kode}'
          );

          const userData: UserData = {
            kode: response.data.kode, // decoded.reseller.kode,
            nama: response.data.nama,
            saldo: response.data.saldo,
          };
          set({ user: userData, isLoading: false });
        } catch (error) {
          console.error("Gagal mengambil data pengguna:", error);
          set({ isLoading: false });
          // Anda bisa menambahkan logika logout jika fetch gagal di sini
          // useAuthStore.getState().logout();
        }
      },
    }),
    { name: "User Store" }
  )
);
