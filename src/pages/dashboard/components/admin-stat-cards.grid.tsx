import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { formatCurrency } from "@/utils/formatters";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import { useAdminDashboardStats } from "@/hooks/dashboard/useAdminDashboardStats";
import { StatCardsGridSkeleton } from "./skeleton/stat-cards-grid.skeleton";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";

export const AdminStatCardsGrid: React.FC = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useAdminDashboardStats();

  const handleRefresh = () => {
    refetchStats();
  };

  const isRefreshing = isFetchingStats;

  if (isLoading || isRefreshing) {
    return <StatCardsGridSkeleton />;
  }

  if (error) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">
              {error?.message?.trim() ? error.message : "Gagal memuat data"}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Saldo */}
      <Card>
        <CardBody className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs text-default-500 uppercase font-semibold">
                Total Saldo Agen
              </p>
              <div className="flex items-center gap-2">
                <Tooltip content="Refresh Stats" closeDelay={0}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleRefresh}
                    isLoading={isRefreshing}
                    aria-label="Refresh Stats"
                  >
                    <ArrowPathIcon className="h-5 w-5 text-default-500" />
                  </Button>
                </Tooltip>
                <CreditCardIcon className="h-6 w-6 text-default-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {stats ? formatCurrency(stats.total_saldo_agen) : "0"}
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Chip size="sm" variant="flat">
              {/* MOCK */}
              Komisi: {/*stats ? formatCurrency(stats.komisi) : */ "0"}
            </Chip>
            <Chip size="sm" variant="flat">
              Poin: {/*stats ? stats.poin : */ "0"}
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* Card 2: TRX Sukses Hari Ini */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start">
            <p className="text-xs text-default-500 uppercase font-semibold">
              TRX Sukses Hari Ini
            </p>
            <CheckCircleIcon className="h-6 w-6 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">
            {formatCurrency(stats ? stats.harga_sukses : 0)}
          </p>
          <p className="text-sm text-default-500">
            {stats ? stats.total_sukses : 0} TRX
          </p>
        </CardBody>
      </Card>

      {/* Card 3: TRX Dalam Proses (Placeholder) */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start">
            <p className="text-xs text-default-500 uppercase font-semibold">
              TRX Dalam Proses
            </p>
            <ClockIcon className="h-6 w-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(stats ? stats.harga_pending : 0)}
          </p>
          <p className="text-sm text-default-500">
            {stats ? stats.total_pending : 0} TRX
          </p>
        </CardBody>
      </Card>

      {/* Card 4: TRX Gagal Hari Ini (Placeholder) */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start">
            <p className="text-xs text-default-500 uppercase font-semibold">
              TRX Gagal Hari Ini
            </p>
            <XCircleIcon className="h-6 w-6 text-danger" />
          </div>
          <p className="text-2xl font-bold text-danger">
            {formatCurrency(stats ? stats.harga_gagal : 0)}
          </p>
          <p className="text-sm text-default-500">
            {stats ? stats.total_gagal : 0} TRX
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
