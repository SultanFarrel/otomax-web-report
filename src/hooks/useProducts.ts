import React from "react";

import { useQuery } from "@tanstack/react-query";

import { ApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useDebounce } from "@/hooks/useDebounce";

import { SortDescriptor } from "@heroui/table";

const fetchProducts = async (
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: string,
  sortDescriptor: SortDescriptor
): Promise<ApiResponse> => {
  const endpoint = "/produk";

  const params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: "ascending" | "descending";
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

  if (sortDescriptor && sortDescriptor.column) {
    params.sortBy = sortDescriptor.column as string;
    params.sortDirection = sortDescriptor.direction;
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

export function useProducts() {
  const [page, setPage] = React.useState(1);
  const [inputValue, setInputValue] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: [
      "products",
      page,
      debouncedFilterValue,
      statusFilter,
      sortDescriptor,
    ],
    queryFn: () =>
      fetchProducts(
        page,
        rowsPerPage,
        debouncedFilterValue,
        statusFilter,
        sortDescriptor
      ),
    placeholderData: (previousData) => previousData,
    staleTime: Infinity, // Tanpa cache
  });

  const onSearchChange = React.useCallback((value?: string) => {
    setInputValue(value || "");
  }, []);

  const onSearchSubmit = React.useCallback(() => {
    setFilterValue(inputValue);
    setPage(1);
  }, [inputValue]);

  const onStatusChange = React.useCallback((key: React.Key) => {
    setInputValue("");
    setFilterValue("");
    setStatusFilter(key as string);
    setPage(1);
  }, []);

  const resetFilters = React.useCallback(() => {
    setInputValue("");
    setFilterValue("");
    setStatusFilter("all");
    setSortDescriptor({ column: "kode", direction: "ascending" });
    setPage(1);
  }, []);

  return {
    data,
    isLoading,
    isError,
    page,
    setPage,
    inputValue,
    onSearchChange,
    onSearchSubmit,
    statusFilter,
    onStatusChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
