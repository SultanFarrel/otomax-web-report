import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useAdminUserStore } from "@/store/adminUserStore";
import { DashboardData } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}
type StatsData = Pick<DashboardData, "stats">["stats"];

const fetchDashboardStats = async (): Promise<StatsData> => {
  try {
    const { data } = await apiClient.get(`/transaksi/today_stats`);

    if (data && typeof data === "object" && data !== null) {
      return data;
    }

    throw new Error("Format respons API tidak valid.");
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(
      err instanceof Error ? err.message : "Gagal mengambil data statistik."
    );
  }
};

export function useDashboardStats({ isAdmin = false } = {}) {
  // Ambil data dari kedua store
  const user = useUserStore((state) => state.user);
  const adminUser = useAdminUserStore((state) => state.adminUser);

  // Tentukan pengguna mana yang aktif
  const currentUser = isAdmin ? adminUser : user;

  return useQuery<StatsData, Error>({
    // Tambahkan currentUser?.kode ke queryKey agar query berjalan ulang jika user berubah
    queryKey: ["dashboardStats", currentUser?.kode],
    queryFn: () => fetchDashboardStats(),
    // Aktifkan query HANYA JIKA data pengguna yang relevan sudah ada
    enabled: !!currentUser?.kode,
    staleTime: Infinity,
  });
}
