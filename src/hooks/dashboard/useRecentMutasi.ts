import { apiClient } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useRecentMutasi(kodeUpline: string) {
  return useQuery({
    queryKey: ["recentMutasi", kodeUpline],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/dashboard/recent-mutasi/${kodeUpline}`
      );
      return data;
    },
    enabled: !!kodeUpline,
  });
}
