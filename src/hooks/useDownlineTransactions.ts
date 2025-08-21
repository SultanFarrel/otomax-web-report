// src/hooks/useDownlineTransactions.ts

import { useCallback, useMemo, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { Transaction, TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

// Definisikan tipe untuk semua filter
export interface DownlineTransactionFilters {
  trxId: string;
  refId: string;
  kodeProduk: string;
  tujuan: string;
  sn: string;
  kodeReseller: string;
  status: string;
  dateRange: RangeValue<DateValue> | null;
}

const fetchDownlineTransactions = async ({
  uplineKode,
  filters,
  sortDescriptor,
}: {
  uplineKode: string;
  filters: DownlineTransactionFilters;
  sortDescriptor: SortDescriptor;
}): Promise<TransactionApiResponse> => {
  const endpoint = `/transaksi/upline/${uplineKode}`;

  const params: any = {
    trxId: filters.trxId || undefined,
    refId: filters.refId || undefined,
    kodeProduk: filters.kodeProduk || undefined,
    tujuan: filters.tujuan || undefined,
    sn: filters.sn || undefined,
    kodeReseller: filters.kodeReseller || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    startDate: filters.dateRange?.start?.toString(),
    endDate: filters.dateRange?.end?.toString(),
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === "") delete params[key];
  });

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

export function useDownlineTransactions() {
  const user = useUserStore((state) => state.user);
  const [pageSize, setPageSize] = useState(30);

  const initialFilters: DownlineTransactionFilters = {
    trxId: "",
    refId: "",
    kodeProduk: "",
    tujuan: "",
    sn: "",
    kodeReseller: "",
    status: "all",
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    },
  };

  const [page, setPage] = useState(1);
  const [inputFilters, setInputFilters] =
    useState<DownlineTransactionFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<DownlineTransactionFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_entri",
    direction: "descending",
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "downlineTransactions",
      user?.kode,
      submittedFilters,
      sortDescriptor,
    ],
    queryFn: () =>
      fetchDownlineTransactions({
        uplineKode: user!.kode,
        filters: submittedFilters,
        sortDescriptor,
      }),
    enabled: !!user?.kode,
    staleTime: 5 * 60 * 1000,
  });

  const transactionSummary = useMemo(() => {
    const allItems = response?.data || [];
    const summary = {
      success: { amount: 0, count: 0 },
      pending: { amount: 0, count: 0 },
      failed: { amount: 0, count: 0 },
    };

    allItems.forEach((trx: Transaction) => {
      if (trx.status === 20) {
        summary.success.amount += trx.harga;
        summary.success.count++;
      } else if (trx.status === 1 || trx.status === 2) {
        summary.pending.amount += trx.harga;
        summary.pending.count++;
      } else {
        summary.failed.amount += trx.harga;
        summary.failed.count++;
      }
    });

    return summary;
  }, [response?.data]);

  const paginatedData = useMemo(() => {
    const allItems = response?.data || [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return allItems.slice(start, end);
  }, [page, pageSize, response?.data]);

  const totalItems = response?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (
    field: keyof DownlineTransactionFilters,
    value: any
  ) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const onSearchSubmit = useCallback(() => {
    setSubmittedFilters(inputFilters);
    setPage(1);
  }, [inputFilters]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSubmittedFilters(initialFilters);
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
    setPageSize(30);
    setPage(1);
  }, []);

  const dataForComponent = useMemo(
    () => ({
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
    }),
    [paginatedData, totalItems, totalPages, page]
  );

  return {
    data: dataForComponent,
    transactionSummary,
    isLoading,
    isError,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    inputFilters,
    handleFilterChange,
    onSearchSubmit,
    resetFilters,
    sortDescriptor,
    setSortDescriptor,
  };
}
