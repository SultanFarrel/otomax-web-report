import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";
import { useAuthStore } from "./authStore";

interface UserData {
  kode: string;
  nama: string;
  saldo: number;
  // Tambahan properti komisi dan poin
  komisi: number;
  poin: number;
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
          if (!token) return;
          // Hit endpoint pertama (/webreport/me)
          await apiClient.get("/webreport/me");

          // Setelah berhasil, hit endpoint kedua (/reseller/me)
          const response = await apiClient.get("/reseller/me");

          const userData: UserData = {
            kode: response.data.kode,
            nama: response.data.nama,
            saldo: response.data.saldo,
            // Ambil data komisi dan poin dari response
            komisi: response.data.komisi,
            poin: response.data.poin,
          };
          set({ user: userData, isLoading: false });
        } catch (error) {
          console.error("Gagal mengambil data pengguna:", error);
          set({ isLoading: false });
        }
      },
    }),
    { name: "User Store" }
  )
);
