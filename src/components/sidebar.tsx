import { Fragment } from "react";
import * as React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import cn from "clsx";

import { siteConfig } from "@/config/site";
import {
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  UsersIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { MoreHorizontalIcon, ChevronLeftIcon } from "@/components/icons";
import { useAuthStore } from "@/store/authStore";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useUserStore } from "@/store/userStore";
import { useAdminUserStore } from "@/store/adminUserStore";
import { useSiteStore } from "@/store/siteStore";

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export const SidebarContent = ({ isCollapsed }: SidebarProps) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/adm");

  const { user } = useUserStore();
  const { adminUser } = useAdminUserStore();
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const { logout: userLogout } = useAuthStore();
  const { logout: adminLogout } = useAdminAuthStore();
  const navigate = useNavigate();

  const currentUser = isAdmin ? adminUser : user;
  const logout = isAdmin ? adminLogout : userLogout;

  const iconMap: { [key: string]: React.ElementType } = {
    "/": HomeIcon,
    "/produk": ShoppingBagIcon,
    "/transaksi": CurrencyDollarIcon,
    "/mutasi-saldo": ArrowPathIcon,
    "/list": UsersIcon,
    "/jaringan-downline": ShareIcon,
    "/transaksi-downline": DocumentTextIcon,
  };

  return (
    <Fragment>
      {/* Header */}
      <div
        className={cn("flex h-16 flex-shrink-0 items-center", {
          "justify-center": isCollapsed,
          "justify-between": !isCollapsed,
        })}
      >
        {!isCollapsed && (
          <Link className="flex items-center gap-3" color="foreground" href="/">
            <p className="font-bold text-inherit text-2xl">
              {/* .kode ganti jadi .judul jika sudah ada */}
              {siteInfo?.judul || "Web Report"}
            </p>
          </Link>
        )}
        {isCollapsed && <GlobeAltIcon className="h-6 w-6" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {siteConfig.navItems.map((item) => {
          const Icon = iconMap[item.href];
          let targetHref = isAdmin ? `/adm${item.href}` : item.href;
          let label = item.label;

          if (item.href === "/list") {
            if (isAdmin) {
              targetHref = "/adm/agen";
              label = "List Agen";
            } else {
              targetHref = "/downline";
              label = "List Downline";
            }
          }

          return (
            <Tooltip
              key={item.href}
              content={label}
              isDisabled={!isCollapsed}
              placement="right"
              closeDelay={0}
            >
              <NavLink
                to={targetHref}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    {
                      "bg-primary text-primary-foreground": isActive,
                      "text-foreground-500 hover:bg-default-100": !isActive,
                      "justify-center": isCollapsed,
                    }
                  )
                }
              >
                {Icon && (
                  <Icon
                    className={cn("h-5 w-5 flex-shrink-0", {
                      "mr-3": !isCollapsed,
                    })}
                  />
                )}
                {!isCollapsed && label}
              </NavLink>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-divider pt-4">
        <Dropdown placement="top-end" offset={15}>
          <DropdownTrigger>
            <button
              className={cn(
                "flex items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-default-100",
                {
                  "w-full": !isCollapsed,
                  "justify-center": isCollapsed,
                }
              )}
            >
              <Avatar
                size="sm"
                name={currentUser?.nama}
                className="bg-primary text-primary-foreground"
              />
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.nama ||
                      (isAdmin ? "Nama Admin" : "Nama Pengguna")}
                  </p>
                </div>
              )}
              {!isCollapsed && (
                <MoreHorizontalIcon className="text-default-500" />
              )}
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue="Profile Info"
              isDisabled
            >
              <p>{currentUser?.kode}</p>
              <p className="font-semibold">
                {user?.saldo !== undefined
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(user.saldo)
                  : "..."}
              </p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              onPress={() => navigate(isAdmin ? "/adm/settings" : "/settings")}
              startContent={<Cog6ToothIcon className="h-5 w-5" />}
            >
              Settings
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<ArrowLeftOnRectangleIcon className="h-5 w-5" />}
              onPress={logout}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Fragment>
  );
};

export const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-divider bg-background px-4 py-4 transition-width duration-300",
        {
          "w-64": !isCollapsed,
          "w-20": isCollapsed,
        }
      )}
    >
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className={cn(
          "absolute -right-3 top-1/2 z-10 rounded-full bg-background",
          {
            "rotate-180": isCollapsed,
          }
        )}
        onPress={onCollapse}
      >
        <ChevronLeftIcon />
      </Button>

      <SidebarContent isCollapsed={isCollapsed} />
    </div>
  );
};
