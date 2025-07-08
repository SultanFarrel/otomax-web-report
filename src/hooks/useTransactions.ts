import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TransactionApiResponse, Transaction } from "@/types"; // Import Transaction
import { mockTransactions } from "@/mocks/transactions";
import { DateValue, RangeValue } from "@react-types/shared"; // Import tipe ini

// --- Mock Fetching Function ---
const fetchTransactions = async (
  page: number,
  filterValue: string,
  statusFilter: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<TransactionApiResponse> => {
  console.log(
    `Fetching page: ${page}, status: ${statusFilter}, dates: ${startDate}-${endDate}`
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  let allData: Transaction[] = Object.values(mockTransactions).flat();

  // 1. Filter by status
  if (statusFilter !== "all") {
    allData = allData.filter((trx) => trx.status.toString() === statusFilter);
  }

  // 2. Filter by search value (tujuan)
  if (filterValue) {
    allData = allData.filter((trx) => trx.tujuan.includes(filterValue));
  }

  // 3. Filter by date range
  if (startDate && endDate) {
    // Set endDate to the end of the day for inclusive filtering
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    allData = allData.filter((trx) => {
      const trxDate = new Date(trx.tgl_entri);
      return trxDate >= startDate && trxDate <= endOfDay;
    });
  }

  const paginatedData = allData.slice((page - 1) * 10, page * 10);

  return {
    totalItems: allData.length,
    totalPages: Math.ceil(allData.length / 10),
    currentPage: page,
    data: paginatedData,
  };
};

// --- Custom Hook untuk Debounce ---
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// --- Custom Hook useTransactions ---
export function useTransactions() {
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  const debouncedFilterValue = useDebounce(filterValue, 500);

  const { data, isLoading, isError } = useQuery<TransactionApiResponse, Error>({
    queryKey: [
      "transactions",
      page,
      debouncedFilterValue,
      statusFilter,
      dateRange,
    ],
    queryFn: () =>
      fetchTransactions(
        page,
        debouncedFilterValue,
        statusFilter,
        dateRange ? dateRange.start.toDate("UTC") : null,
        dateRange ? dateRange.end.toDate("UTC") : null
      ),
    placeholderData: (previousData) => previousData,
  });

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const onStatusChange = React.useCallback((key: React.Key) => {
    setStatusFilter(key as string);
    setPage(1);
  }, []);

  const onDateChange = React.useCallback((range: RangeValue<DateValue>) => {
    setDateRange(range);
    setPage(1);
  }, []);

  // --- FUNGSI BARU UNTUK RESET FILTER ---
  const resetFilters = React.useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setDateRange(null);
    setPage(1);
  }, []);

  return {
    data,
    isLoading,
    isError,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    dateRange,
    onDateChange,
    resetFilters, // <-- Ekspor fungsi baru
  };
}
