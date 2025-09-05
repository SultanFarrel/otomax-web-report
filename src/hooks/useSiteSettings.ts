// src/hooks/useSiteSettings.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/axios";
import { SiteInfo } from "@/types";

// Fungsi untuk mengambil pengaturan saat ini
const fetchSiteSettings = async (): Promise<SiteInfo> => {
  // Endpoint ini akan otomatis di-prefix dengan /adm oleh interceptor
  const { data } = await apiClient.get("/webreport/me");
  return data;
};

// Fungsi untuk memperbarui pengaturan
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
      // Perbarui data di cache setelah berhasil
      queryClient.setQueryData(["siteSettings"], newData);
      // Invalidate query siteInfo di store agar header ikut terupdate
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
