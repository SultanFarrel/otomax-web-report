import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
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
  const user = useUserStore((state) => state.user);

  const queryKey = isAdmin
    ? ["dashboardStats", "admin"]
    : ["dashboardStats", user?.kode];
  const enabled = isAdmin ? true : !!user?.kode;

  return useQuery<StatsData, Error>({
    queryKey: queryKey,
    queryFn: () => fetchDashboardStats(),
    enabled: enabled,
    staleTime: Infinity,
  });
}
