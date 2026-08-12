"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { PRIMARY_NAV, SETTINGS_NAV, type NavItem } from "./navigation";

/**
 * Phone navigation.
 *
 * The rail is the wrong shape for a phone — it eats a third of the width
 * and lives under the least reachable part of the screen — so below `md`
 * navigation moves to a bottom bar, where a thumb already rests. Account
 * and notifications stay in the top bar at every size.
 *
 * It is a translucent material with content passing underneath rather than
 * an opaque strip that permanently costs the page a band of height.
 */

const TAB_ITEMS: NavItem[] = [...PRIMARY_NAV, SETTINGS_NAV];

export function MobileTabBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Main"
      className="material-thick fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around md:hidden"
      style={{
        borderInline: "none",
        borderBottom: "none",
        borderRadius: 0,
        /* Clears the home indicator on phones that have one, without
           padding a gap on those that don't. */
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TAB_ITEMS.map(({ label, href, Icon }) => {
        const active = isActive(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="focus-ring relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-transform duration-150 active:scale-[0.94] motion-reduce:active:scale-100"
            style={{
              color: active
                ? "var(--cs-accent-text)"
                : "var(--cs-text-tertiary)",
            }}
          >
            {/* The same travelling indicator as the sidebar, so the two
                layouts read as one product seen at two widths. */}
            {active && (
              <motion.span
                aria-hidden
                layoutId={reduce ? undefined : "tabbar-active"}
                className="absolute inset-x-3 top-0 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--cs-accent-text)" }}
                transition={SPRING.snappy}
              />
            )}

            <Icon size={21} weight={active ? "fill" : "regular"} />
            <span className="ui-micro font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
