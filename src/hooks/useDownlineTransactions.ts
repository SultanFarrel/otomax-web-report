import React from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DateValue } from "@heroui/calendar";

// --- Fungsi Fetching API ---
const fetchDownlineTransactions = async (
  uplineKode: string,
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: string,
  dateRange: RangeValue<DateValue> | null
): Promise<TransactionApiResponse> => {
  const endpoint = `/transaksi/upline/${uplineKode}`;

  const params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {
    page,
    pageSize,
  };

  if (filterValue) {
    params.search = filterValue;
  }

  if (statusFilter !== "all") {
    params.status = statusFilter;
  }

  if (dateRange !== null) {
    params.startDate = dateRange.start.toString();
    params.endDate = dateRange.end.toString();
  }

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

// --- Hook Kustom useDownlineTransactions ---
export function useDownlineTransactions() {
  const user = useUserStore((state) => state.user);

  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "downlineTransactions",
      user?.kode,
      page,
      debouncedFilterValue,
      statusFilter,
      dateRange,
    ],
    queryFn: () =>
      fetchDownlineTransactions(
        user!.kode,
        page,
        rowsPerPage,
        debouncedFilterValue,
        statusFilter,
        dateRange
      ),
    enabled: !!user?.kode,
    placeholderData: (previousData) => previousData,
  });

  // Handler untuk mengubah filter
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
    isLoading,
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
