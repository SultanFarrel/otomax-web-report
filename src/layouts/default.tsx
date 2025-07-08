import { useState } from "react";
import { Link } from "@heroui/link";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { Outlet } from "react-router-dom";
import cn from "clsx";

import { Sidebar, SidebarContent } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DefaultLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Static sidebar for desktop */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          {
            "lg:w-64": !isCollapsed,
            "lg:w-20": isCollapsed,
          }
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        isOpen={sidebarOpen}
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
          "lg:pl-64": !isCollapsed,
          "lg:pl-20": isCollapsed,
        })}
      >
        <div className="flex flex-1 flex-col min-h-screen">
          {/* Header for All Screens */}
          <header className="sticky top-0 z-40 w-full border-b border-divider bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto max-w-8xl px-6">
              <Header onMenuOpen={() => setSidebarOpen(true)} />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto max-w-8xl flex-grow px-6 py-8">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="w-full flex items-center justify-center py-3 mt-auto">
            <Link
              isExternal
              className="flex items-center gap-1 text-current"
              href="https://otomax-software.com"
              title="otomax-software.com homepage"
            >
              <span className="text-default-600">Powered by</span>
              <p className="text-primary">OtomaX</p>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
