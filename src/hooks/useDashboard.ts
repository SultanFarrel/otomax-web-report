import { useQueries } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";

// Fungsi untuk mengambil semua data dashboard
const fetchDashboardData = async (
  kodeUpline: string,
  limit: number // Tambahkan parameter limit
): Promise<DashboardData> => {
  // Tambahkan 'limit' sebagai query param di URL
  const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`, {
    params: { limit },
  });
  return data;
};

// Hook kustom untuk dashboard
export function useDashboard() {
  const user = useUserStore((state) => state.user);
  const limitsToPrefetch = [3, 5];

  // Gunakan useQueries
  const dashboardQueries = useQueries({
    queries: limitsToPrefetch.map((limit) => {
      return {
        queryKey: ["dashboardData", user?.kode, limit],
        queryFn: () => fetchDashboardData(user!.kode, limit),
        enabled: !!user?.kode,
        meta: { limit },
      };
    }),
  });

  // Tambahkan limit secara eksplisit agar bisa difilter nantinya
  return dashboardQueries.map((query, index) => ({
    ...query,
    limit: limitsToPrefetch[index],
  }));
}
