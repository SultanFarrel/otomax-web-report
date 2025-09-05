import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@/api/axios";
import { useAdminAuthStore } from "./adminAuthStore";

interface AdminData {
  kode: string;
  nama: string;
  saldo?: number;
  komisi?: number;
  poin?: number;
}

interface AdminUserState {
  adminUser: AdminData | null;
  isLoading: boolean;
  fetchAdminData: () => Promise<void>;
}

export const useAdminUserStore = create<AdminUserState>()(
  devtools(
    (set, get) => ({
      adminUser: null,
      isLoading: false,
      fetchAdminData: async () => {
        if (get().adminUser || get().isLoading) return;

        set({ isLoading: true });
        try {
          const adminToken = useAdminAuthStore.getState().adminToken;
          if (!adminToken) {
            set({ isLoading: false });
            return;
          }

          // Request ini akan otomatis di-handle oleh interceptor axios
          // menjadi /adm/reseller/me dengan token admin
          const response = await apiClient.get("/admin/me");

          const adminData: AdminData = response.data;
          set({ adminUser: adminData, isLoading: false });
        } catch (error) {
          console.error("Gagal mengambil data admin:", error);
          set({ isLoading: false });
        }
      },
    }),
    { name: "Admin User Store" }
  )
);
