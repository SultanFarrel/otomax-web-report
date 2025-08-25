// sultanfarrel/otomax-web-report/otomax-web-report-new-api/src/hooks/useTransactions.ts
import { useCallback, useMemo, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { useUserStore } from "@/store/userStore";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

export interface TransactionFilters {
  trxId: string;
  refId: string;
  kodeProduk: string;
  tujuan: string;
  sn: string;
  status: string;
  dateRange: RangeValue<DateValue> | null;
}

const fetchTransactions = async ({
  kode,
  filters,
  sortDescriptor,
}: {
  kode: string;
  filters: TransactionFilters;
  sortDescriptor: SortDescriptor;
}): Promise<TransactionApiResponse> => {
  const endpoint = `/transaksi/reseller/${kode}`;

  const params: any = {
    trxId: filters.trxId || undefined,
    refId: filters.refId || undefined,
    kodeProduk: filters.kodeProduk || undefined,
    tujuan: filters.tujuan || undefined,
    sn: filters.sn || undefined,
    startDate: filters.dateRange?.start?.toString(),
    endDate: filters.dateRange?.end?.toString(),
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
  };

  // --- LOGIKA BARU UNTUK FILTER STATUS ---
  if (filters.status && filters.status !== "all") {
    if (filters.status === "2") {
      // "2" adalah UID untuk "Menunggu Jawaban"
      params.status_lt = 20; // Mengirim parameter kustom `status_lt`
    } else {
      params.status = filters.status;
    }
  }
  // -----------------------------------------

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === "") delete params[key];
  });

  const { data } = await apiClient.get(endpoint, { params });
  return data;
};

export function useTransactions() {
  const user = useUserStore((state) => state.user);
  const [pageSize, setPageSize] = useState(30);

  const initialFilters: TransactionFilters = {
    trxId: "",
    refId: "",
    kodeProduk: "",
    tujuan: "",
    sn: "",
    status: "all",
    dateRange: {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()),
    },
  };

  const [page, setPage] = useState(1);
  const [inputFilters, setInputFilters] =
    useState<TransactionFilters>(initialFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<TransactionFilters>(initialFilters);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "tgl_entri",
    direction: "descending",
  });

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery<TransactionApiResponse, Error>({
    queryKey: ["transactions", user?.kode, submittedFilters, sortDescriptor],
    queryFn: () =>
      fetchTransactions({
        kode: user!.kode,
        filters: submittedFilters,
        sortDescriptor,
      }),
    enabled: !!user?.kode,
    staleTime: 0, // Tanpa cache
  });

  // --- LOGIKA BARU UNTUK MENGHITUNG TOTAL ---
  const transactionSummary = useMemo(() => {
    const allItems = response?.data || [];
    const summary = {
      success: { amount: 0, count: 0 },
      pending: { amount: 0, count: 0 },
      failed: { amount: 0, count: 0 },
    };

    allItems.forEach((trx) => {
      if (trx.status === 20) {
        // Sukses
        summary.success.amount += trx.harga;
        summary.success.count++;
      } else if (trx.status < 20) {
        // Diubah untuk mencakup semua status di bawah 20
        // Pending
        summary.pending.amount += trx.harga;
        summary.pending.count++;
      } else {
        // Gagal
        summary.failed.amount += trx.harga;
        summary.failed.count++;
      }
    });

    return summary;
  }, [response?.data]);

  // LOGIKA PAGINASI DI SISI KLIEN
  const paginatedData = useMemo(() => {
    const allItems = response?.data || [];
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return allItems.slice(start, end);
  }, [page, pageSize, response?.data]);

  const totalItems = response?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleFilterChange = (field: keyof TransactionFilters, value: any) => {
    setInputFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const onSearchSubmit = useCallback(() => {
    setSubmittedFilters(inputFilters);
    setPage(1);
    refetch();
  }, [inputFilters]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSubmittedFilters(initialFilters);
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
    setPageSize(30);
    setPage(1);
    refetch();
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
