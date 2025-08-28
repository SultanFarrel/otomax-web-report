import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Transaction } from "@/types";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { STATUS_COLORS } from "@/pages/transaction/constants/transaction-constants";

interface RecentTransactionsProps {
  data: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  data,
}) => {
  const totalAmount = React.useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.reduce((acc, trx) => {
      if (trx.status === 20 || trx.status === 1 || trx.status === 2) {
        acc += trx.harga;
      }
      return acc;
    }, 0);
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">10 Transaksi Terakhir</h3>
        <div className="flex items-center gap-2 text-sm font-medium">
          <p>
            Total Harga: <span>{formatCurrency(totalAmount)}</span>
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-default-100 ">
          {data.map((trx) => (
            <div
              key={trx.kode}
              className="py-2 px-4 flex justify-between items-start even:bg-default-100"
            >
              <div>
                <p className="font-semibold">{trx.kode_produk}</p>
                <p className="font-semibold text-xs">{trx.nama_operator}</p>
                <p className="text-sm text-default-500">{trx.tujuan}</p>
                <p className="text-xs text-default-400">
                  {formatDate(trx.tgl_entri)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(trx.harga)}</p>
                <Chip
                  size="sm"
                  variant="flat"
                  color={STATUS_COLORS[trx.status]?.color || "default"}
                >
                  {STATUS_COLORS[trx.status]?.text || "Unknown"}
                </Chip>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button as={Link} href="/transaksi" size="sm" variant="light">
          Lihat Semua
        </Button>
      </CardFooter>
    </Card>
  );
};
