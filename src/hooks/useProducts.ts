import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { SortDescriptor } from "@heroui/table";

// --- Tipe data Provider diperbarui sesuai respons API ---
export interface Provider {
  kode: string;
  nama: string;
  gangguan: number;
  kosong: number;
}

// --- Fungsi Fetching API ---
const fetchProducts = async (
  page: number,
  pageSize: number,
  filterValue: string,
  statusFilter: string,
  providerFilter: string,
  sortDescriptor: SortDescriptor
): Promise<ApiResponse> => {
  // ... (tidak ada perubahan di fungsi ini)
  const endpoint = "/produk";
  const params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    operator?: string;
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
  if (providerFilter !== "all") {
    params.operator = providerFilter;
  }
  if (sortDescriptor && sortDescriptor.column) {
    params.sortBy = sortDescriptor.column as string;
    params.sortDirection = sortDescriptor.direction;
  }

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

// --- Fungsi untuk mengambil data provider dari API ---
const fetchProviders = async (): Promise<Provider[]> => {
  // Sesuaikan endpoint jika berbeda, misal: "/providers"
  const { data } = await apiClient.get("/provider");
  return data.data; // Mengambil array dari dalam properti "data"
};

// --- Custom Hook useProducts ---
export function useProducts() {
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [providerFilter, setProviderFilter] = React.useState<string>("all");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const rowsPerPage = 10;

  // Query untuk produk
  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: [
      "products",
      page,
      debouncedFilterValue,
      statusFilter,
      providerFilter,
      sortDescriptor,
    ],
    queryFn: () =>
      fetchProducts(
        page,
        rowsPerPage,
        debouncedFilterValue,
        statusFilter,
        providerFilter,
        sortDescriptor
      ),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  // --- Mengaktifkan kembali useQuery untuk data provider dari API ---
  const { data: providers, isLoading: isProvidersLoading } = useQuery<
    Provider[],
    Error
  >({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
  });

  // --- Handlers (tidak ada perubahan) ---
  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const onStatusChange = React.useCallback((key: React.Key) => {
    setStatusFilter(key as string);
    setPage(1);
  }, []);

  const onProviderChange = React.useCallback((key: React.Key) => {
    setProviderFilter(key as string);
    setPage(1);
  }, []);

  const resetFilters = React.useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setProviderFilter("all");
    setSortDescriptor({ column: "kode", direction: "ascending" });
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
    providerFilter,
    onProviderChange,
    providers,
    isProvidersLoading,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
