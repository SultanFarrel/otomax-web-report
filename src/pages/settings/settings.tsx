import { useLocation } from "react-router-dom";
import { SessionList } from "./components/session-list";
import { WebsiteSettings } from "./components/website-settings";
import { ChangePasswordCard } from "./components/change-password-card";

export default function SettingsPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  const AdminSettings = () => (
    <div className="flex flex-col gap-6">
      <WebsiteSettings />
      <ChangePasswordCard />
    </div>
  );

  return (
    <>
      {/* Tampilkan komponen yang sesuai berdasarkan peran */}
      {isAdmin ? <AdminSettings /> : <SessionList />}
    </>
  );
}
