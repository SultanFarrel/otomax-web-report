import { useCallback, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

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
    limit,
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

export function useTransactions() {
  const user = useUserStore((state) => state.user);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [limit, setLimit] = useState<string>("500");

  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_entri",
    direction: "descending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const debouncedLimit = useDebounce(limit, 800);

  const { data, isLoading, isError } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "transactions",
      user?.kode,
      debouncedFilterValue,
      statusFilter,
      sortDescriptor,
      dateRange,
      debouncedLimit,
    ],
    queryFn: () => {
      const numericLimit = parseInt(limit, 10);
      const finalLimit =
        isNaN(numericLimit) || numericLimit <= 0 ? 500 : numericLimit;

      return fetchTransactions({
        kode: user!.kode,
        limit: finalLimit,
        filterValue: debouncedFilterValue,
        statusFilter,
        sortDescriptor,
        dateRange,
      });
    },
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // 5 menit
  });

  const onLimitChange = useCallback((newLimit: string) => {
    setLimit(newLimit);
  }, []);

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
    setDateRange({
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    });
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
    setLimit("500");
  }, []);

  return {
    allFetchedItems: data?.data ?? [],
    isLoading,
    isError,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    limit,
    onLimitChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
