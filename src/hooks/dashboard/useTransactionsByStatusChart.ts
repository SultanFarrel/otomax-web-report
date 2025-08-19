import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { DateValue, RangeValue } from "@heroui/calendar";
import { AxiosError } from "axios";

type ChartData = Pick<
  DashboardData,
  "transactionsByStatus"
>["transactionsByStatus"];

interface ApiError {
  error: string;
}

// Fungsi untuk mengambil data chart status transaksi
const fetchTransactionsByStatusChart = async (
  kodeUpline: string,
  dateRange: RangeValue<DateValue> | null
): Promise<ChartData> => {
  try {
    const { data } = await apiClient.get(
      `/dashboard/status-chart/${kodeUpline}`,
      {
        params: {
          // referenceDate: "2025-07-21", // DELETE THIS FOR PRODUCTION
          startDate: dateRange ? dateRange.start.toString() : undefined,
          endDate: dateRange ? dateRange.end.toString() : undefined,
        },
      }
    );

    // Cek apakah data yang diterima adalah array
    if (Array.isArray(data)) {
      return data;
    }

    // Jika bukan array, mungkin ini adalah objek error dari server.
    if (data && data.error) {
      throw new Error(data.error);
    }

    // Jika bukan array dan bukan objek error, lemparkan error umum.
    throw new Error("Format respons API tidak valid.");
  } catch (err) {
    const error = err as AxiosError<ApiError> | Error;

    // Cek apakah error sudah merupakan instance dari Error, jika ya, lemparkan kembali
    if (err instanceof Error) {
      throw err;
    }

    // Logika fallback jika error berasal dari Axios
    const axiosError = error as AxiosError<ApiError>;
    if (
      axiosError.response &&
      axiosError.response.data &&
      axiosError.response.data.error
    ) {
      throw new Error(axiosError.response.data.error);
    }
    throw new Error("Gagal mengambil data chart transaksi.");
  }
};

export function useTransactionsByStatusChart(
  dateRange: RangeValue<DateValue> | null
) {
  const user = useUserStore((state) => state.user);

  return useQuery<ChartData, Error>({
    queryKey: ["transactionsByStatusChart", user?.kode, dateRange],
    queryFn: () => fetchTransactionsByStatusChart(user!.kode, dateRange),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // Cache data selama 5 menit
  });
}
