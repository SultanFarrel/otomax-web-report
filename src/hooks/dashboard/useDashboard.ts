import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export function useDashboardStats(kodeUpline: string) {
  return useQuery({
    queryKey: ["dashboardStats", kodeUpline],
    queryFn: async () => {
      const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`);
      return data.stats;
    },
    enabled: !!kodeUpline,
  });
}
