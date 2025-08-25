import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Product } from "@/types";
import { apiClient } from "@/api/axios";
import { SortDescriptor } from "@heroui/table";

export interface ProductFilters {
  search: string;
  status: string;
}

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

export function useProducts() {
  const [pageSize, setPageSize] = useState(10);

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

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["products", submittedFilters],
    queryFn: () => fetchProducts({ filters: submittedFilters }),
    staleTime: 0, // Tanpa cache
  });

  // Logika sorting di sisi klien
  const sortedData = useMemo(() => {
    const data = response?.data || [];
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Product];
      const second = b[sortDescriptor.column as keyof Product];
      let cmp = 0;

      if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      }

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
  }, [response?.data, sortDescriptor]);

  // Logika paginasi di sisi klien
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return sortedData.slice(start, end);
  }, [page, pageSize, sortedData]);

  const totalItems = response?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

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

  const dataForComponent = useMemo(
    () => ({
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
    }),
    [paginatedData, totalItems, totalPages, page]
  );

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
