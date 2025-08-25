import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

export type RecentMutationsData = Pick<DashboardData, "recentMutasi">;

const fetchRecentMutations = async (
  kodeUpline: string
): Promise<RecentMutationsData> => {
  try {
    const { data } = await apiClient.get(
      `/dashboard/recent-transaction-mutation/${kodeUpline}`
    );
    // Cek apakah data yang diterima adalah array
    if (Array.isArray(data.recentMutasi)) {
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

export function useRecentMutations() {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["recentMutations", user?.kode],
    queryFn: () => fetchRecentMutations(user!.kode),
    enabled: !!user?.kode,
    staleTime: Infinity, // Tanpa cache
  });
}
