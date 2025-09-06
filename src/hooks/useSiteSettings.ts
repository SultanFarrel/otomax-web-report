import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { SiteInfo } from "@/types";

const fetchSiteSettings = async (): Promise<SiteInfo> => {
  const { data } = await apiClient.get("/webreport/me");
  return data;
};

const updateSiteSettings = async (settings: FormData): Promise<SiteInfo> => {
  const { data } = await apiClient.post("/webreport/settings", settings, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<SiteInfo, Error>({
    queryKey: ["siteSettings"],
    queryFn: fetchSiteSettings,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: (newData) => {
      queryClient.setQueryData(["siteSettings"], newData);
      queryClient.invalidateQueries({ queryKey: ["siteInfo"] });
    },
  });

  return {
    siteSettings: data,
    isLoading,
    isError,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
