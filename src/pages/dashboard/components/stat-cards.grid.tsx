// src/pages/dashboard/components/stat-cards-grid.tsx

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { formatCurrency } from "@/utils/formatters";
import { ArrowUpRightIcon, ArrowDownLeftIcon } from "@heroicons/react/24/solid";

interface StatCardsGridProps {
  stats: {
    total_trx_today: number;
    total_laba_today: number;
    total_mutasi_in_today: number;
    total_mutasi_out_today: number;
    total_komisi_today: number;
    total_komisi_all: number;
  };
}

export const StatCardsGrid: React.FC<StatCardsGridProps> = ({ stats }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Grid 4 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-default-500">Transaksi Hari Ini</p>
            <p className="text-2xl font-bold">{stats.total_trx_today} TRX</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">Komisi Hari Ini</p>
            <p className="text-xl font-bold text-warning">
              {formatCurrency(stats.total_komisi_today)}
            </p>
            <p className="text-xs text-default-500 mt-1">
              Komisi Keseluruhan: {formatCurrency(stats.total_komisi_all)}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">Mutasi Masuk</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-success">
                {formatCurrency(stats.total_mutasi_in_today)}
              </p>
              <ArrowUpRightIcon className="h-5 w-5 text-success" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-default-500">Mutasi Keluar</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-danger">
                {formatCurrency(stats.total_mutasi_out_today)}
              </p>
              <ArrowDownLeftIcon className="h-5 w-5 text-danger" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
