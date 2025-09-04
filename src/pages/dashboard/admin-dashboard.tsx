import { AdminStatCardsGrid } from "./components/admin-stat-cards.grid";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminStatCardsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>
    </div>
  );
}
