import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}
type StatsData = Pick<DashboardData, "stats">["stats"];

const fetchDashboardStats = async (kodeUpline: string): Promise<StatsData> => {
  try {
    const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`);

    if (data && typeof data.stats === "object" && data.stats !== null) {
      return data.stats;
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

export function useDashboardStats() {
  const user = useUserStore((state) => state.user);

  return useQuery<StatsData, Error>({
    queryKey: ["dashboardStats", user?.kode],
    queryFn: () => fetchDashboardStats(user!.kode),
    enabled: !!user?.kode,
    staleTime: 0, // Tanpa cache
  });
}
