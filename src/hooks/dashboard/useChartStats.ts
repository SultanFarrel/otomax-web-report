// src/hooks/dashboard/useChartStats.ts

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { ChartStats } from "@/types";
import { useAdminUserStore } from "@/store/adminUserStore";

export type TimeRange = "weekly" | "monthly" | "yearly";

const fetchChartStats = async (range: TimeRange): Promise<ChartStats> => {
  // Interceptor akan menambahkan /adm secara otomatis
  const { data } = await apiClient.get("/chart/stats", { params: { range } });
  return data;
};

export function useChartStats(range: TimeRange) {
  const adminUser = useAdminUserStore((state) => state.adminUser);

  return useQuery<ChartStats, Error>({
    // Tambahkan range ke queryKey agar data di-refetch saat range berubah
    queryKey: ["chartStats", adminUser?.kode, range],
    queryFn: () => fetchChartStats(range),
    enabled: !!adminUser?.kode,
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
}
