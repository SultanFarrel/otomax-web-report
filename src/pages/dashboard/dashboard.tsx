import { StatCardsGrid } from "./components/stat-cards.grid";
import { TransactionRecent } from "./components/transactions-activity";
import { MutationRecent } from "./components/mutations-recent";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MutationRecent />
        <TransactionRecent />
      </div>
    </div>
  );
}
