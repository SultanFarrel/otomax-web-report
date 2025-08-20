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

    // Cek apakah data yang diterima adalah array
    if (Array.isArray(data.stats)) {
      return data.stats || data;
    }

    // Jika bukan array, mungkin ini adalah objek error dari server.
    if (data.stats && data.error) {
      throw new Error(data.error);
    }

    // Jika bukan array dan bukan objek error, lemparkan error umum.
    throw new Error("Format respons API tidak valid.");
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Gagal mengambil data statistik.");
  }
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
