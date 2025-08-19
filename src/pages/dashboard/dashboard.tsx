import { RangeValue } from "@react-types/shared";
import { DateValue } from "@heroui/calendar";

import { StatCardsGrid } from "./components/stat-cards.grid";
import { TransactionActivity } from "./components/transactions-activity";
import { TransactionsByStatusChart } from "./charts/TransactionsByStatusChart";
import { useState } from "react";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });

  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart
          dateRange={dateRange}
          onDateChange={setDateRange}
          onResetDateFilter={() =>
            setDateRange({
              start: today(getLocalTimeZone()),
              end: today(getLocalTimeZone()),
            })
          }
        />

        <TransactionActivity />
      </div>
    </div>
  );
}
