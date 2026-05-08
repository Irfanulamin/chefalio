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
  UsersIcon,
  GearSixIcon,
  ListIcon,
  SidebarSimpleIcon,
  ShoppingCartSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: HouseLineIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
  { label: "Recipes", href: "/admin/recipes", icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/admin/cookbooks", icon: BookOpenIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCartSimpleIcon },
  { label: "Settings", href: "/admin/settings", icon: GearSixIcon },
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
    <nav className="flex-1 px-2 pt-2 pb-4 space-y-0.5">
      {navItems.map(({ label, href, icon: Icon }) => {
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
    </nav>
  );
}

function Logo() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
        <p className="text-sm font-semibold tracking-tight text-primary truncate">
          Chefalio
        </p>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
                <Logo  />
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
                <SheetContent
                  side="left"
                  className="w-56 p-0 flex flex-col bg-white dark:bg-zinc-950"
                >
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
                {navItems.find(
                  (n) =>
                    pathname === n.href || pathname.startsWith(n.href + "/"),
                )?.label ?? "Admin"}
              </span>
              <span className="flex md:hidden text-sm font-semibold text-foreground">
                Chefalio Admin
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
