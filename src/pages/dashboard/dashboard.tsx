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
// ✅ Tambahkan useRef
import { useMemo, useState, useRef } from "react";
import { DashboardData } from "@/types"; // Pastikan tipe ini diimpor

export default function DashboardPage() {
  const [limit, setLimit] = useState(5);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const dashboardQueries = useDashboard(dateRange);

  const currentQuery = useMemo(() => {
    return dashboardQueries.find((q) => q.limit === limit);
  }, [dashboardQueries, limit]);

  // Ganti nama `data` menjadi `currentData` untuk menghindari kebingungan
  const {
    data: currentData,
    refetch,
    isLoading,
    isFetching,
  } = currentQuery || {};

  // ✅ Langkah 1: Buat ref untuk menyimpan data terakhir yang berhasil dimuat
  const lastSuccessfulData = useRef<DashboardData>();
  if (currentData) {
    lastSuccessfulData.current = currentData;
  }

  // ✅ Langkah 2: Gunakan data saat ini jika ada, jika tidak, gunakan data dari ref
  // Ini membuat data "lengket" di UI selama pembaruan.
  const dataToRender = currentData || lastSuccessfulData.current;

  // ✅ Langkah 3: Ubah kondisi loading untuk hanya menggunakan dataToRender
  // Spinner fullscreen sekarang HANYA akan muncul jika kita belum pernah punya data sama sekali.
  if (isLoading && !dataToRender) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Memuat Dashboard..." size="lg" />
      </div>
    );
  }

  // Kondisi error juga menggunakan dataToRender
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

  // Pindahkan hook useMemo ke atas
  const topProductsChartData = useMemo(() => {
    if (!dataToRender?.topProducts) {
      return [];
    }
    return dataToRender.topProducts.map((product) => ({
      kode: product.kode_produk,
      value: product.jumlah,
    }));
  }, [dataToRender?.topProducts]);

  return (
    <div className="flex flex-col gap-6">
      {/* Gunakan dataToRender untuk semua komponen */}
      <StatCardsGrid stats={dataToRender.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart
          data={dataToRender.transactionsByStatus}
          dateRange={dateRange}
          onDateChange={setDateRange}
          onResetDateFilter={() => setDateRange(null)}
          // `isFetching` adalah indikator yang tepat untuk pembaruan latar belakang
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
