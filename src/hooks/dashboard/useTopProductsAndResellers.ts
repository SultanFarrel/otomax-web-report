import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";

export type TopProductsAndResellersData = Pick<
  DashboardData,
  "topProducts" | "topResellers"
>;

// Fungsi untuk mengambil data dari endpoint
export const fetchTopProductsAndResellers = async (
  kodeUpline: string,
  limit: number
): Promise<TopProductsAndResellersData> => {
  const { data } = await apiClient.get(
    `/dashboard/top-products-resellers/${kodeUpline}`,
    {
      params: { limit },
    }
  );
  return data;
};

export function useTopProductsAndResellers(limit: number) {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["topProductsAndResellers", user?.kode, limit],
    queryFn: () => fetchTopProductsAndResellers(user!.kode, limit),
    enabled: !!user?.kode,
    placeholderData: (previousData: TopProductsAndResellersData | undefined) =>
      previousData,
    staleTime: 5 * 60 * 1000, // Cache data selama 5 menit
  });
}
