import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { Downline, DownlineApiResponse } from "@/types";
import { SortDescriptor } from "@heroui/table";

export interface DownlineFilters {
  search: string;
  status: string;
}

const fetchDownlines = async (
  filters: DownlineFilters
): Promise<DownlineApiResponse> => {
  const endpoint = "/reseller/downline";

  const params: any = {
    search: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

export function useDownlines() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const initialFilters: DownlineFilters = {
    search: "",
    status: "all",
  };

  const [inputFilters, setInputFilters] =
    useState<DownlineFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<DownlineFilters>(initialFilters);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery<DownlineApiResponse, Error>({
    queryKey: ["downlines", submittedFilters],
    queryFn: () => fetchDownlines(submittedFilters),
    staleTime: Infinity,
  });

  // Logika sorting di sisi klien
  const sortedData = useMemo(() => {
    const data = response?.data || [];
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Downline];
      const second = b[sortDescriptor.column as keyof Downline];

      if (first == null || second == null) return 0;

      let cmp =
        (String(first).toLowerCase() || first) <
        (String(second).toLowerCase() || second)
          ? -1
          : 1;

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

  // Gunakan rowCount dari API untuk total item dan paginasi
  const totalItems = response?.rowCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (field: keyof DownlineFilters, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const onSearchSubmit = useCallback(() => {
    setPage(1);
    if (JSON.stringify(inputFilters) === JSON.stringify(submittedFilters)) {
      refetch();
    } else {
      setSubmittedFilters(inputFilters);
    }
  }, [inputFilters, submittedFilters, refetch]);

  const onResetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSubmittedFilters(initialFilters);
  }, [initialFilters]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return {
    data: {
      data: paginatedData,
      totalPages,
      totalItems,
    },
    isLoading,
    isError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    onResetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
