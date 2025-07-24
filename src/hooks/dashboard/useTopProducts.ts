import { apiClient } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useTopProducts(kodeUpline: string, limit = 5) {
  return useQuery({
    queryKey: ["topProducts", kodeUpline, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/dashboard/top-products/${kodeUpline}`,
        {
          params: { limit },
        }
      );
      return data;
    },
    enabled: !!kodeUpline,
  });
}
