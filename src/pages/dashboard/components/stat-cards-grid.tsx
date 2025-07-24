import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody } from "@heroui/card";
import { apiClient } from "@/api/axios";
import { formatCurrency } from "@/utils/formatters";
import { ArrowUpRightIcon, ArrowDownLeftIcon } from "@heroicons/react/24/solid";
import { StatCardsGridSkeleton } from "./skeleton/stat-cards-grid.skeleton";

// Tipe data yang diharapkan dari API
interface StatsData {
  total_trx_today: number;
  total_laba_today: number;
  total_mutasi_in_today: number;
  total_mutasi_out_today: number;
  total_komisi_today: number;
  total_komisi_all: number;
}

// Fungsi untuk mengambil data dari API
const fetchDashboardStats = async (): Promise<StatsData> => {
  // Ganti dengan endpoint API Anda yang sebenarnya jika berbeda
  const { data } = await apiClient.get("/dashboard/stats");
  return data.stats || data; // Sesuaikan berdasarkan struktur respons API Anda
};

export const StatCardsGrid: React.FC = () => {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<StatsData, Error>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  // Tampilkan skeleton saat memuat
  if (isLoading) {
    return <StatCardsGridSkeleton />;
  }

  // Tampilkan pesan kesalahan jika gagal
  if (isError || !stats) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">Gagal memuat data statistik.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardBody>
          <p className="text-sm text-default-500">Transaksi Hari Ini</p>
          <p className="text-2xl font-bold">{stats.total_trx_today} TRX</p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="text-sm text-default-500">Komisi Hari Ini</p>
          <p className="text-xl font-bold text-warning">
            {formatCurrency(stats.total_komisi_today)}
          </p>
          <p className="text-xs text-default-500 mt-1">
            Total Komisi: {formatCurrency(stats.total_komisi_all)}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="text-sm text-default-500">Mutasi Masuk</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-success">
              {formatCurrency(stats.total_mutasi_in_today)}
            </p>
            <ArrowUpRightIcon className="h-5 w-5 text-success" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="text-sm text-default-500">Mutasi Keluar</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-danger">
              {formatCurrency(stats.total_mutasi_out_today)}
            </p>
            <ArrowDownLeftIcon className="h-5 w-5 text-danger" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
