import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { RecentTransactions } from "./recent-transactions";
import { RecentBalanceMutations } from "./recent-balance-mutations";
import { useRecentActivity } from "@/hooks/dashboard/useRecentActivity";
import { TransactionActivitySkeleton } from "./skeleton/TransactionActivity.skeleton";

export const TransactionActivity: React.FC = () => {
  const {
    data: recentActivityData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useRecentActivity();

  const [activeTab, setActiveTab] = useState<"transactions" | "mutasi">(
    "transactions"
  );

  if (isLoading) {
    return <TransactionActivitySkeleton />;
  }

  if (error || !recentActivityData) {
    return (
      <div className="grid grid-cols-1">
        <Card className="bg-danger-50 border-danger-200">
          <CardBody>
            <p className="text-danger-700">
              {error?.message?.trim ? error.message : "Gagal memuat data"}
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
          {/* Tabs */}
          <div className="flex">
            <Button
              variant="light"
              className={`rounded-b-none px-4 py-2 font-semibold ${
                activeTab === "transactions"
                  ? "border-b-2 border-primary text-primary bg-default-100"
                  : "text-default-500"
              }`}
              onPress={() => setActiveTab("transactions")}
            >
              Aktivitas Transaksi
            </Button>

            <Button
              variant="light"
              className={`rounded-b-none px-4 py-2 font-semibold ${
                activeTab === "mutasi"
                  ? "border-b-2 border-primary text-primary bg-default-100"
                  : "text-default-500"
              }`}
              onPress={() => setActiveTab("mutasi")}
            >
              Aktivitas Saldo
            </Button>
          </div>

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
          {activeTab === "transactions" ? (
            <RecentTransactions data={recentActivityData?.recentTransactions} />
          ) : (
            <RecentBalanceMutations data={recentActivityData?.recentMutasi} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
