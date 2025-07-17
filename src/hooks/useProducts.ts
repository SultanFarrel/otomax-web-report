import React from "react";

import { useQuery } from "@tanstack/react-query";

import { ApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useDebounce } from "@/hooks/useDebounce";

// --- Fetching API ---
const fetchProducts = async (
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: string
): Promise<ApiResponse> => {
  const endpoint = "/produk";

  const params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
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

// --- Custom Hook useProducts ---
export function useProducts() {
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: ["products", page, debouncedFilterValue, statusFilter],
    queryFn: () =>
      fetchProducts(page, rowsPerPage, debouncedFilterValue, statusFilter),
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000, // Cache data selama 1 menit
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

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh UI
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
  };
}
