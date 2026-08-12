"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
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
  GearSixIcon,
  ChefHatIcon,
  ChartLineUpIcon,
  ListIcon,
  SidebarSimpleIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PackageIcon } from "lucide-react";
import { SPRING } from "@/lib/motion";

/**
 * Chef Studio shell.
 *
 * The previous shell was correct but flat: two opaque strips (a sidebar and
 * a top bar) each closed off by a 1px border, an active nav item marked by
 * a hard colour swap, and a sidebar that changed width via a CSS width
 * transition. It worked; it didn't feel like anything.
 *
 * Three changes, each from a specific piece of Apple's guidance:
 *
 * **Chrome is a material, not a strip.** The top bar is now translucent
 * with a blur, and content scrolls *under* it rather than starting below
 * it. Structural chrome (the sidebar) takes the heavier material; the bar
 * floating over content takes a lighter one. Neither stacks light on light.
 *
 * **Scroll edge effects, not permanent dividers.** The hairline under the
 * top bar only appears once there is content behind it to separate from.
 * A divider drawn against blank space is a line for its own sake.
 *
 * **The active indicator moves.** It's one element re-parented between nav
 * items via `layoutId`, so navigating slides it from where it was. Click
 * two items quickly and it redirects mid-flight rather than queueing —
 * which is the whole point of a spring over a transition.
 */

const studioItems = [
  { label: "Dashboard", href: "/chef/dashboard", icon: HouseLineIcon },
  { label: "Analytics", href: "/chef/analytics", icon: ChartLineUpIcon },
  { label: "Recipes", href: "/chef/recipes", icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/chef/cookbooks", icon: BookOpenIcon },
  { label: "Orders", href: "/chef/orders", icon: PackageIcon },
  { label: "Settings", href: "/chef/settings", icon: GearSixIcon },
];

function NavLinks({
  pathname,
  collapsed = false,
  onNavigate,
  layoutGroup,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
  /** Distinguishes the desktop rail from the mobile sheet, so the two
   *  copies of the indicator don't try to share one layout animation. */
  layoutGroup: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <nav className="flex flex-col flex-1 px-2 pt-2 pb-3 min-h-0">
      <div className="space-y-0.5 flex-1">
        {studioItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={[
                "relative flex items-center gap-2.5 h-9 rounded-[10px] text-sm",
                "transition-[background-color,transform] duration-150 active:scale-[0.98]",
                collapsed ? "justify-center px-2" : "px-3",
                isActive ? "font-medium" : "hover:bg-[var(--cs-hover)]",
              ].join(" ")}
              style={{
                color: isActive ? "var(--cs-text-primary)" : "var(--cs-text-secondary)",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId={`studio-nav-${layoutGroup}`}
                  className="absolute inset-0 rounded-[10px]"
                  style={{
                    backgroundColor: "var(--cs-selected)",
                    boxShadow: "inset 0 0 0 1px rgba(167,209,41,0.18)",
                  }}
                  transition={reduceMotion ? { duration: 0 } : SPRING.snappy}
                />
              )}
              <Icon
                size={16}
                weight={isActive ? "fill" : "regular"}
                className="relative shrink-0"
                style={{ color: isActive ? "var(--cs-accent-text)" : undefined }}
              />
              {!collapsed && <span className="relative truncate">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Leaving the studio is a different kind of action from moving around
          inside it, so it sits below the rule rather than in the list. */}
      <div className="pt-2 mt-2" style={{ borderTop: "1px solid var(--cs-border-subtle)" }}>
        <Link
          href="/recipes"
          onClick={onNavigate}
          title={collapsed ? "Exit Studio" : undefined}
          className={[
            "flex items-center gap-2.5 h-9 rounded-[10px] text-sm",
            "transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.98]",
            collapsed ? "justify-center px-2" : "px-3",
          ].join(" ")}
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          <ArrowLeftIcon size={14} weight="bold" className="shrink-0" />
          {!collapsed && <span>Exit Studio</span>}
        </Link>
      </div>
    </nav>
  );
}

/**
 * The studio mark — the same construction as the chip that opens Chef
 * Studio from the profile dropdown, minus the tint.
 *
 * The lime wash earns its place in the dropdown, where the chip is one
 * pressable item in a list and the fill is what marks it out as the
 * primary destination. In the sidebar header it has nothing to distinguish
 * itself *from*: it's the only thing in that corner, and a filled block
 * sitting above a column of quiet nav items reads as another selected row
 * — competing with the actual selection indicator below it.
 *
 * "Studio" uses `--cs-accent-text` rather than raw `--primary`, since the
 * raw brand lime measures ~1.7:1 on a light surface and would leave the
 * word naming the console as the unreadable half of the mark. Same hue,
 * deepened in light and brightened in dark.
 */
function StudioLogo() {
  return (
    <Link
      href="/chef/dashboard"
      aria-label="Chef Studio"
      className="focus-ring flex items-center gap-2 min-w-0 -ml-1 px-1 py-1 rounded-lg transition-transform duration-150 active:scale-[0.98]"
    >
      <ChefHatIcon
        size={15}
        weight="duotone"
        className="text-black shrink-0 dark:text-white"
      />
      <span className="text-sm font-semibold tracking-tight text-foreground truncate">
        Chef <span style={{ color: "var(--cs-accent-text)" }}>Studio</span>
      </span>
    </Link>
  );
}

export default function ChefLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  /* The top bar's hairline is a scroll edge effect: it exists only while
     there is content passing underneath it to separate from. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeLabel =
    studioItems.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))
      ?.label ?? "Studio";

  return (
    <ProtectedRoute allowedRoles={["chef"]}>
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--cs-surface-1)" }}>
        {/* ── Desktop rail ──
            Structural chrome, so it takes the heavier material and sits a
            step back from the content plane. */}
        <motion.aside
          animate={{ width: collapsed ? 56 : 224 }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : SPRING.default}
          className="fixed left-0 top-0 z-40 hidden md:flex h-full flex-col"
          style={{
            borderRight: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
          }}
        >
          <div className="flex h-14 items-center justify-between px-3 shrink-0">
            {collapsed ? (
              /* Collapsed, the mark drops its label and keeps its glyph —
                 same object, less of it, rather than a different glyph
                 appearing in its place. */
              <button
                onClick={() => setCollapsed(false)}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 hover:bg-(--cs-hover) active:scale-90"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChefHatIcon
                  size={15}
                  weight="duotone"
                  className="text-black dark:text-white"
                />
              </button>
            ) : (
              <>
                <StudioLogo />
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-90"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  <SidebarSimpleIcon size={15} />
                </button>
              </>
            )}
          </div>

          <NavLinks pathname={pathname} collapsed={collapsed} layoutGroup="rail" />
        </motion.aside>

        {/* ── Main ── */}
        <div
          className={[
            "flex-1 flex flex-col min-w-0",
            "transition-[margin] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
            collapsed ? "md:ml-14" : "md:ml-56",
          ].join(" ")}
        >
            {/* Translucent bar with content running underneath it. */}
            <header
              className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 md:px-6 shrink-0"
              style={{
                backgroundColor: "var(--cs-material-regular)",
                backdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
                WebkitBackdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
                borderBottom: `1px solid ${scrolled ? "var(--cs-border-subtle)" : "transparent"}`,
                transition: "border-color 200ms ease",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-90"
                      style={{ color: "var(--cs-text-secondary)" }}
                      aria-label="Open navigation"
                    >
                      <ListIcon size={17} />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-60 p-0 flex flex-col gap-0"
                    style={{ backgroundColor: "var(--cs-surface-2)" }}
                  >
                    <SheetHeader
                      className="px-3 h-14 justify-center shrink-0"
                      style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                    >
                      <SheetTitle asChild>
                        <StudioLogo />
                      </SheetTitle>
                    </SheetHeader>
                    <NavLinks
                      pathname={pathname}
                      onNavigate={() => setSheetOpen(false)}
                      layoutGroup="sheet"
                    />
                  </SheetContent>
                </Sheet>

                {/* Vibrancy: text over a translucent surface wants a touch
                    more weight and contrast than it would need over a solid
                    one, since what's behind it keeps changing. */}
                {/* Desktop names the section, because the rail already
                    carries the wordmark. On phones the rail is behind a
                    sheet, so the bar carries the mark instead. */}
                <span
                  className="hidden md:inline text-sm font-medium tracking-[-0.006em] truncate"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {activeLabel}
                </span>
                <span className="flex md:hidden min-w-0">
                  <StudioLogo />
                </span>
              </div>

              <div className="flex items-center gap-1.5">
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
