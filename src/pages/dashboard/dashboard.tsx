import { useDashboard } from "@/hooks/useDashboard";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";

// Impor komponen layout baru
import { StatCardsGrid } from "./components/stat-cards.grid";
import { TopResellersWidget } from "./components/top-resellers-widget";
import { TransactionActivity } from "./components/transactions-activity";
import { TransactionsByStatusChart } from "./charts/TransactionsByStatusChart";
import { TransactionsByProductChart } from "./charts/TransactionsByProductChart";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const [limit, setLimit] = useState(5);
  const dashboardQueries = useDashboard();

  const isAnyLoading = dashboardQueries.some((query) => query.isLoading);
  const firstErrorResult = dashboardQueries.find((query) => query.isError);

  const currentQuery = useMemo(() => {
    return dashboardQueries.find((q) => q.limit === limit);
  }, [dashboardQueries, limit]);

  const { data, refetch } = currentQuery || {};

  const topProductsChartData = useMemo(() => {
    // Pastikan data tidak undefined sebelum di-map
    if (!data?.topProducts) {
      return [];
    }
    // Ubah setiap item di array agar propertinya cocok
    return data.topProducts.map((product) => ({
      kode: product.kode_produk,
      value: product.jumlah,
    }));
  }, [data?.topProducts]);

  if (isAnyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Memuat Dashboard..." size="lg" />
      </div>
    );
  }

  if (firstErrorResult || !data) {
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
      <StatCardsGrid stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart data={data.transactionsByStatus} />

        <TransactionsByProductChart
          data={topProductsChartData}
          limit={limit}
          onLimitChange={setLimit}
        />

        <TransactionActivity
          recentTransactions={data.recentTransactions}
          recentMutasi={data.recentMutasi}
        />

        <TopResellersWidget data={data.topResellers} />
      </div>
    </div>
  );
}
