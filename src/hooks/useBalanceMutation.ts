import { useCallback, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@/hooks/useDebounce";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";

// Fungsi fetch hanya butuh limit, bukan offset/pageParam
const fetchBalanceMutation = async ({
  kode,
  limit,
  filterValue,
  sortDescriptor,
  dateRange,
}: {
  kode: string;
  limit: number;
  filterValue: string;
  sortDescriptor: SortDescriptor;
  dateRange: RangeValue<DateValue> | null;
}): Promise<BalanceMutationApiResponse> => {
  const endpoint = `/mutasi/reseller/${kode}`;

  const params: any = {
    limit,
    search: filterValue || undefined,
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

// Hook disederhanakan kembali ke useQuery
export function useBalanceMutation() {
  const user = useUserStore((state) => state.user);
  const [filterValue, setFilterValue] = useState("");
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "descending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);
  const limit = 500;

  const { data, isLoading, isError } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: [
      "balanceMutation",
      user?.kode,
      debouncedFilterValue,
      sortDescriptor,
      dateRange,
    ],
    queryFn: () =>
      fetchBalanceMutation({
        kode: user!.kode,
        limit,
        filterValue: debouncedFilterValue,
        sortDescriptor,
        dateRange,
      }),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // 5 menit
  });

  const onSearchChange = useCallback(
    (value?: string) => setFilterValue(value || ""),
    []
  );
  const onDateChange = useCallback(
    (range: RangeValue<DateValue>) => setDateRange(range),
    []
  );
  const resetFilters = useCallback(() => {
    setFilterValue("");
    setDateRange(null);
    setSortDescriptor({ column: "kode", direction: "descending" });
  }, []);

  return {
    allFetchedItems: data?.data ?? [],
    isLoading,
    isError,
    filterValue,
    onSearchChange,
    dateRange,
    onDateChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
