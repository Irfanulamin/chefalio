"use client";

import { useState, useEffect } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import ProtectedRoute, { type AllowedRole } from "@/components/common/ProtectedRoute";
import { ProfileDropdown } from "@/components/common/ProfileDropdown";
import { ToggleThemeButton } from "@/components/common/ToggleThemeButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListIcon, SidebarSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "@/lib/motion";

/**
 * The one shell every authenticated surface is built from — admin, Chef
 * Studio, and the regular user app alike.
 *
 * There used to be three: admin and Chef Studio converged on this shape
 * independently (fixed rail, collapse toggle that swaps into the logo's own
 * slot rather than appearing somewhere else, translucent header, one
 * `layoutId` pill that travels between nav rows), while the user app kept
 * an older shell with its own type scale, its own collapse behavior, and an
 * account block riding along at the bottom of the rail. Someone moving
 * between the three saw three different products. One component, driven by
 * the nav list and a bit of identity, is what makes "console" mean the same
 * thing everywhere it's used — including bugs: fix the collapse toggle once
 * and every surface using this component gets the fix.
 */

export type ConsoleNavItem = {
  label: string;
  href: string;
  Icon: ElementType;
};

export type ConsoleShellProps = {
  /** Rendered in the rail (desktop) and the sheet (mobile). */
  navItems: ConsoleNavItem[];
  /** An optional item set apart by a rule above it — "Exit Studio", sign
     out, anything that reads as leaving rather than moving around. */
  exitItem?: ConsoleNavItem;
  /** The untinted half of the wordmark — "Chefalio", "Chef". */
  logoPrefix: string;
  /** The tinted half — "Admin", "Studio". Omit for the plain consumer app,
     which doesn't name a "mode" the way the two consoles do. */
  logoQualifier?: string;
  logoHref: string;
  logoIcon: ElementType;
  allowedRoles: AllowedRole[];
  children: ReactNode;
};

function NavLinks({
  items,
  exitItem,
  pathname,
  collapsed,
  onNavigate,
  layoutId,
}: {
  items: ConsoleNavItem[];
  exitItem?: ConsoleNavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  layoutId: string;
}) {
  const reduceMotion = useReducedMotion();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const row = (item: ConsoleNavItem, muted = false) => {
    const active = !muted && isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={[
          "focus-ring relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-[color] duration-150 active:scale-[0.98]",
          collapsed ? "justify-center px-2" : "",
        ].join(" ")}
        style={{
          color: active
            ? "var(--cs-accent-text)"
            : muted
              ? "var(--cs-text-tertiary)"
              : "var(--cs-text-secondary)",
          fontWeight: active ? 600 : undefined,
        }}
      >
        {active && (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-lg -z-10"
            style={{ backgroundColor: "var(--cs-accent-muted)" }}
            transition={reduceMotion ? { duration: 0.12 } : SPRING.snappy}
          />
        )}
        <item.Icon
          size={16}
          weight={active ? "fill" : "regular"}
          className="shrink-0"
        />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <nav className="flex-1 flex flex-col px-2 pt-2 pb-4 min-h-0">
      <div className="space-y-0.5 flex-1">{items.map((item) => row(item))}</div>
      {exitItem && (
        <div className="pt-2 mt-2" style={{ borderTop: "1px solid var(--cs-border-subtle)" }}>
          {row(exitItem, true)}
        </div>
      )}
    </nav>
  );
}

function ConsoleLogo({
  prefix,
  qualifier,
  href,
}: {
  prefix: string;
  qualifier?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={qualifier ? `${prefix} ${qualifier}` : prefix}
      className="focus-ring flex items-center gap-2 min-w-0 -ml-1 px-1 py-1 rounded-lg transition-transform duration-150 active:scale-[0.98]"
    >
      <span className="ui-subheading truncate text-foreground">
        {prefix}
        {qualifier && (
          <>
            {" "}
            <span style={{ color: "var(--cs-accent-text)" }}>{qualifier}</span>
          </>
        )}
      </span>
    </Link>
  );
}

export function ConsoleShell({
  navItems,
  exitItem,
  logoPrefix,
  logoQualifier,
  logoHref,
  logoIcon: LogoIcon,
  allowedRoles,
  children,
}: ConsoleShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLabel =
    navItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))
      ?.label ?? logoQualifier ?? logoPrefix;

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--cs-surface-1)" }}>
        {/* Desktop rail — width springs, and the collapse toggle swaps into
           the logo's own slot rather than appearing as a second control
           somewhere else, so nothing shifts position when you collapse. */}
        <motion.aside
          className="fixed left-0 top-0 z-40 hidden md:flex h-full flex-col overflow-hidden"
          style={{
            borderRight: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
          }}
          animate={{ width: collapsed ? 56 : 224 }}
          transition={reduceMotion ? { duration: 0.15 } : SPRING.default}
        >
          <div
            className="flex h-14 items-center justify-between px-3 shrink-0"
            style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
          >
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="focus-ring mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 hover:bg-(--cs-hover) active:scale-90"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <LogoIcon size={15} weight="duotone" className="text-black dark:text-white" />
              </button>
            ) : (
              <>
                <ConsoleLogo prefix={logoPrefix} qualifier={logoQualifier} href={logoHref} />
                <button
                  onClick={() => setCollapsed(true)}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 shrink-0 hover:bg-(--cs-hover) active:scale-90"
                  style={{ color: "var(--cs-text-tertiary)" }}
                  title="Collapse sidebar"
                >
                  <SidebarSimpleIcon size={15} />
                </button>
              </>
            )}
          </div>

          <NavLinks
            items={navItems}
            exitItem={exitItem}
            pathname={pathname}
            collapsed={collapsed}
            layoutId="console-nav-active-desktop"
          />
        </motion.aside>

        {/* Main */}
        <div
          className={[
            "flex-1 flex flex-col min-w-0",
            collapsed ? "md:ml-14" : "md:ml-56",
            "transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          ].join(" ")}
        >
          <header
            className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 md:px-5 shrink-0"
            style={{
              backgroundColor: "var(--cs-material-thick)",
              backdropFilter: "blur(var(--cs-material-blur))",
              WebkitBackdropFilter: "blur(var(--cs-material-blur))",
              borderBottom: `1px solid ${scrolled ? "var(--cs-border-subtle)" : "transparent"}`,
              transition: "border-color 200ms ease",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="focus-ring flex md:hidden h-8 w-8 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 hover:bg-(--cs-hover) active:scale-90"
                    style={{ color: "var(--cs-text-secondary)" }}
                    aria-label="Open navigation"
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
                      <ConsoleLogo prefix={logoPrefix} qualifier={logoQualifier} href={logoHref} />
                    </SheetTitle>
                  </SheetHeader>
                  <NavLinks
                    items={navItems}
                    exitItem={exitItem}
                    pathname={pathname}
                    collapsed={false}
                    onNavigate={() => setSheetOpen(false)}
                    layoutId="console-nav-active-mobile"
                  />
                </SheetContent>
              </Sheet>

              <span className="hidden md:inline ui-subheading text-foreground truncate">
                {activeLabel}
              </span>
              <span className="flex md:hidden min-w-0">
                <ConsoleLogo prefix={logoPrefix} qualifier={logoQualifier} href={logoHref} />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ToggleThemeButton />
              <ProfileDropdown />
            </div>
          </header>

          <motion.main
            key={pathname}
            className="flex-1 p-4 md:p-6"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : SPRING.soft}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ConsoleShell;
