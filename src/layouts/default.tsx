import { useEffect } from "react";

import { Drawer, DrawerContent } from "@heroui/drawer";
import { Outlet } from "react-router-dom";
import cn from "clsx";

import { Sidebar, SidebarContent } from "@/components/sidebar";
import { Header } from "@/components/header";
import { useUiStore } from "@/store/uiStore";

import { useUserStore } from "@/store/userStore";
import { useSiteStore } from "@/store/siteStore";

export default function DefaultLayout() {
  const { user, fetchUserData } = useUserStore();
  const { siteInfo, fetchSiteInfo } = useSiteStore();

  useEffect(() => {
    fetchUserData();
    fetchSiteInfo();
  }, [fetchUserData, fetchSiteInfo]);

  useEffect(() => {
    if (user?.kode && siteInfo?.judul) {
      document.title = `${siteInfo.judul} - Web Report`;
    }
  }, [user, siteInfo]);

  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isSidebarOpen,
    setSidebarOpen,
  } = useUiStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Static sidebar for desktop */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          {
            "lg:w-64": !isSidebarCollapsed,
            "lg:w-20": isSidebarCollapsed,
          }
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        isOpen={isSidebarOpen}
        onOpenChange={setSidebarOpen}
        placement="left"
        size="sm"
      >
        <DrawerContent>
          <div className="flex h-full w-full flex-col bg-background p-6">
            <SidebarContent onNavItemClick={() => setSidebarOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>

      <div
        className={cn("transition-all duration-300", {
          "lg:pl-64": !isSidebarCollapsed,
          "lg:pl-20": isSidebarCollapsed,
        })}
      >
        <div className="flex flex-1 flex-col min-h-screen">
          {/* Header for All Screens */}
          <header className="sticky top-0 z-40 w-full border-b border-divider bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto max-w-8xl px-6">
              <Header onMenuOpen={() => setSidebarOpen(true)} />
            </div>
          </header>

          <main className="container mx-auto max-w-8xl flex-grow px-6 py-8">
            <Outlet />
          </main>
          <footer className="w-full flex items-center justify-center py-3 mt-auto"></footer>
        </div>
      </div>
    </div>
  );
}
