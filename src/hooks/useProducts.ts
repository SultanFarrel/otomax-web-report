import React from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types"; // Impor tipe dari lokasi terpusat

// --- Custom Hook untuk Debounce ---
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

// --- Fungsi untuk Fetching Data ---
const fetchProducts = async (
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: string
): Promise<ApiResponse> => {
  const endpoint = filterValue
    ? `http://localhost:4000/api/produk/${filterValue}`
    : "http://localhost:4000/api/produk";

  const params: { page: number; pageSize: number; aktif?: string } = {
    page,
    pageSize,
  };

  if (statusFilter !== "all") {
    params.aktif = statusFilter;
  }

  const { data } = await axios.get(endpoint, {
    headers: { "x-api-key": "rest-otomax-KEY" },
    params,
  });

  return data;
};

// --- Inilah Custom Hook kita ---
export function useProducts() {
  const queryClient = useQueryClient();

  // State untuk filter dan paginasi
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  // useQuery untuk mengambil data
  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: ["products", page, debouncedFilterValue, statusFilter],
    queryFn: () =>
      fetchProducts(page, rowsPerPage, debouncedFilterValue, statusFilter),
    placeholderData: (previousData) => previousData, // Untuk pengalaman pengguna yang lebih baik saat paginasi
  });

  // Prefetching untuk halaman selanjutnya
  React.useEffect(() => {
    if (data?.totalPages && page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["products", page + 1, debouncedFilterValue, statusFilter],
        queryFn: () =>
          fetchProducts(
            page + 1,
            rowsPerPage,
            debouncedFilterValue,
            statusFilter
          ),
      });
    }
  }, [data, page, debouncedFilterValue, statusFilter, queryClient]);

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
