import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { DateValue, RangeValue } from "@heroui/calendar";

type ChartData = Pick<
  DashboardData,
  "transactionsByStatus"
>["transactionsByStatus"];

// Fungsi untuk mengambil data chart status transaksi
const fetchTransactionsByStatusChart = async (
  kodeUpline: string,
  dateRange: RangeValue<DateValue> | null
): Promise<ChartData> => {
  const { data } = await apiClient.get(
    `/dashboard/status-chart/${kodeUpline}`,
    {
      params: {
        referenceDate: "2025-07-21", // DELETE THIS FOR PRODUCTION
        startDate: dateRange ? dateRange.start.toString() : undefined,
        endDate: dateRange ? dateRange.end.toString() : undefined,
      },
    }
  );
  return data;
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
