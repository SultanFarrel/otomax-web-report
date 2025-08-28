export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Web Report",
  description: "Web Report Otomax.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Produk",
      href: "/produk",
    },
    {
      label: "Transaksi",
      href: "/transaksi",
    },
    {
      label: "Mutasi",
      href: "/mutasi-saldo",
    },
    {
      label: "List Downline",
      href: "/downline",
    },
    {
      label: "Jaringan Downline",
      href: "/jaringan-downline",
    },
    {
      label: "Transaksi Downline",
      href: "/transaksi-downline",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
