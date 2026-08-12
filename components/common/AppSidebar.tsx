"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { useProfile } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/axios";
import { SPRING } from "@/lib/motion";
import { initialsOf } from "@/lib/recipe-display";
import { SafeImage } from "./SafeImage";
import {
  PRIMARY_NAV,
  SETTINGS_NAV,
  BECOME_CHEF_NAV,
  CHEF_STUDIO_NAV,
  type NavItem,
} from "./navigation";

/**
 * The app's primary navigation.
 *
 * This replaces a centred marketing header — wordmark left, links middle,
 * avatar right, footer at the bottom of every page. That shape belongs to
 * a site you visit; this is a tool people keep open, and the difference
 * shows up in the two things a header can't do: it can't keep navigation
 * on screen while you work, and it can't give notifications a permanent
 * home without hiding them behind a bell.
 *
 * It collapses rather than disappearing. At `md` it is a 76px icon rail —
 * the same destinations in the same order, just without their labels, so
 * muscle memory survives the breakpoint. Below `md` it hands over to the
 * bottom tab bar, which is where a thumb can actually reach it.
 */

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const reduce = useReducedMotion();
  const { label, href, Icon } = item;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      /* The label is hidden at `md`, so the icon needs to carry the name
         to a screen reader and to a hovering pointer. */
      title={label}
      className={[
        "focus-ring relative flex items-center gap-3.5 rounded-xl px-3 py-2.5",
        "transition-[color,background-color,transform] duration-150",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        active ? "" : "hover:bg-[var(--cs-hover)]",
      ].join(" ")}
      style={{
        color: active ? "var(--cs-accent-text)" : "var(--cs-text-secondary)",
      }}
    >
      {/* One indicator that travels between rows, rather than a background
          switching off here and on there. Because it is a single element
          Framer re-parents, pressing two items quickly redirects it
          mid-flight instead of queueing. */}
      {active && (
        <motion.span
          aria-hidden
          layoutId={reduce ? undefined : "sidebar-active-pill"}
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: "var(--cs-accent-muted)" }}
          transition={SPRING.snappy}
        />
      )}

      <Icon
        size={21}
        weight={active ? "fill" : "regular"}
        className="relative shrink-0"
      />
      <span className="relative hidden truncate text-[0.9375rem] font-medium xl:inline">
        {label}
      </span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const { logout } = useAuth();
  const isChef = profile?.role === "chef";

  /* "Become a chef" / "Chef Studio" used to sit below the list as a filled
     accent button. A fill is the loudest thing an interface can do and it
     was spending that on a destination most people visit once — it drew
     the eye away from the navigation every time the sidebar was in view.
     It is a destination like any other, so it reads like one. */
  const items: NavItem[] = [
    ...PRIMARY_NAV,
    isChef ? CHEF_STUDIO_NAV : BECOME_CHEF_NAV,
    SETTINGS_NAV,
  ];

  /* A section stays lit while you are anywhere inside it, so opening a
     recipe doesn't drop you into a state where nothing in the nav is
     selected and the answer to "where am I" is blank. The trailing slash
     is what keeps the match on segment boundaries — without it `/chef`
     would light up for `/chefs`. */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className="sticky top-0 hidden h-screen shrink-0 flex-col md:flex md:w-[76px] xl:w-[252px]"
      style={{
        borderRight: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-1)",
      }}
    >
      <div className="flex h-16 shrink-0 items-center px-4 xl:px-5">
        <Link
          href="/recipes"
          className="focus-ring select-none rounded-md text-2xl font-extrabold"
          style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
        >
          <span className="hidden xl:inline">Chefalio</span>
          {/* The mark alone at rail width. */}
          <span className="xl:hidden" aria-hidden>
            C
          </span>
          <span className="sr-only xl:hidden">Chefalio</span>
        </Link>
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => (
          <NavRow key={item.href} item={item} active={isActive(item.href)} />
        ))}

      </nav>

      {/* ── Account ──
          The menu behind the avatar already carries settings, role-aware
          navigation and log out, so this is the identity block it was
          missing, not a second copy of the menu. */}
      {/* Identity and the way out.
          The avatar menu and the theme toggle used to sit here too; both
          are in the top bar now, and a control that appears twice on one
          screen reads as an interface that hasn't decided where things
          live. What stays is the pair the bar doesn't carry: who you are
          signed in as, and how to stop being. */}
      <div
        className="mt-auto flex shrink-0 flex-col items-center gap-2 p-3 xl:flex-row"
        style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
      >
        <Link
          href="/settings"
          title={profile?.fullName || "Your account"}
          className="focus-ring flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.98] motion-reduce:active:scale-100"
        >
          <span
            className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--cs-accent-muted)" }}
          >
            <SafeImage
              src={profile?.profile_url}
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
              fallback={
                <span
                  className="text-[11px] font-bold"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  {initialsOf(profile?.fullName ?? "")}
                </span>
              }
            />
          </span>

          <span className="hidden min-w-0 flex-col xl:flex">
            <span
              className="truncate text-sm font-semibold leading-tight"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {profile?.fullName || "Your account"}
            </span>
            <span
              className="truncate text-xs leading-tight"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {profile?.username ? `@${profile.username}` : profile?.email}
            </span>
          </span>
        </Link>

        {/* Also in the account menu, but signing out is the one action
            people expect to find without opening anything. It stays quiet
            until hovered — a permanently red control in the corner of every
            screen reads as a warning rather than an exit. */}
        <button
          type="button"
          onClick={() => logout()}
          aria-label="Sign out"
          title="Sign out"
          className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 hover:bg-[var(--cs-danger-bg)] hover:text-[var(--cs-danger-fg)] active:scale-90 motion-reduce:active:scale-100"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          <SignOutIcon size={18} />
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
