// src/pages/settings/settings.tsx

import { useLocation } from "react-router-dom";
import { SessionList } from "./components/session-list";
import { WebsiteSettings } from "./components/website-settings"; // Import komponen baru

export default function SettingsPage() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  return (
    <>
      {/* Tampilkan komponen yang sesuai berdasarkan peran */}
      {isAdmin ? <WebsiteSettings /> : <SessionList />}
    </>
  );
}
