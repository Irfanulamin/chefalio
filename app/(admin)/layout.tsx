"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ToggleThemeButton } from "@/components/common/ToggleThemeButton";
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
  ChefHatIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: HouseLineIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
  { label: "Chef Applications", href: "/admin/chef-applications", icon: ChefHatIcon },
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
              "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
              collapsed ? "justify-center px-2" : "",
            ].join(" ")}
            style={
              isActive
                ? {
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent)",
                    fontWeight: 600,
                  }
                : { color: "var(--cs-text-secondary)" }
            }
          >
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full"
                style={{ backgroundColor: "var(--cs-accent)" }}
              />
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

function AdminLogo() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-2 min-w-0">
      <ShieldCheckIcon size={15} weight="duotone" style={{ color: "var(--cs-accent)" }} className="shrink-0" />
      <span className="text-sm font-semibold tracking-tight truncate" style={{ color: "var(--cs-text-primary)" }}>
        Chefalio <span style={{ color: "var(--cs-accent)" }}>Admin</span>
      </span>
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

  const activeLabel =
    navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Admin";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div
        className="flex min-h-screen"
        style={{ backgroundColor: "var(--cs-surface-1)" }}
      >
        {/* Desktop Sidebar */}
        <aside
          className={[
            "fixed left-0 top-0 z-40 hidden md:flex h-full flex-col",
            "transition-[width] duration-200",
            collapsed ? "w-14" : "w-56",
          ].join(" ")}
          style={{
            borderRight: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
          }}
        >
          <div
            className="flex h-14 items-center justify-between px-3 shrink-0"
            style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
          >
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color: "var(--cs-accent)" }}
                title="Expand sidebar"
              >
                <ShieldCheckIcon size={16} weight="duotone" />
              </button>
            ) : (
              <>
                <AdminLogo />
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150 shrink-0"
                  style={{ color: "var(--cs-text-tertiary)" }}
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
          <header
            className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 md:px-5 shrink-0"
            style={{
              borderBottom: "1px solid var(--cs-border-subtle)",
              backgroundColor: "var(--cs-surface-2)",
            }}
          >
            <div className="flex items-center gap-3">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
                    style={{ color: "var(--cs-text-secondary)" }}
                  >
                    <ListIcon size={16} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-56 p-0 flex flex-col"
                  style={{ backgroundColor: "var(--cs-surface-2)" }}
                >
                  <SheetHeader
                    className="px-4 py-4"
                    style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                  >
                    <SheetTitle asChild>
                      <AdminLogo />
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks pathname={pathname} onNavigate={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>

              <span
                className="hidden md:inline text-sm font-medium capitalize"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {activeLabel}
              </span>
              <span
                className="flex md:hidden text-sm font-semibold"
                style={{ color: "var(--cs-text-primary)" }}
              >
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
