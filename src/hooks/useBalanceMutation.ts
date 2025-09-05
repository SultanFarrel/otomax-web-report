import { useCallback, useState, useMemo } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutation, BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

export interface BalanceMutationFilters {
  search: string;
  dateRange: RangeValue<DateValue> | null;
  mutationTypes: string[];
  kodeReseller?: string;
}

const mutationTypeMap: Record<string, string[]> = {
  Manual: ["+"],
  Transaksi: ["T"],
  Refund: ["G"],
  Komisi: ["K"],
  "Transfer Saldo": ["1", "2"],
  Tiket: ["B"],
};

// Fungsi untuk mengubah data dari format [columns, rows] ke [objects]
const transformBalanceMutationData = (apiData: any): BalanceMutation[] => {
  if (!apiData || !apiData.columns || !apiData.rows) {
    return [];
  }

  const { columns, rows } = apiData;

  return rows.map((row: any[]) => {
    const mutationObject: { [key: string]: any } = {};
    columns.forEach((colName: string, index: number) => {
      mutationObject[colName] = row[index];
    });
    return mutationObject as BalanceMutation;
  });
};

const fetchBalanceMutation = async ({
  filters,
  sortDescriptor,
}: {
  filters: BalanceMutationFilters;
  sortDescriptor: SortDescriptor;
}): Promise<BalanceMutationApiResponse> => {
  const endpoint = "/mutasi";

  const mutationTypeChars = filters.mutationTypes.includes("Semua")
    ? undefined
    : filters.mutationTypes
        .flatMap((type) => mutationTypeMap[type] || [])
        .join(",");

  const formatDate = (date: DateValue | undefined) => {
    return date ? date.toString().split("T")[0] : undefined;
  };

  const params: any = {
    search: filters.search || undefined,
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
    mutationTypes: mutationTypeChars,
    startDate: formatDate(filters.dateRange?.start),
    endDate: formatDate(filters.dateRange?.end),
    kodeReseller: filters.kodeReseller || undefined,
  };

  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key] === "") && delete params[key]
  );

  const { data } = await apiClient.get(endpoint, { params });

  // Transformasi data sebelum mengembalikannya
  const transformedData = transformBalanceMutationData(data.data);

  return {
    ...data,
    data: transformedData,
  };
};

export function useBalanceMutation({ isAdmin = false } = {}) {
  const initialFilters: BalanceMutationFilters = {
    search: "",
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    },
    mutationTypes: ["Semua"],
    kodeReseller: isAdmin ? "" : undefined,
  };

  const [inputFilters, setInputFilters] =
    useState<BalanceMutationFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<BalanceMutationFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tanggal",
    direction: "descending",
  });

  const { data, isLoading, isError, refetch } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: ["balanceMutation", submittedFilters, sortDescriptor, isAdmin],
    queryFn: () =>
      fetchBalanceMutation({
        filters: submittedFilters,
        sortDescriptor,
      }),
    staleTime: Infinity,
  });

  const mutationSummary = useMemo(() => {
    const allItems = data?.data || [];
    const summary = {
      credit: 0,
      debit: 0,
      total: 0,
    };

    allItems.forEach((mutation) => {
      if (mutation.jumlah > 0) {
        summary.credit += mutation.jumlah;
      } else {
        summary.debit += mutation.jumlah;
      }
    });

    summary.total = summary.credit + summary.debit;

    return summary;
  }, [data?.data]);

  const handleFilterChange = (
    field: keyof BalanceMutationFilters,
    value: any
  ) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const onSearchSubmit = useCallback(() => {
    if (JSON.stringify(inputFilters) === JSON.stringify(submittedFilters)) {
      refetch();
    } else {
      setSubmittedFilters(inputFilters);
    }
  }, [inputFilters, submittedFilters, refetch]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSortDescriptor({ column: "tanggal", direction: "descending" });
    setSubmittedFilters(initialFilters);
  }, [initialFilters]);

  return {
    allFetchedItems: data?.data ?? [],
    totalItems: data?.rowCount ?? 0,
    mutationSummary,
    isLoading,
    isError,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
