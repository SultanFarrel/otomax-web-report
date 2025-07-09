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
  statusFilter: string // status bisa: 'all', 'aktif', 'nonaktif', 'kosong', 'gangguan'
): Promise<ApiResponse> => {
  // Endpoint bisa tetap sama atau disesuaikan jika backend butuh endpoint berbeda
  const endpoint = "http://192.168.10.29:4000/api/produk";

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
    params.search = filterValue; // Menggunakan parameter 'search' yang lebih umum
  }

  // Kirim status filter ke backend
  if (statusFilter !== "all") {
    params.status = statusFilter;
  }

  Object.keys(params).forEach((key) => {
    const K = key as keyof typeof params;
    if (params[K] === undefined) {
      delete params[K];
    }
  });

  console.log("Product API Request Params:", params);

  const { data } = await axios.get(endpoint, {
    headers: { "x-api-key": "rest-otomax-KEY" },
    params,
  });

  return data;
};

// --- Inilah Custom Hook kita ---
export function useProducts() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  // Ubah nilai default statusFilter menjadi 'all' agar lebih konsisten
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    // Tambahkan statusFilter ke queryKey
    queryKey: ["products", page, debouncedFilterValue, statusFilter],
    queryFn: () =>
      fetchProducts(page, rowsPerPage, debouncedFilterValue, statusFilter),
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
