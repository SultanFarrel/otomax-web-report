import { useCallback, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query"; // Kembali ke useQuery
import { TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";

// Fungsi fetch tetap sama, tapi tidak lagi butuh pageParam/offset
const fetchTransactions = async ({
  kode,
  limit,
  filterValue,
  statusFilter,
  sortDescriptor,
  dateRange,
}: {
  kode: string;
  limit: number;
  filterValue: string;
  statusFilter: string;
  sortDescriptor: SortDescriptor;
  dateRange: RangeValue<DateValue> | null;
}): Promise<TransactionApiResponse> => {
  const endpoint = `/transaksi/reseller/${kode}`;

  const params: any = {
    limit, // Hanya butuh limit
    search: filterValue || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    startDate: dateRange?.start?.toString(),
    endDate: dateRange?.end?.toString(),
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === "") delete params[key];
  });

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

// Hook disederhanakan
export function useTransactions() {
  const user = useUserStore((state) => state.user);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_entri",
    direction: "descending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const limit = 500;

  // Gunakan useQuery biasa untuk fetch sekali
  const { data, isLoading, isError } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "transactions",
      user?.kode,
      debouncedFilterValue,
      statusFilter,
      sortDescriptor,
      dateRange,
    ],
    queryFn: () =>
      fetchTransactions({
        kode: user!.kode,
        limit,
        filterValue: debouncedFilterValue,
        statusFilter,
        sortDescriptor,
        dateRange,
      }),
    enabled: !!user?.kode,
    // (Opsional) Tambahkan staleTime agar tidak re-fetch terlalu sering
    staleTime: 5 * 60 * 1000, // 5 menit
  });

  const onSearchChange = useCallback(
    (value?: string) => setFilterValue(value || ""),
    []
  );
  const onStatusChange = useCallback(
    (key: React.Key) => setStatusFilter(key as string),
    []
  );
  const onDateChange = useCallback(
    (range: RangeValue<DateValue>) => setDateRange(range),
    []
  );
  const resetFilters = useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setDateRange(null);
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
  }, []);

  return {
    // Kembalikan semua data yang sudah di-fetch
    allFetchedItems: data?.data ?? [],
    isLoading,
    isError,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
