import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { DownlineApiResponse } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { SortDescriptor } from "@heroui/table";

const fetchDownlines = async (
  uplineKode: string,
  page: number,
  search: string,
  status: string,
  sortDescriptor: SortDescriptor
): Promise<DownlineApiResponse> => {
  const params: any = {
    page,
    pageSize: 10,
    search: search || undefined,
    status: status !== "all" ? status : undefined,
    sortBy: sortDescriptor.column as string,
    sortDirection: sortDescriptor.direction,
  };

  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`, {
    params,
  });
  return data;
};

export function useDownlines() {
  const user = useUserStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "kode",
    direction: "ascending",
  });

  const debouncedFilterValue = useDebounce(filterValue, 500);

  const query = useQuery<DownlineApiResponse, Error>({
    queryKey: [
      "downlines",
      user?.kode,
      page,
      debouncedFilterValue,
      statusFilter,
      sortDescriptor,
    ],
    queryFn: () =>
      fetchDownlines(
        user!.kode,
        page,
        debouncedFilterValue,
        statusFilter,
        sortDescriptor
      ),
    enabled: !!user?.kode,
    placeholderData: (previousData) => previousData,
  });

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

  const onStatusChange = useCallback((key: React.Key) => {
    setStatusFilter(key as string);
    setPage(1);
  }, []);

  return {
    ...query,
    page,
    setPage,
    filterValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortDescriptor,
    setSortDescriptor,
  };
}
