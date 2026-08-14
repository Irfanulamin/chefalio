"use client";

import { ConsoleShell } from "@/components/common/ConsoleShell";
import {
  HouseLineIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  UsersIcon,
  GearSixIcon,
  ShoppingCartSimpleIcon,
  ChefHatIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: HouseLineIcon },
  { label: "Users", href: "/admin/users", Icon: UsersIcon },
  { label: "Chef Applications", href: "/admin/chef-applications", Icon: ChefHatIcon },
  { label: "Recipes", href: "/admin/recipes", Icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/admin/cookbooks", Icon: BookOpenIcon },
  { label: "Orders", href: "/admin/orders", Icon: ShoppingCartSimpleIcon },
  { label: "Settings", href: "/admin/settings", Icon: GearSixIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConsoleShell
      navItems={navItems}
      logoPrefix="Chefalio"
      logoQualifier="Admin"
      logoHref="/admin/dashboard"
      logoIcon={ShieldCheckIcon}
      allowedRoles={["admin"]}
    >
      {children}
    </ConsoleShell>
  );
}
