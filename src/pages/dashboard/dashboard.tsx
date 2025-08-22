import { StatCardsGrid } from "./components/stat-cards.grid";
import { TransactionActivity } from "./components/transactions-activity";
import { TransactionsByStatusChart } from "./charts/TransactionsByStatusChart";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsByStatusChart />

        <TransactionActivity />
      </div>
    </div>
  );
}
