import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DashboardData } from "@/types";

export type RecentActivityData = Pick<
  DashboardData,
  "recentTransactions" | "recentMutasi"
>;

// Fungsi untuk mengambil data dari endpoint
const fetchRecentActivity = async (
  kodeUpline: string
): Promise<RecentActivityData> => {
  const { data } = await apiClient.get(
    `/dashboard/recent-transaction-mutation/${kodeUpline}`
  );
  return data;
};

export function useRecentActivity() {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["recentActivity", user?.kode],
    queryFn: () => fetchRecentActivity(user!.kode),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // Cache data selama 5 menit
  });
}
