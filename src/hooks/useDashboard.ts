// src/hooks/useDashboard.ts

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { Transaction, BalanceMutation } from "@/types";

// Tipe data untuk ringkasan statistik
interface DashboardStats {
  total_trx_today: number;
  total_laba_today: number;
  total_mutasi_in_today: number;
  total_mutasi_out_today: number;
  total_komisi_today: number;
  total_komisi_all: number;
}

// Tipe data untuk tren transaksi
interface TransactionTrend {
  tanggal: string;
  jumlah: number;
}

// Tipe data untuk top produk
interface TopProduct {
  kode_produk: string;
  jumlah: number;
}

// Tipe data untuk top reseller
interface TopReseller {
  kode_reseller: string;
  nama_reseller: string;
  jumlah_transaksi: number;
}

// Tipe data untuk respons gabungan dari API
interface DashboardData {
  stats: DashboardStats;
  transactionsByStatus: { status: string; jumlah: number }[];
  transactionsByProduct: { kode: string; value: number }[];
  transactionTrend: TransactionTrend[]; // Data baru untuk tren
  recentTransactions: Transaction[];
  recentMutasi: BalanceMutation[];
  topProducts: TopProduct[];
  topResellers: TopReseller[];
}

// Fungsi untuk mengambil semua data dashboard
const fetchDashboardData = async (
  kodeUpline: string,
  limit: number // Tambahkan parameter limit
): Promise<DashboardData> => {
  // Tambahkan 'limit' sebagai query param di URL
  const { data } = await apiClient.get(`/dashboard/summary/${kodeUpline}`, {
    params: { limit },
  });
  return data;
};

// Hook kustom untuk dashboard
export function useDashboard() {
  const user = useUserStore((state) => state.user);

  const [limit, setLimit] = useState(5); // Nilai default adalah 5

  const { data, isLoading, isError, refetch } = useQuery<DashboardData, Error>({
    // 4. Tambahkan 'limit' ke queryKey agar data di-refetch saat limit berubah
    queryKey: ["dashboardData", user?.kode, limit],
    // 5. Kirim 'limit' saat memanggil fungsi fetch
    queryFn: () => fetchDashboardData(user!.kode, limit),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    limit,
    onLimitChange: setLimit,
  };
}
