import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { RecentTransactions } from "./recent-transactions";
import { RecentBalanceMutations } from "./recent-balance-mutations";

interface Props {
  recentTransactions: any[];
  recentMutasi: any[];
}

export const TransactionActivity: React.FC<Props> = ({
  recentTransactions,
  recentMutasi,
}) => {
  const [activeTab, setActiveTab] = useState<"transactions" | "mutasi">(
    "transactions"
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex border-b border-default-200">
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
      </CardHeader>
      <CardBody>
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent px-2 transition-all duration-300 ease-in-out">
          {activeTab === "transactions" ? (
            <RecentTransactions data={recentTransactions} />
          ) : (
            <RecentBalanceMutations data={recentMutasi} />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
