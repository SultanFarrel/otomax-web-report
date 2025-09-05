import { useLocation } from "react-router-dom";
import { StatCardsGrid } from "./components/stat-cards.grid";
import { TransactionRecent } from "./components/transactions-activity";
import { MutationRecent } from "./components/mutations-recent";

export default function DashboardPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  return (
    <div className="flex flex-col gap-6">
      <StatCardsGrid isAdmin={isAdmin} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isAdmin && (
          <>
            <MutationRecent />
            <TransactionRecent />
          </>
        )}
      </div>
    </div>
  );
}
