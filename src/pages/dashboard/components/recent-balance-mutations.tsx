import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { BalanceMutation } from "@/types";
import { formatDate, formatCurrency } from "@/utils/formatters";
import cn from "clsx";

interface RecentBalanceMutationsProps {
  data: BalanceMutation[];
}

export const RecentBalanceMutations: React.FC<RecentBalanceMutationsProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">10 Mutasi Saldo Terakhir</h3>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-default-100">
          {data.map((mutasi) => (
            <div
              key={mutasi.kode}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p
                  className="text-sm text-default-500 max-w-xs truncate"
                  title={mutasi.keterangan}
                >
                  {mutasi.keterangan}
                </p>
                <p className="text-xs text-default-400">
                  {formatDate(mutasi.tanggal)}
                </p>
              </div>
              <p
                className={cn("font-semibold", {
                  "text-success": mutasi.jumlah > 0,
                  "text-danger": mutasi.jumlah < 0,
                })}
              >
                {formatCurrency(mutasi.jumlah)}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button as={Link} href="/mutasi-saldo" size="sm" variant="light">
          Lihat Semua
        </Button>
      </CardFooter>
    </Card>
  );
};
