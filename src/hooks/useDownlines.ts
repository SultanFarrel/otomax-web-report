import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { DownlineApiResponse } from "@/types";

// Fungsi helper untuk debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Fungsi untuk mengambil data downline dari API
const fetchDownlines = async (
  uplineKode: string,
  page: number,
  search: string
): Promise<DownlineApiResponse> => {
  const params = {
    page,
    pageSize: 10,
    search: search || undefined,
  };

  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`, {
    params,
  });
  return data;
};

// Hook kustom untuk halaman downline
export function useDownlines() {
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // State untuk filter status
  const debouncedFilterValue = useDebounce(filterValue, 500);

  // Gabungkan filter: jika status dipilih, gunakan itu. Jika tidak, gunakan pencarian teks.
  const finalSearchTerm =
    statusFilter !== "all" ? statusFilter : debouncedFilterValue;

  const query = useQuery<DownlineApiResponse, Error>({
    // queryKey sekarang menyertakan kedua filter
    queryKey: ["downlines", user?.kode, page, finalSearchTerm],
    queryFn: () => fetchDownlines(user!.kode, page, finalSearchTerm),
    enabled: !!user?.kode,
    placeholderData: (previousData) => previousData,
  });

  const onSearchChange = (value?: string) => {
    setFilterValue(value || "");
    setStatusFilter("all"); // Reset filter status saat mengetik
    setPage(1);
  };

  const onStatusChange = (key: React.Key) => {
    setStatusFilter(key as string);
    setFilterValue(""); // Reset pencarian teks saat memilih status
    setPage(1);
  };

  return {
    ...query,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
  };
}
