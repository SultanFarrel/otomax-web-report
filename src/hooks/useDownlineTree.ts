import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { DownlineTree } from "@/types";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

const fetchDownlineTree = async (): Promise<DownlineTree> => {
  try {
    const { data } = await apiClient.get("/agen/downline_tree");
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Gagal mengambil data pohon downline.");
  }
};

export function useDownlineTree() {
  return useQuery<DownlineTree, Error>({
    queryKey: ["downlineTree"],
    queryFn: fetchDownlineTree,
    staleTime: Infinity,
  });
}
