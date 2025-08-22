import { useCallback, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

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

export function useBalanceMutation() {
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

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "descending",
  });

  const { data, isLoading, isError } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: [
      "balanceMutation",
      user?.kode,
      submittedFilterValue,
      sortDescriptor,
      submittedDateRange,
      submittedLimit,
    ],
    queryFn: () => {
      const numericLimit = parseInt(submittedLimit, 10);
      const finalLimit =
        isNaN(numericLimit) || numericLimit <= 0 ? 500 : numericLimit;

      return fetchBalanceMutation({
        kode: user!.kode,
        limit: finalLimit,
        filterValue: submittedFilterValue,
        sortDescriptor,
        dateRange: submittedDateRange,
      });
    },
    enabled: !!user?.kode,
    staleTime: Infinity, // Tanpa cache
  });

  const onSearchSubmit = useCallback(() => {
    setSubmittedFilterValue(inputValue);
    setSubmittedLimit(inputLimit);
    setSubmittedDateRange(inputDateRange);
  }, [inputValue, inputLimit, inputDateRange]);

  const resetFilters = useCallback(() => {
    const initialDate = {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    };
    setInputValue("");
    setInputLimit("500");
    setInputDateRange(initialDate);
    setSubmittedFilterValue("");
    setSubmittedLimit("500");
    setSubmittedDateRange(initialDate);
    setSortDescriptor({ column: "kode", direction: "descending" });
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
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
