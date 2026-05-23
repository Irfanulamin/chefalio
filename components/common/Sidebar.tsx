"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  ForkKnife,
  BookOpen,
  ShoppingBag,
  ChartLine,
  Gear,
  Users,
  Shield,
  ListChecks,
  List,
  X,
} from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ElementType;
}

const CHEF_LINKS: NavItem[] = [
  { label: "Dashboard", href: "/chef/dashboard", Icon: House },
  { label: "Recipes", href: "/chef/recipes", Icon: ForkKnife },
  { label: "Cookbooks", href: "/chef/cookbooks", Icon: BookOpen },
  { label: "Orders", href: "/chef/orders", Icon: ShoppingBag },
  { label: "Analytics", href: "/chef/analytics", Icon: ChartLine },
  { label: "Settings", href: "/chef/settings", Icon: Gear },
];

const ADMIN_LINKS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: House },
  { label: "Users", href: "/admin/users", Icon: Users },
  { label: "Recipes", href: "/admin/recipes", Icon: ForkKnife },
  { label: "Cookbooks", href: "/admin/cookbooks", Icon: BookOpen },
  { label: "Orders", href: "/admin/orders", Icon: ShoppingBag },
  { label: "Chef Applications", href: "/admin/chef-applications", Icon: ListChecks },
  { label: "Settings", href: "/admin/settings", Icon: Gear },
];

interface SidebarProps {
  variant: "chef" | "admin";
}

function NavLinks({ links, pathname }: { links: NavItem[]; pathname: string }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ label, href, Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
            style={
              isActive
                ? {
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent)",
                  }
                : {
                    color: "var(--cs-text-secondary)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "var(--cs-surface-3)";
                e.currentTarget.style.color = "var(--cs-text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--cs-text-secondary)";
              }
            }}
          >
            <Icon size={18} weight={isActive ? "fill" : "regular"} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ variant }: SidebarProps) {
  const pathname = usePathname();
  const links = variant === "chef" ? CHEF_LINKS : ADMIN_LINKS;
  const [sheetOpen, setSheetOpen] = useState(false);

  const logoLabel = variant === "chef" ? "Chef Studio" : "Admin Panel";
  const logoIcon = variant === "chef" ? <Shield size={16} /> : <Shield size={16} />;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen shrink-0"
        style={{
          backgroundColor: "var(--cs-surface-2)",
          borderRight: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-2 px-6 h-16 shrink-0"
          style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
        >
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "var(--cs-accent)" }}
          >
            Chefalio
          </Link>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--cs-accent-muted)",
              color: "var(--cs-accent)",
            }}
          >
            {variant === "chef" ? "Chef" : "Admin"}
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 overflow-y-auto">
          <NavLinks links={links} pathname={pathname} />
        </div>

        {/* Bottom: back to site */}
        <div
          className="px-3 py-4"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
            style={{ color: "var(--cs-text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--cs-surface-3)";
              e.currentTarget.style.color = "var(--cs-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--cs-text-secondary)";
            }}
          >
            <House size={18} />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile hamburger + Sheet */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md"
              style={{
                backgroundColor: "var(--cs-surface-1)",
                border: "1px solid var(--cs-border-subtle)",
                color: "var(--cs-text-primary)",
              }}
              aria-label="Open sidebar"
            >
              {sheetOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div
              className="flex items-center gap-2 px-6 h-16"
              style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
            >
              <Link
                href="/"
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "var(--cs-accent)" }}
                onClick={() => setSheetOpen(false)}
              >
                Chefalio
              </Link>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--cs-accent-muted)",
                  color: "var(--cs-accent)",
                }}
              >
                {variant === "chef" ? "Chef" : "Admin"}
              </span>
            </div>
            <div className="py-4" onClick={() => setSheetOpen(false)}>
              <NavLinks links={links} pathname={pathname} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
