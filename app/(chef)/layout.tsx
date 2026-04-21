"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ToggleThemeButton } from "@/components/common/ToggleThemeButton";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HouseLineIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  GearSixIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChefHatIcon,
  ChartLineUpIcon,
  ListIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PackageIcon } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/chef/dashboard",
    icon: HouseLineIcon,
  },
  {
    label: "Analytics",
    href: "/chef/analytics",
    icon: ChartLineUpIcon,
  },
  {
    label: "My Recipes",
    href: "/chef/recipes",
    icon: ForkKnifeIcon,
  },
  {
    label: "My Cookbooks",
    href: "/chef/cookbooks",
    icon: BookOpenIcon,
  },
  {
    label: "Orders",
    href: "/chef/orders",
    icon: PackageIcon,
  },
  {
    label: "Settings",
    href: "/chef/settings",
    icon: GearSixIcon,
  },
];

/** Shared nav link list — used in both sidebar and Sheet */
function NavLinks({
  pathname,
  collapsed = false,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <Icon
              size={18}
              weight={isActive ? "fill" : "regular"}
              className="shrink-0"
            />
            {!collapsed && <span>{label}</span>}
            {isActive && !collapsed && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Logo mark used in sidebar and Sheet */
function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/chef/dashboard" className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shrink-0">
        <ChefHatIcon size={16} weight="fill" className="text-black" />
      </span>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Chefalio
        </span>
      )}
    </Link>
  );
}

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={["chef"]}>
      <div className="flex min-h-screen bg-background">
        {/* ── Desktop Sidebar (hidden on mobile) ── */}
        <aside
          className={[
            "fixed left-0 top-0 z-40 hidden md:flex h-full flex-col border-r border-border/60",
            "bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-60",
          ].join(" ")}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-3 border-b border-border/40">
            {collapsed ? (
              <Link href="/chef/dashboard" className="mx-auto">
                <Logo showText={false} />
              </Link>
            ) : (
              <>
                <Logo />
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent transition-colors"
                >
                  <CaretLeftIcon size={14} className="text-muted-foreground" />
                </button>
              </>
            )}
          </div>

          <NavLinks pathname={pathname} collapsed={collapsed} />

          {/* Expand toggle at bottom when collapsed */}
          {collapsed && (
            <div className="p-2 border-t border-border/40">
              <button
                onClick={() => setCollapsed(false)}
                className="flex w-full items-center justify-center h-8 rounded-lg hover:bg-accent transition-colors"
              >
                <CaretRightIcon size={14} className="text-muted-foreground" />
              </button>
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <div
          className={[
            "flex-1 flex flex-col transition-all duration-300 ease-in-out",
            // desktop offset
            "md:ml-60",
            collapsed ? "md:ml-16" : "md:ml-60",
          ].join(" ")}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 md:px-6">
            {/* Mobile: hamburger sheet trigger */}
            <div className="flex items-center gap-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors">
                    <ListIcon size={18} className="text-foreground" />
                  </button>
                </SheetTrigger>

                <SheetContent side="left" className="w-64 p-0 flex flex-col">
                  <SheetHeader className="px-6 pt-6 pb-2">
                    <SheetTitle className="text-2xl font-extrabold tracking-tight text-primary">
                      Chefalio
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks
                    pathname={pathname}
                    onNavigate={() => setSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop label */}
              <span className="hidden md:inline text-xs text-muted-foreground uppercase tracking-widest font-medium">
                Chef Portal
              </span>

              {/* Mobile: show logo text inline in header */}
              <span className="flex md:hidden text-sm font-extrabold tracking-tight text-foreground">
                Chefalio
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ToggleThemeButton />
              <ProfileDropdown />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
