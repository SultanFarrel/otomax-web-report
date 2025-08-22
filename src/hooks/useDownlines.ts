// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/hooks/useDownlines.ts
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { Downline, DownlineApiResponse } from "@/types";
import { SortDescriptor } from "@heroui/table";

// 1. Definisikan interface untuk filter
export interface DownlineFilters {
  search: string;
  status: string;
}

const fetchDownlines = async (
  uplineKode: string,
  filters: DownlineFilters
): Promise<DownlineApiResponse> => {
  const params: any = {
    search: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
  };

  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`, {
    params,
  });
  return data;
};

export function useDownlines() {
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 2. Pisahkan state untuk input dan filter yang dikirim
  const initialFilters: DownlineFilters = { search: "", status: "all" };
  const [inputFilters, setInputFilters] =
    useState<DownlineFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<DownlineFilters>(initialFilters);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  // 3. Query sekarang bergantung pada submittedFilters
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery<DownlineApiResponse, Error>({
    queryKey: ["downlines", user?.kode, submittedFilters],
    queryFn: () => fetchDownlines(user!.kode, submittedFilters),
    enabled: !!user?.kode,
  });

  // Logika sorting tetap di client-side
  const sortedData = useMemo(() => {
    const data = response?.data || [];
    if (!sortDescriptor.column) return data;

    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Downline];
      const second = b[sortDescriptor.column as keyof Downline];

      if (first == null || second == null) return 0;

      let cmp =
        (parseInt(first as string) || first) <
        (parseInt(second as string) || second)
          ? -1
          : 1;

      if (sortDescriptor.direction === "descending") {
        cmp *= -1;
      }
      return cmp;
    });
  }, [response?.data, sortDescriptor]);

  // Logika paginasi tetap di client-side
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [page, pageSize, sortedData]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // 4. Handler untuk mengubah input filter
  const handleFilterChange = (field: keyof DownlineFilters, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  // 5. Handler untuk submit pencarian
  const onSearchSubmit = useCallback(() => {
    setSubmittedFilters(inputFilters);
    setPage(1);
    refetch();
  }, [inputFilters, refetch]);

  const onResetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSubmittedFilters(initialFilters);
    setPage(1);
    refetch();
  }, [refetch]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return {
    data: {
      data: paginatedData,
      totalPages,
      totalItems: sortedData.length,
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
