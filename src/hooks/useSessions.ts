import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { Session, SessionApiResponse } from "@/types";

// Fungsi untuk mengubah data dari format [columns, rows] ke [objects]
const transformSessionData = (apiData: any): Session[] => {
  if (!apiData || !apiData.columns || !apiData.rows) {
    return [];
  }

  const { columns, rows } = apiData;

  return rows.map((row: any[]) => {
    const sessionObject: { [key: string]: any } = {};
    columns.forEach((colName: string, index: number) => {
      sessionObject[colName] = row[index];
    });
    return sessionObject as Session;
  });
};

// Fungsi untuk mengambil daftar sesi
const fetchSessions = async (
  endpoint: string,
  filters: { search?: string }
): Promise<SessionApiResponse> => {
  const params = {
    search: filters.search || undefined,
  };

  const { data } = await apiClient.get(endpoint, { params });
  const transformedData = transformSessionData(data.data);
  return { ...data, data: transformedData };
};

// Fungsi untuk menghentikan sesi
const killSession = async (kode: number): Promise<any> => {
  const { data } = await apiClient.post(`/session/kill?kode=${kode}`);
  return data;
};

export function useSessions({ sessionType = "user" } = {}) {
  const queryClient = useQueryClient();
  const endpoint = sessionType === "admin" ? "/session/admin" : "/session";

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  // Query untuk mengambil data sesi
  const { data, isLoading, isError, refetch, isFetching } = useQuery<
    SessionApiResponse,
    Error
  >({
    queryKey: ["sessions", endpoint, submittedSearch],
    queryFn: () => fetchSessions(endpoint, { search: submittedSearch }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const onSearchSubmit = useCallback(() => {
    setSubmittedSearch(search);
    refetch();
  }, [search, refetch]);

  // Mutation untuk menghentikan sesi
  const mutation = useMutation({
    mutationFn: killSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const sessionsData = Array.isArray(data?.data) ? data.data : [];

  return {
    sessions: sessionsData,
    isLoading,
    isError,
    killSession: mutation.mutate,
    isKilling: mutation.isPending,
    refetchSessions: refetch,
    isRefetching: isFetching,
    search,
    setSearch,
    onSearchSubmit,
  };
}
