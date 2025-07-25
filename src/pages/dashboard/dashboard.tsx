import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/calendar";

import { StatCardsGrid } from "./components/stat-cards.grid";
import { TransactionActivity } from "./components/transactions-activity";
import { TransactionsByStatusChart } from "./charts/TransactionsByStatusChart";
import { TransactionsByProductChart } from "./charts/TransactionsByProductChart";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import {
  fetchTopProductsAndResellers,
  TopProductsAndResellersData,
} from "@/hooks/dashboard/useTopProductsAndResellers";
import { TopResellersList } from "./components/top-resellers-list";

export default function DashboardPage() {
  const [limit, setLimit] = useState(5);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );

  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  // Prefetch data untuk Top Products Chart agar perpindahan limit terasa instan
  useEffect(() => {
    if (user?.kode) {
      const limitsToPrefetch = [3, 5];
      limitsToPrefetch.forEach((prefetchLimit) => {
        queryClient.prefetchQuery<TopProductsAndResellersData>({
          queryKey: ["topProductsAndResellers", user.kode, prefetchLimit],
          queryFn: () =>
            fetchTopProductsAndResellers(user.kode!, prefetchLimit),
          staleTime: 5 * 60 * 1000, // 5 menit, samakan dengan di hook
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, user?.kode]);

  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart
          dateRange={dateRange}
          onDateChange={setDateRange}
          onResetDateFilter={() => setDateRange(null)}
        />

        <TransactionsByProductChart limit={limit} onLimitChange={setLimit} />

        <TransactionActivity />

        <TopResellersList />
      </div>
    </div>
  );
}
