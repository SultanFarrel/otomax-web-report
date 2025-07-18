import { useQueries } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";
import { DateValue, RangeValue } from "@heroui/calendar";

const fetchDashboardData = async (
  kodeUpline: string,
  limit: number,
  dateRange: RangeValue<DateValue> | null
): Promise<DashboardData> => {
  const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`, {
    params: {
      limit,
      startDate: dateRange ? dateRange.start.toString() : undefined,
      endDate: dateRange ? dateRange.end.toString() : undefined,
    },
  });
  return data;
};

export function useDashboard(dateRange: RangeValue<DateValue> | null) {
  const user = useUserStore((state) => state.user);
  const limitsToPrefetch = [3, 5];

  const dashboardQueries = useQueries({
    queries: limitsToPrefetch.map((limit) => {
      return {
        queryKey: ["dashboardData", user?.kode, limit, dateRange],
        queryFn: () => fetchDashboardData(user!.kode, limit, dateRange),
        enabled: !!user?.kode,
        // ✅ INI KUNCINYA: Tetap tampilkan data sebelumnya saat data baru sedang diambil
        placeholderData: (previousData: DashboardData | undefined) =>
          previousData,
        meta: { limit },
      };
    }),
  });

  return dashboardQueries.map((query, index) => ({
    ...query,
    limit: limitsToPrefetch[index],
  }));
}
