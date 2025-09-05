// src/hooks/dashboard/useDatabaseStats.ts

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { DatabaseStats } from "@/types";
import { useAdminUserStore } from "@/store/adminUserStore";

const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  // Interceptor akan menambahkan /adm secara otomatis
  const { data } = await apiClient.get("/database/stats");
  return data;
};

export function useDatabaseStats() {
  const adminUser = useAdminUserStore((state) => state.adminUser);

  return useQuery<DatabaseStats, Error>({
    queryKey: ["databaseStats", adminUser?.kode],
    queryFn: fetchDatabaseStats,
    // Aktifkan hanya jika admin sudah login
    enabled: !!adminUser?.kode,
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });
}
