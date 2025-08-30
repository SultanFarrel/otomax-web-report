import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/protected-route";
import DefaultLayout from "@/layouts/default";
import { Spinner } from "@heroui/spinner";

// --- Lazy Load Pages ---
const LoginPage = lazy(() => import("@/pages/login"));
const DashboardPage = lazy(() => import("@/pages/dashboard/dashboard"));
const SettingsPage = lazy(() => import("@/pages/settings/settings"));
const ProdukPage = lazy(() => import("@/pages/product/product-pages"));
const TransactionPage = lazy(
  () => import("@/pages/transaction/transaction-pages")
);
const MutasiSaldoPage = lazy(
  () => import("@/pages/balance mutation/balance-mutation")
);
const DownlinePage = lazy(() => import("@/pages/downline/downline"));
const DownlineTreePage = lazy(
  () => import("@/pages/downline-tree/downline-tree")
);
const TransaksiDownlinePage = lazy(
  () => import("@/pages/downline-transaction/downline-transactions")
);
const SessionExpiredPage = lazy(() => import("./pages/errors/session-expired"));
const GenericErrorPage = lazy(() => import("./pages/errors/generic-error"));

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner label="Memuat halaman..." size="lg" />
  </div>
);

function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Rute publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/error" element={<GenericErrorPage />} />

        {/* Rute terproteksi */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route element={<DashboardPage />} path="/" />
            <Route element={<ProdukPage />} path="/produk" />
            <Route element={<TransactionPage />} path="/transaksi" />
            <Route element={<MutasiSaldoPage />} path="/mutasi-saldo" />
            <Route element={<DownlinePage />} path="/downline" />
            <Route element={<DownlineTreePage />} path="/jaringan-downline" />
            <Route
              element={<TransaksiDownlinePage />}
              path="/transaksi-downline"
            />
            <Route element={<SettingsPage />} path="/settings" />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
