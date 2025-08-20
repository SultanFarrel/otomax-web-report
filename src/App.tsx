import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import ProtectedRoute from "@/components/protected-route";
import LoginPage from "@/pages/login";
import DefaultLayout from "@/layouts/default";
import DashboardPage from "@/pages/dashboard/dashboard";
import SettingsPage from "@/pages/settings";
import ProdukPage from "@/pages/product/product-pages";
import TransactionPage from "@/pages/transaction/transaction-pages";
import MutasiSaldoPage from "@/pages/balance mutation/balance-mutation";
import DownlinePage from "@/pages/downline/downline";
import TransaksiDownlinePage from "@/pages/downline-transaction/downline-transactions";
import SessionExpiredPage from "./pages/errors/session-expired";
import { useUserStore } from "./store/userStore";
import GenericErrorPage from "./pages/errors/generic-error";

function App() {
  const { user, fetchUserData } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user?.kode) {
      document.title = `Web Report - ${user.kode}`;
    }
  }, [user]);

  return (
    <Routes>
      {/* Rute publik, bisa diakses tanpa login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      <Route path="/error" element={<GenericErrorPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DefaultLayout />}>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<ProdukPage />} path="/produk" />
          <Route element={<TransactionPage />} path="/transaksi" />
          <Route element={<MutasiSaldoPage />} path="/mutasi-saldo" />
          <Route element={<DownlinePage />} path="/downline" />
          <Route
            element={<TransaksiDownlinePage />}
            path="/transaksi-downline"
          />
          <Route element={<SettingsPage />} path="/settings" />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
