import React from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DateValue } from "@heroui/calendar";

// --- Fungsi Fetching API ---
const fetchBalanceMutation = async (
  kode: string,
  page: number,
  pageSize: number,
  filterValue: string,
  dateRange: RangeValue<DateValue> | null
): Promise<BalanceMutationApiResponse> => {
  const endpoint = `/mutasi/reseller/${kode}`;

  const params: {
    page: number;
    pageSize: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {
    page,
    pageSize,
  };

  if (filterValue) {
    params.search = filterValue;
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

// --- Hook Kustom useBalanceMutation ---
export function useBalanceMutation() {
  const user = useUserStore((state) => state.user);

  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: [
      "balanceMutation",
      user?.kode,
      page,
      debouncedFilterValue,
      dateRange,
    ],
    queryFn: () =>
      fetchBalanceMutation(
        user!.kode,
        page,
        rowsPerPage,
        debouncedFilterValue,
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

  const onDateChange = React.useCallback((range: RangeValue<DateValue>) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilterValue("");
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
    dateRange,
    onDateChange,
    resetFilters,
  };
}
