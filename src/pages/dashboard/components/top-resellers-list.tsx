import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { useTopProductsAndResellers } from "@/hooks/dashboard/useTopProductsAndResellers";
import { TopResellersWidgetSkeleton } from "./skeleton/top-resellers-widget.skeleton";

const formatNumber = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export const TopResellersList: React.FC = () => {
  const {
    data: TopResellersData,
    isLoading,
    isError,
  } = useTopProductsAndResellers(5);

  if (isLoading) {
    return <TopResellersWidgetSkeleton />;
  }

  if (isError || !TopResellersData) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">Gagal memuat chart.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Top Reseller Hari Ini</h3>
      </CardHeader>
      <CardBody className="p-0">
        {TopResellersData.topResellers.length == 0 ? (
          <div className="text-center text-default-500 p-4">
            Data tidak tersedia
          </div>
        ) : (
          <div className="divide-y divide-default-100">
            {TopResellersData.topResellers.map((reseller, index) => (
              <div
                key={reseller.kode_reseller}
                className="p-4 flex items-center justify-between hover:bg-default-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm text-default-400 w-4">
                    {index + 1}.
                  </div>
                  <Avatar
                    size="sm"
                    name={reseller.nama_reseller}
                    className="bg-primary text-primary-foreground"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold leading-tight">
                      {reseller.nama_reseller}
                    </span>
                    <span className="text-xs text-default-500 leading-none">
                      {reseller.kode_reseller}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {formatNumber(reseller.jumlah_transaksi)}
                    <span className="text-xs text-default-400">TRX</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
