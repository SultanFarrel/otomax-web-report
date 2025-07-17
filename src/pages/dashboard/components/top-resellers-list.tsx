import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";

interface TopResellersListProps {
  data: {
    kode_reseller: string;
    nama_reseller: string;
    jumlah_transaksi: number;
  }[];
}

const formatNumber = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export const TopResellersList: React.FC<TopResellersListProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Top Reseller</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-default-100">
          {data.map((reseller, index) => (
            <div
              key={reseller.kode_reseller}
              className="p-4 flex items-center justify-between hover:bg-default-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-sm text-default-400 w-4">{index + 1}.</div>
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
                  {formatNumber(reseller.jumlah_transaksi)}{" "}
                  <span className="text-xs text-default-400">TRX</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
