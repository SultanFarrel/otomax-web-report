import { useCallback, useMemo, useState } from "react";
import { RangeValue } from "@react-types/shared";
import { useQuery } from "@tanstack/react-query";
import { Transaction, TransactionApiResponse } from "@/types";
import { apiClient } from "@/api/axios";
import { DateValue } from "@heroui/calendar";
import { SortDescriptor } from "@heroui/table";
import { today, getLocalTimeZone } from "@internationalized/date";

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

// Fungsi untuk mengubah data dari format [columns, rows] ke [objects]
const transformTransactionData = (apiData: any): Transaction[] => {
  if (!apiData || !apiData.columns || !apiData.rows) {
    return [];
  }

  const { columns, rows } = apiData;

  return rows.map((row: any[]) => {
    const transactionObject: { [key: string]: any } = {};
    columns.forEach((colName: string, index: number) => {
      transactionObject[colName] = row[index];
    });
    return transactionObject as Transaction;
  });
};

const fetchDownlineTransactions = async ({
  filters,
  sortDescriptor,
}: {
  filters: DownlineTransactionFilters;
  sortDescriptor: SortDescriptor;
}): Promise<TransactionApiResponse> => {
  const endpoint = "/transaksi/downline";

  const formatDate = (date: DateValue | undefined) => {
    return date ? date.toString().split("T")[0] : undefined;
  };

  const params: any = {
    trxId: filters.trxId || undefined,
    refId: filters.refId || undefined,
    kodeProduk: filters.kodeProduk || undefined,
    tujuan: filters.tujuan || undefined,
    sn: filters.sn || undefined,
    kodeReseller: filters.kodeReseller || undefined,
    startDate: formatDate(filters.dateRange?.start),
    endDate: formatDate(filters.dateRange?.end),
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
  };

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key] === "") && delete params[key]
  );

  const { data } = await apiClient.get(endpoint, { params });

  // Transformasi data sebelum mengembalikannya
  const transformedData = transformTransactionData(data.data);

  return {
    ...data,
    data: transformedData,
  };
};

export function useDownlineTransactions() {
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
    refetch,
    isLoading,
    isError,
  } = useQuery<TransactionApiResponse, Error>({
    queryKey: ["downlineTransactions", submittedFilters, sortDescriptor],
    queryFn: () =>
      fetchDownlineTransactions({
        filters: submittedFilters,
        sortDescriptor,
      }),
    staleTime: Infinity,
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
      } else if (trx.status < 20) {
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

  const totalItems = response?.rowCount || 0;
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
    setPage(1);
    if (JSON.stringify(inputFilters) === JSON.stringify(submittedFilters)) {
      refetch();
    } else {
      setSubmittedFilters(inputFilters);
    }
  }, [inputFilters, submittedFilters, refetch]);

  const resetFilters = useCallback(() => {
    setInputFilters(initialFilters);
    setSortDescriptor({ column: "tgl_entri", direction: "descending" });
    setPageSize(30);
    setSubmittedFilters(initialFilters);
  }, [initialFilters]);

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
    allData: response?.data ?? [],
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
