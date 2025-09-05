import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/protected-route";
import DefaultLayout from "@/layouts/default";
import { Spinner } from "@heroui/spinner";
import { useSiteStore } from "./store/siteStore";

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
const LoginListPage = lazy(() => import("@/pages/login-lists/login-list-page"));
const SessionExpiredPage = lazy(() => import("./pages/errors/session-expired"));
const GenericErrorPage = lazy(() => import("./pages/errors/generic-error"));

const SuspenseFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner label="Memuat halaman..." size="lg" />
  </div>
);

function App() {
  const { fetchSiteInfo, siteInfo } = useSiteStore();

  useEffect(() => {
    fetchSiteInfo();
  }, [fetchSiteInfo]);

  useEffect(() => {
    if (siteInfo?.judul) {
      document.title = siteInfo.judul;
    }
  }, [siteInfo]);
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Rute publik */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/adm/login" element={<LoginPage />} />
        <Route path="/session-expired" element={<SessionExpiredPage />} />
        <Route path="/error" element={<GenericErrorPage />} />

        {/* Rute Terproteksi Pengguna Biasa */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/produk" element={<ProdukPage />} />
            <Route path="/transaksi" element={<TransactionPage />} />
            <Route path="/mutasi-saldo" element={<MutasiSaldoPage />} />
            <Route path="/downline" element={<DownlinePage />} />
            <Route path="/jaringan-downline" element={<DownlineTreePage />} />
            <Route path="/transaksi-downline" element={<TransactionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Rute Terproteksi Admin dengan prefix /adm */}
        <Route path="/adm" element={<ProtectedRoute isAdmin />}>
          <Route element={<DefaultLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="produk" element={<ProdukPage />} />
            <Route path="transaksi" element={<TransactionPage />} />
            <Route path="mutasi-saldo" element={<MutasiSaldoPage />} />
            <Route path="agen" element={<DownlinePage />} />
            <Route path="jaringan-downline" element={<DownlineTreePage />} />
            <Route path="transaksi-downline" element={<TransactionPage />} />
            <Route element={<LoginListPage />} path="list-login" />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
