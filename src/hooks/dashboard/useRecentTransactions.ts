import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

export type RecentTransactionsData = Pick<DashboardData, "recentTransactions">;

const fetchRecentTransactions = async (): Promise<RecentTransactionsData> => {
  try {
    const { data } = await apiClient.get(`/transaksi/recent`);
    // Cek apakah data yang diterima adalah array
    if (Array.isArray(data.recentTransactions)) {
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

export function useRecentTransactions() {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["recentTransactions", user?.kode],
    queryFn: () => fetchRecentTransactions(),
    enabled: !!user?.kode,
    staleTime: 0, // Tanpa cache
  });
}
