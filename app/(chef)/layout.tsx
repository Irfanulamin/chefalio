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
  ChefHatIcon,
  ChartLineUpIcon,
  ListIcon,
  SidebarSimpleIcon,
  UsersIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PackageIcon } from "lucide-react";

const exploreItems = [
  { label: "Recipes", href: "/chef/explore/recipes", icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/chef/explore/cookbooks", icon: BookOpenIcon },
  { label: "Chefs", href: "/chef/explore/chefs", icon: UsersIcon },
  { label: "Activity", href: "/chef/explore/activity", icon: BookmarkSimpleIcon },
];

const studioItems = [
  { label: "Dashboard", href: "/chef/dashboard", icon: HouseLineIcon },
  { label: "Analytics", href: "/chef/analytics", icon: ChartLineUpIcon },
  { label: "My Recipes", href: "/chef/recipes", icon: ForkKnifeIcon },
  { label: "My Cookbooks", href: "/chef/cookbooks", icon: BookOpenIcon },
  { label: "Orders", href: "/chef/orders", icon: PackageIcon },
  { label: "Settings", href: "/chef/settings", icon: GearSixIcon },
];

const allNavItems = [...exploreItems, ...studioItems];

function NavSection({
  label,
  items,
  pathname,
  collapsed,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string; icon: React.ElementType }[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
      )}
      {collapsed && <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 mx-2" />}
      {items.map(({ label: itemLabel, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? itemLabel : undefined}
            onClick={onNavigate}
            className={[
              "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              isActive
                ? "text-foreground bg-zinc-100 dark:bg-zinc-800 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 font-normal",
              collapsed ? "justify-center px-2" : "",
            ].join(" ")}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-primary" />
            )}
            <Icon
              size={16}
              weight={isActive ? "fill" : "regular"}
              className="shrink-0"
            />
            {!collapsed && <span>{itemLabel}</span>}
          </Link>
        );
      })}
    </div>
  );
}

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
    <nav className="flex-1 px-2 pt-1 pb-4 space-y-0.5 overflow-y-auto">
      <NavSection label="Explore" items={exploreItems} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
      <NavSection label="Studio" items={studioItems} pathname={pathname} collapsed={collapsed} onNavigate={onNavigate} />
    </nav>
  );
}

function Logo() {
  return (
    <Link href="/chef/dashboard" className="flex items-center gap-2 min-w-0">
      <ChefHatIcon size={16} weight="duotone" className="text-primary shrink-0" />
      <p className="text-sm font-semibold tracking-tight text-primary truncate">
        Chefalio
      </p>
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

  const activeLabel =
    allNavItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Chef";

  return (
    <ProtectedRoute allowedRoles={["chef"]}>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Desktop Sidebar */}
        <aside
          className={[
            "fixed left-0 top-0 z-40 hidden md:flex h-full flex-col",
            "border-r border-zinc-200 dark:border-zinc-800",
            "bg-white dark:bg-zinc-950",
            "transition-[width] duration-200",
            collapsed ? "w-14" : "w-56",
          ].join(" ")}
        >
          <div className="flex h-14 items-center justify-between px-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Expand sidebar"
              >
                <ChefHatIcon size={16} weight="duotone" className="text-primary" />
              </button>
            ) : (
              <>
                <Logo />
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
                  title="Collapse sidebar"
                >
                  <SidebarSimpleIcon size={15} />
                </button>
              </>
            )}
          </div>

          <NavLinks pathname={pathname} collapsed={collapsed} />
        </aside>

        {/* Main */}
        <div
          className={[
            "flex-1 flex flex-col min-w-0",
            collapsed ? "md:ml-14" : "md:ml-56",
            "transition-[margin] duration-200",
          ].join(" ")}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 md:px-5 shrink-0">
            <div className="flex items-center gap-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <ListIcon size={16} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-56 p-0 flex flex-col bg-white dark:bg-zinc-950">
                  <SheetHeader className="px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <SheetTitle asChild>
                      <Logo />
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks
                    pathname={pathname}
                    onNavigate={() => setSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <span className="hidden md:inline text-sm font-medium text-foreground capitalize">
                {activeLabel}
              </span>
              <span className="flex md:hidden text-sm font-semibold text-foreground">
                Chefalio
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ToggleThemeButton />
              <ProfileDropdown />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
