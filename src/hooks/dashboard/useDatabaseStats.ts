import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { DatabaseStats, TableCount } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

const transformTableCountData = (apiData: any): TableCount[] => {
  if (!apiData || !apiData.columns || !apiData.rows) {
    return [];
  }

  const { columns, rows } = apiData;

  return rows.map((row: any[]) => {
    const tableCountObject: { [key: string]: any } = {};
    columns.forEach((colName: string, index: number) => {
      tableCountObject[colName] = row[index];
    });
    return tableCountObject as TableCount;
  });
};

const fetchDatabaseStats = async (): Promise<DatabaseStats> => {
  try {
    const { data } = await apiClient.get("/database/stats");

    if (data && typeof data === "object" && data.data) {
      const transformedTableCounts = transformTableCountData(data.data);
      return {
        dbSizeMB: data.dbSizeMB,
        tableCounts: transformedTableCounts,
      };
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
  return useQuery<DatabaseStats, Error>({
    queryKey: ["databaseStats"],
    queryFn: fetchDatabaseStats,
    staleTime: Infinity,
  });
}
