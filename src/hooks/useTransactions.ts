import { useCallback, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
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

  const [inputValue, setInputValue] = useState("");
  const [inputLimit, setInputLimit] = useState<string>("500");
  const [inputDateRange, setInputDateRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  const [submittedFilterValue, setSubmittedFilterValue] = useState("");
  const [submittedLimit, setSubmittedLimit] = useState<string>("500");
  const [submittedDateRange, setSubmittedDateRange] = useState<
    RangeValue<DateValue>
  >({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_entri",
    direction: "descending",
  });

  const { data, isLoading, isError } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "transactions",
      user?.kode,
      submittedFilterValue,
      statusFilter,
      sortDescriptor,
      submittedDateRange,
      submittedLimit,
    ],
    queryFn: () => {
      const numericLimit = parseInt(submittedLimit, 10);
      const finalLimit =
        isNaN(numericLimit) || numericLimit <= 0 ? 500 : numericLimit;

      return fetchTransactions({
        kode: user!.kode,
        limit: finalLimit,
        filterValue: submittedFilterValue,
        statusFilter,
        sortDescriptor,
        dateRange: submittedDateRange,
      });
    },
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000, // cache 5 menit
  });

  const onSearchSubmit = useCallback(() => {
    setSubmittedFilterValue(inputValue);
    setSubmittedLimit(inputLimit);
    setSubmittedDateRange(inputDateRange);
  }, [inputValue, inputLimit, inputDateRange]);

  const onStatusChange = useCallback(
    (key: React.Key) => setStatusFilter(key as string),
    []
  );

  const resetFilters = useCallback(() => {
    const initialDate = {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    };
    // Reset state input
    setInputValue("");
    setInputLimit("500");
    setInputDateRange(initialDate);
    // Reset state submitted
    setSubmittedFilterValue("");
    setSubmittedLimit("500");
    setSubmittedDateRange(initialDate);
    // Reset filter lainnya
    setStatusFilter("all");
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
  }, []);

  return {
    allFetchedItems: data?.data ?? [],
    isLoading,
    isError,
    inputValue,
    onSearchChange: setInputValue,
    inputLimit,
    onLimitChange: setInputLimit,
    inputDateRange,
    onDateChange: setInputDateRange,
    onSearchSubmit,
    statusFilter,
    onStatusChange,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
