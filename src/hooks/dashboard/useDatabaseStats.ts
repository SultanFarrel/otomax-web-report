import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { DatabaseStats } from "@/types";
import { useAdminUserStore } from "@/store/adminUserStore";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  try {
    const { data } = await apiClient.get("/database/stats");

    if (data && typeof data === "object" && data !== null) {
      return data;
    }

    throw new Error("Format respons API tidak valid.");
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(
      err instanceof Error ? err.message : "Gagal mengambil informasi database."
    );
  }
};

export function useDatabaseStats() {
  const adminUser = useAdminUserStore((state) => state.adminUser);

  return useQuery<DatabaseStats, Error>({
    queryKey: ["databaseStats", adminUser?.kode],
    queryFn: fetchDatabaseStats,
    // Aktifkan hanya jika admin sudah login
    enabled: !!adminUser?.kode,
    staleTime: Infinity,
  });
}
