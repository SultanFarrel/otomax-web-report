// Berkas: sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/hooks/useBalanceMutation.ts

import { useCallback, useState, useMemo } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
// Hapus useUserStore karena tidak lagi dibutuhkan
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

export interface BalanceMutationFilters {
  search: string;
  dateRange: RangeValue<DateValue> | null;
  mutationTypes: string[];
}

// 1. Sesuaikan mutationTypeMap dengan kode baru
const mutationTypeMap: Record<string, string[]> = {
  Manual: [" "],
  Transaksi: ["T"],
  Refund: ["G"],
  Komisi: ["K"],
  "Transfer Saldo": ["1", "2"],
  Tiket: ["B"],
};

const fetchBalanceMutation = async ({
  filters,
  sortDescriptor,
}: {
  filters: BalanceMutationFilters;
  sortDescriptor: SortDescriptor;
}): Promise<BalanceMutationApiResponse> => {
  // 2. Ganti endpoint
  const endpoint = "/mutasi";

  const mutationTypeChars = filters.mutationTypes.includes("Semua")
    ? undefined // Jangan kirim parameter jika "Semua" dipilih
    : filters.mutationTypes
        .flatMap((type) => mutationTypeMap[type] || [])
        .join(",");

  // Fungsi untuk memformat tanggal ke YYYY-MM-DD
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
  };

  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key] === "") && delete params[key]
  );

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

export function useBalanceMutation() {
  const initialFilters: BalanceMutationFilters = {
    search: "",
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    },
    mutationTypes: ["Semua"],
  };

  const [inputFilters, setInputFilters] =
    useState<BalanceMutationFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<BalanceMutationFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tanggal",
    direction: "descending",
  });

  // 3. Hapus user.kode dari queryKey
  const { data, isLoading, isError, refetch } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: ["balanceMutation", submittedFilters, sortDescriptor],
    queryFn: () =>
      fetchBalanceMutation({
        filters: submittedFilters,
        sortDescriptor,
      }),
    staleTime: 0,
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
    setSubmittedFilters(initialFilters); // Pastikan filter yang dikirim juga direset
  }, [initialFilters]);

  // 4. Gunakan data.rowCount untuk total, bukan data.data.length
  return {
    allFetchedItems: data?.data ?? [],
    totalItems: data?.rowCount ?? 0, // Tambahkan ini untuk paginasi
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
