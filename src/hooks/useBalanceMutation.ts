// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/hooks/useBalanceMutation.ts

import { useCallback, useState, useMemo } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { BalanceMutationApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

export interface BalanceMutationFilters {
  search: string;
  dateRange: RangeValue<DateValue> | null;
  mutationTypes: string[];
}

const mutationTypeMap: Record<string, string[]> = {
  Manual: [" "],
  Transaksi: ["T"],
  Refund: ["G"],
  Komisi: ["K"],
  "Transfer Saldo": ["1", "2"],
  Tiket: ["B"],
};

const fetchBalanceMutation = async ({
  kode,
  filters,
  sortDescriptor,
}: {
  kode: string;
  filters: BalanceMutationFilters;
  sortDescriptor: SortDescriptor;
}): Promise<BalanceMutationApiResponse> => {
  const endpoint = `/mutasi/reseller/${kode}`;

  // Flatten the mutation types from the map
  const mutationTypeChars = filters.mutationTypes
    .flatMap((type) => mutationTypeMap[type] || [])
    .join(",");

  const params: any = {
    search: filters.search || undefined,
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
    mutationTypes: mutationTypeChars,
  };

  // --- LOGIKA BARU UNTUK PENANGANAN ZONA WAKTU ---
  if (filters.dateRange?.start && filters.dateRange?.end) {
    const startDate = filters.dateRange.start.toDate(getLocalTimeZone());
    startDate.setHours(0, 0, 0, 0);
    params.startDate = startDate.toISOString();

    const endDate = filters.dateRange.end.toDate(getLocalTimeZone());
    endDate.setHours(23, 59, 59, 999);
    params.endDate = endDate.toISOString();
  }
  // ---------------------------------------------

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === "") delete params[key];
  });

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

export function useBalanceMutation() {
  const user = useUserStore((state) => state.user);

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

  const { data, isLoading, isError, refetch } = useQuery<
    BalanceMutationApiResponse,
    Error
  >({
    queryKey: ["balanceMutation", user?.kode, submittedFilters, sortDescriptor],
    queryFn: () =>
      fetchBalanceMutation({
        kode: user!.kode,
        filters: submittedFilters,
        sortDescriptor,
      }),
    enabled: !!user?.kode,
    staleTime: 0, // Tanpa cache
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
    // Cek apakah filter telah berubah.
    if (JSON.stringify(inputFilters) === JSON.stringify(submittedFilters)) {
      // Jika tidak ada perubahan, panggil refetch() secara manual.
      refetch();
    } else {
      // Jika ada perubahan, perbarui state, yang akan memicu refetch otomatis.
      setSubmittedFilters(inputFilters);
    }
  }, [inputFilters, submittedFilters, refetch]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSortDescriptor({ column: "tanggal", direction: "descending" });
  }, [initialFilters]);

  return {
    allFetchedItems: data?.data ?? [],
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
