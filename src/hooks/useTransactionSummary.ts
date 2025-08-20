import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { type DateValue, type RangeValue } from "@heroui/calendar";

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

const fetchTransactionSummary = async (
  kode: string,
  limit: number,
  dateRange: RangeValue<DateValue> | null
): Promise<TransactionSummaryResponse> => {
  const params = {
    limit,
    startDate: dateRange ? dateRange.start.toString() : undefined,
    endDate: dateRange ? dateRange.end.toString() : undefined,
  };

  // Hapus parameter yang undefined
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

export function useTransactionSummary() {
  const user = useUserStore((state) => state.user);
  const [limit, setLimit] = useState(5);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );

  const query = useQuery<TransactionSummaryResponse, Error>({
    queryKey: ["transactionSummary", user?.kode, limit, dateRange],
    queryFn: () => fetchTransactionSummary(user!.kode, limit, dateRange),
    enabled: !!user?.kode,
    staleTime: 1 * 60 * 1000, // Cache data selama 1 menit
  });

  const onDateChange = (range: RangeValue<DateValue>) => {
    setDateRange(range);
  };

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
