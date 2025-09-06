import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { ChartStats } from "@/types";

export type TimeRange = "weekly" | "monthly" | "yearly";

const fetchChartStats = async (range: TimeRange): Promise<ChartStats> => {
  const { data } = await apiClient.get("mock/adm/chart/stats", {
    params: { range },
  });
  return data;
};

export function useChartStats(range: TimeRange) {
  return useQuery<ChartStats, Error>({
    queryKey: ["chartStats", range],
    queryFn: () => fetchChartStats(range),
    staleTime: Infinity,
  });
}
