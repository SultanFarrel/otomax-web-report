import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { apiClient } from "@/api/axios";
import { Downline } from "@/types";
import { DownlineNode } from "@/components/downline-node";
import { Spinner } from "@heroui/spinner";

// Fungsi untuk mengambil HANYA downline level pertama
const fetchTopLevelDownlines = async (
  uplineKode: string
): Promise<Downline[]> => {
  const { data } = await apiClient.get(`/reseller/upline/${uplineKode}`);
  return data.data;
};

export default function DownlinePage() {
  const user = useUserStore((state) => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["topLevelDownlines", user?.kode],
    queryFn: () => fetchTopLevelDownlines(user!.kode),
    enabled: !!user?.kode,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner label="Memuat data downline..." size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-danger">Gagal memuat data downline.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Struktur Downline</h1>
      {data && data.length > 0 ? (
        data.map((downline) => (
          // Render setiap downline level pertama sebagai 'akar' dari pohonnya masing-masing
          <DownlineNode key={downline.kode} downline={downline} level={0} />
        ))
      ) : (
        <p>Anda tidak memiliki downline.</p>
      )}
    </div>
  );
}
