import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

export type RecentActivityData = Pick<
  DashboardData,
  "recentTransactions" | "recentMutasi"
>;

const fetchRecentActivity = async (
  kodeUpline: string
): Promise<RecentActivityData> => {
  try {
    const { data } = await apiClient.get(
      `/dashboard/recent-transaction-mutation/${kodeUpline}`
    );
    // Cek apakah data yang diterima adalah array
    if (
      Array.isArray(data.recentTransactions) &&
      Array.isArray(data.recentMutasi)
    ) {
      return data;
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

export function useRecentActivity() {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["recentActivity", user?.kode],
    queryFn: () => fetchRecentActivity(user!.kode),
    enabled: !!user?.kode,
    staleTime: Infinity, // Tanpa cache
  });
}
