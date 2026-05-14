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
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PackageIcon } from "lucide-react";

const studioItems = [
  { label: "Dashboard", href: "/chef/dashboard", icon: HouseLineIcon },
  { label: "Analytics", href: "/chef/analytics", icon: ChartLineUpIcon },
  { label: "My Recipes", href: "/chef/recipes", icon: ForkKnifeIcon },
  { label: "My Cookbooks", href: "/chef/cookbooks", icon: BookOpenIcon },
  { label: "Orders", href: "/chef/orders", icon: PackageIcon },
  { label: "Settings", href: "/chef/settings", icon: GearSixIcon },
];

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
    <nav className="flex flex-col flex-1 px-2 pt-2 pb-4 min-h-0">
      <div className="space-y-0.5 flex-1">
        {studioItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
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
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Exit Studio */}
      <div className={["pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800", collapsed ? "px-0" : ""].join(" ")}>
        <Link
          href="/recipes"
          onClick={onNavigate}
          title={collapsed ? "Exit Studio" : undefined}
          className={[
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-zinc-400 dark:text-zinc-500 hover:text-foreground hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50",
            collapsed ? "justify-center px-2" : "",
          ].join(" ")}
        >
          <ArrowLeftIcon size={14} weight="bold" className="shrink-0" />
          {!collapsed && <span>Exit Studio</span>}
        </Link>
      </div>
    </nav>
  );
}

function StudioLogo() {
  return (
    <Link href="/chef/dashboard" className="flex items-center gap-2 min-w-0">
      <ChefHatIcon size={15} weight="duotone" className="text-primary shrink-0" />
      <span className="text-sm font-semibold tracking-tight text-foreground truncate">
        Chef <span className="text-primary">Studio</span>
      </span>
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
    studioItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Studio";

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
                <StudioLogo />
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
                      <StudioLogo />
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks
                    pathname={pathname}
                    onNavigate={() => setSheetOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              <span className="hidden md:inline text-sm font-medium text-foreground">
                {activeLabel}
              </span>
              <span className="flex md:hidden text-sm font-semibold text-foreground">
                Chef Studio
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
