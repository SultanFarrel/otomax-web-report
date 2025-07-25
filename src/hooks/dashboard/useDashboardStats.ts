import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";

// Tipe data spesifik untuk statistik
type StatsData = Pick<DashboardData, "stats">["stats"];

// Fungsi untuk mengambil data statistik
const fetchDashboardStats = async (kodeUpline: string): Promise<StatsData> => {
  const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`);
  // Pastikan kita mengembalikan object stats atau object yang strukturnya cocok
  return data.stats || data;
};

export function useDashboardStats() {
  const user = useUserStore((state) => state.user);

  return useQuery<StatsData, Error>({
    queryKey: ["dashboardStats", user?.kode],
    queryFn: () => fetchDashboardStats(user!.kode),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // Cache data selama 5 menit
  });
}
