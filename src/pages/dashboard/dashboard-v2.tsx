import { useDashboard } from "@/hooks/useDashboard";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/calendar";

import { StatCardsGrid } from "./components/stat-cards.grid";
import { TopResellersWidget } from "./components/top-resellers-widget";
import { TransactionActivity } from "./components/transactions-activity";
import { TransactionsByStatusChart } from "./charts/TransactionsByStatusChart";
import { TransactionsByProductChart } from "./charts/TransactionsByProductChart";
import { useMemo, useState, useRef } from "react";
import { DashboardData } from "@/types";

export default function DashboardPage() {
  const [limit, setLimit] = useState(5);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const dashboardQueries = useDashboard(dateRange);

  const currentQuery = useMemo(() => {
    return dashboardQueries.find((q) => q.limit === limit);
  }, [dashboardQueries, limit]);

  const {
    data: currentData,
    refetch,
    isLoading,
    isFetching,
  } = currentQuery || {};

  const lastSuccessfulData = useRef<DashboardData>();
  if (currentData) {
    lastSuccessfulData.current = currentData;
  }

  const dataToRender = currentData || lastSuccessfulData.current;

  const topProductsChartData = useMemo(() => {
    if (!dataToRender?.topProducts) {
      return [];
    }
    return dataToRender.topProducts.map((product) => ({
      kode: product.kode_produk,
      value: product.jumlah,
    }));
  }, [dataToRender?.topProducts]);

  if (isLoading && !dataToRender) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Memuat Dashboard..." size="lg" />
      </div>
    );
  }

  if (!dataToRender) {
    return (
      <div className="text-center">
        <p className="text-danger mb-4">Gagal memuat data dashboard.</p>
        <Button color="primary" onClick={() => refetch?.()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid stats={dataToRender.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart
          data={dataToRender.transactionsByStatus}
          dateRange={dateRange}
          onDateChange={setDateRange}
          onResetDateFilter={() => setDateRange(null)}
          isUpdating={isFetching}
        />

        <TransactionsByProductChart
          data={topProductsChartData}
          limit={limit}
          onLimitChange={setLimit}
        />

        <TransactionActivity
          recentTransactions={dataToRender.recentTransactions}
          recentMutasi={dataToRender.recentMutasi}
        />

        <TopResellersWidget data={dataToRender.topResellers} />
      </div>
    </div>
  );
}
