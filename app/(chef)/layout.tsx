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
  { label: "My Recipes", href: "/chef/recipes", Icon: ForkKnifeIcon },
  { label: "My Cookbooks", href: "/chef/cookbooks", Icon: BookOpenIcon },
  { label: "My Orders", href: "/chef/orders", Icon: PackageIcon },
  { label: "Settings", href: "/chef/settings", Icon: GearSixIcon },
];

const exitItem = { label: "Back to Home", href: "/recipes", Icon: ArrowLeftIcon };

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
      // The studio otherwise shares admin's exact chrome — same Panel, same
      // Reveal, same PageHeader. This is the one thing that says "you're in
      // the studio, not the admin console" at a glance, from the same Tone
      // palette AdminUI already uses to tell its own sections apart.
      accent={{ bg: "var(--cs-violet-bg)", fg: "var(--cs-violet-fg)" }}
    >
      {children}
    </ConsoleShell>
  );
}
