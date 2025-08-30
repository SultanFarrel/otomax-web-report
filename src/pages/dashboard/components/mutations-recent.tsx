import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { RecentBalanceMutations } from "./recent-balance-mutations";
import { TransactionActivitySkeleton } from "./skeleton/TransactionActivity.skeleton";
import { useRecentMutations } from "@/hooks/dashboard/useRecentMutations";

export const MutationRecent: React.FC = () => {
  const {
    data: recentActivityData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useRecentMutations();

  if (isLoading || isFetching) {
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
            Aktivitas Saldo
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
          <RecentBalanceMutations
            data={recentActivityData?.recentMutasi ?? []}
          />
        </div>
      </CardBody>
    </Card>
  );
};
