import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { SortDescriptor } from "@heroui/table";

// 1. Definisikan interface untuk filter produk
export interface ProductFilters {
  search: string;
  status: string;
}

// 2. Sesuaikan fungsi fetch untuk hanya menerima filter
const fetchProducts = async ({
  filters,
}: {
  filters: ProductFilters;
}): Promise<ApiResponse> => {
  const endpoint = "/produk";

  const params: any = {
    search: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === "") delete params[key];
  });

  const { data } = await apiClient.get(endpoint, { params });

  return data;
};

// 3. Struktur ulang hook useProducts
export function useProducts() {
  const [pageSize, setPageSize] = useState(10);

  // Inisialisasi filter
  const initialFilters: ProductFilters = {
    search: "",
    status: "all",
  };

  const [page, setPage] = useState(1);
  const [inputFilters, setInputFilters] =
    useState<ProductFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<ProductFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  // Gunakan useQuery dengan submittedFilters
  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["products", submittedFilters],
    queryFn: () => fetchProducts({ filters: submittedFilters }),
    staleTime: 5 * 60 * 1000, // Cache 5 menit
  });

  // 4. Logika paginasi di sisi klien (tanpa sorting)
  const paginatedData = useMemo(() => {
    const allItems = response?.data || [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return allItems.slice(start, end);
  }, [page, pageSize, response?.data]);

  const totalItems = response?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 5. Handler untuk filter dan aksi
  const handleFilterChange = (field: keyof ProductFilters, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const onSearchSubmit = useCallback(() => {
    setSubmittedFilters(inputFilters);
    setPage(1);
    refetch();
  }, [inputFilters, refetch]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSubmittedFilters(initialFilters);
    setSortDescriptor({ column: "kode", direction: "ascending" });
    setPageSize(10);
    setPage(1);
    refetch();
  }, [refetch]);

  // 6. Siapkan data yang akan dikirim ke komponen
  const dataForComponent = useMemo(
    () => ({
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
    }),
    [paginatedData, totalItems, totalPages, page]
  );

  // 7. Return value yang konsisten
  return {
    data: dataForComponent,
    isLoading,
    isError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
