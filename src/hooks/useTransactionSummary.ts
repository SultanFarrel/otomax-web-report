import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { type DateValue, type RangeValue } from "@heroui/calendar";

// Definisikan tipe agar sesuai dengan respons API Anda
interface StatusSummary {
  status: string;
  jumlah: number;
}

interface ProductSummary {
  kode: string;
  value: number;
}

interface TransactionSummaryResponse {
  transactionsByStatus: StatusSummary[];
  transactionsByProduct: ProductSummary[];
}

// Fungsi untuk mengambil data summary, sekarang dengan parameter tanggal
const fetchTransactionSummary = async (
  kode: string,
  limit: number,
  dateRange: RangeValue<DateValue> | null
): Promise<TransactionSummaryResponse> => {
  const params = {
    limit,
    // Kirim tanggal dalam format YYYY-MM-DD jika ada
    startDate: dateRange ? dateRange.start.toString() : undefined,
    endDate: dateRange ? dateRange.end.toString() : undefined,
  };

  // Hapus parameter yang tidak didefinisikan
  Object.keys(params).forEach((key) => {
    const K = key as keyof typeof params;
    if (params[K] === undefined) {
      delete params[K];
    }
  });

  const { data } = await apiClient.get(`/transaksi/summary/${kode}`, {
    params,
  });
  return data;
};

// Hook kustom
export function useTransactionSummary() {
  const user = useUserStore((state) => state.user);
  const [limit, setLimit] = useState(5);
  // State baru untuk mengelola rentang tanggal
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );

  const query = useQuery<TransactionSummaryResponse, Error>({
    // Tambahkan dateRange ke queryKey agar data di-refetch saat tanggal berubah
    queryKey: ["transactionSummary", user?.kode, limit, dateRange],
    queryFn: () => fetchTransactionSummary(user!.kode, limit, dateRange),
    enabled: !!user?.kode,
    staleTime: 1 * 60 * 1000, // Cache data selama 1 menit
  });

  // Handler untuk mengubah state tanggal
  const onDateChange = (range: RangeValue<DateValue>) => {
    setDateRange(range);
  };

  // --- FUNGSI BARU UNTUK RESET FILTER ---
  const resetDateFilter = () => {
    setDateRange(null);
  };

  return {
    ...query,
    limit,
    setLimit,
    dateRange,
    onDateChange,
    resetDateFilter,
  };
}
