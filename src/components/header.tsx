import { useLocation } from "react-router-dom";
import { Button } from "@heroui/button";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";
import { ThemeSwitch } from "@/components/theme-switch";
import { MenuIcon } from "@/components/icons";

interface HeaderProps {
  onMenuOpen?: () => void;
}

export const Header = ({ onMenuOpen }: HeaderProps) => {
  const location = useLocation();

  const getPageTitle = () => {
    const rawPath = location.pathname;
    let currentPath = rawPath;

    if (currentPath.startsWith("/adm")) {
      currentPath = currentPath.substring(4);
      if (currentPath === "") {
        currentPath = "/";
      }
    }

    if (rawPath === "/downline" || rawPath === "/agen") {
      return "List Downline";
    }
    if (rawPath === "/adm/agen") {
      return "List Agen";
    }

    // Logika pencarian judul
    const navItem = siteConfig.navItems.find(
      (item) => item.href === currentPath
    );

    if (currentPath === "/settings" || currentPath === "/adm/settings") {
      return "Settings";
    }

    return navItem ? navItem.label : "Home";
  };

  const pageTitle = getPageTitle();

  return (
    <div className="flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          className="lg:hidden"
          size="sm"
          variant="light"
          onPress={onMenuOpen}
        >
          <MenuIcon />
        </Button>
        <h1 className={title({ size: "xs" })}>{pageTitle}</h1>
      </div>
      <ThemeSwitch />
    </div>
  );
};
