import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { RecentTransactions } from "./recent-transactions";
import { useRecentTransactions } from "@/hooks/dashboard/useRecentTransactions";
import { TransactionActivitySkeleton } from "./skeleton/TransactionActivity.skeleton";

export const TransactionRecent: React.FC = () => {
  const {
    data: recentActivityData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useRecentTransactions();

  if (isLoading) {
    return <TransactionActivitySkeleton />;
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
    <Card>
      <CardHeader>
        <div className="flex w-full items-center justify-between border-b border-default-200">
          <p className="text-sm text-default-500 uppercase font-semibold">
            Aktivitas Transaksi
          </p>
          {/* Refresh Button */}
          <Tooltip content="Refresh Aktivitas" closeDelay={0}>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="me-2"
              onPress={() => refetch()}
              isLoading={isFetching}
              aria-label="Refresh Aktivitas"
            >
              <ArrowPathIcon className="h-5 w-5 text-default-500" />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent px-2 transition-all duration-300 ease-in-out">
          <RecentTransactions
            data={recentActivityData?.recentTransactions ?? []}
          />
        </div>
      </CardBody>
    </Card>
  );
};
