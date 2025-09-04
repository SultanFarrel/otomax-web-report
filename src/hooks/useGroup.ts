import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";

export interface Group {
  kode: string;
  nama: string;
}

const transformTableData = <T = any>(apiData: any): T[] => {
  if (!apiData || !apiData.columns || !apiData.rows) return [];
  const { columns, rows } = apiData;
  return rows.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj as T;
  });
};

const fetchGroups = async (): Promise<Group[]> => {
  const response = await apiClient.get("/mock/adm/group");
  return transformTableData<Group>(response.data.data);
};

export function useGroups() {
  return useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 5,
  });
}
