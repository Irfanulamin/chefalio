"use client";

import { ConsoleShell } from "@/components/common/ConsoleShell";
import {
  HouseLineIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  GearSixIcon,
  ChefHatIcon,
  ChartLineUpIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PackageIcon } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/chef/dashboard", Icon: HouseLineIcon },
  { label: "Analytics", href: "/chef/analytics", Icon: ChartLineUpIcon },
  { label: "Recipes", href: "/chef/recipes", Icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/chef/cookbooks", Icon: BookOpenIcon },
  { label: "Orders", href: "/chef/orders", Icon: PackageIcon },
  { label: "Settings", href: "/chef/settings", Icon: GearSixIcon },
];

const exitItem = { label: "Exit Studio", href: "/recipes", Icon: ArrowLeftIcon };

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConsoleShell
      navItems={navItems}
      exitItem={exitItem}
      logoPrefix="Chef"
      logoQualifier="Studio"
      logoHref="/chef/dashboard"
      logoIcon={ChefHatIcon}
      allowedRoles={["chef"]}
    >
      {children}
    </ConsoleShell>
  );
}
