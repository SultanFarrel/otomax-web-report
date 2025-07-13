import React from "react";
import apiClient from "@/api/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionApiResponse } from "@/types";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/calendar";
import { useUserStore } from "@/store/userStore";

// const KODE_RESELLER = "AZ0006";

// --- Fungsi Fetching API dengan Format Tanggal YYYY-MM-DD ---
const fetchTransactions = async (
  kode: string,
  page: number,
  filterValue: string,
  statusFilter: string,
  dateRange: RangeValue<DateValue> | null
): Promise<TransactionApiResponse> => {
  const endpoint = `/transaksi/reseller/${kode}`;

  // 1. Kembalikan ke cara yang lebih sederhana
  const params = {
    page,
    pageSize: 10,
    search: filterValue || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    // Cukup gunakan .toString() yang akan menghasilkan format 'YYYY-MM-DD'
    startDate: dateRange ? dateRange.start.toString() : undefined,
    endDate: dateRange ? dateRange.end.toString() : undefined,
  };

  // Hapus properti yang 'undefined'
  Object.keys(params).forEach((key) => {
    const K = key as keyof typeof params;
    if (params[K] === undefined) {
      delete params[K];
    }
  });

  const { data } = await apiClient.get(endpoint, {
    params,
  });

  return data;
};

// --- Custom Hook untuk Debounce (tidak ada perubahan) ---
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Custom Hook useTransactions (tidak ada perubahan) ---
export function useTransactions() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  const debouncedFilterValue = useDebounce(filterValue, 500);

  const { data, isFetching, isError } = useQuery<TransactionApiResponse, Error>(
    {
      queryKey: [
        "transactions",
        user?.kode,
        page,
        debouncedFilterValue,
        statusFilter,
        dateRange,
      ],
      queryFn: () =>
        fetchTransactions(
          user!.kode,
          page,
          debouncedFilterValue,
          statusFilter,
          dateRange
        ),
      enabled: !!user?.kode,
      placeholderData: (previousData) => previousData,
    }
  );

  // useEffect untuk prefetching
  React.useEffect(() => {
    // Pastikan ada data dan ada halaman selanjutnya
    if (data?.totalPages && page < data.totalPages) {
      // Prefetch halaman selanjutnya
      queryClient.prefetchQuery({
        queryKey: [
          "transactions",
          user?.kode,
          page + 1, // Prefetch halaman berikutnya
          debouncedFilterValue,
          statusFilter,
          dateRange,
        ],
        queryFn: () =>
          fetchTransactions(
            user!.kode,
            page + 1,
            debouncedFilterValue,
            statusFilter,
            dateRange
          ),
      });
    }
  }, [
    data,
    page,
    queryClient,
    user,
    debouncedFilterValue,
    statusFilter,
    dateRange,
  ]);

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const onStatusChange = React.useCallback((key: React.Key) => {
    setStatusFilter(key as string);
    setPage(1);
  }, []);

  const onDateChange = React.useCallback((range: RangeValue<DateValue>) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setDateRange(null);
    setPage(1);
  }, []);

  return {
    data,
    isLoading: isFetching && !data,
    isError,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    resetFilters,
  };
}
