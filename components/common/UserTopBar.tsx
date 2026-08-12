"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { NotificationBell } from "./NotificationBell";
import { ProfileDropdown } from "./ProfileDropdown";
import {
  PRIMARY_NAV,
  SETTINGS_NAV,
  BECOME_CHEF_NAV,
  CHEF_STUDIO_NAV,
} from "./navigation";

/**
 * The app's top bar, built like Chef Studio's and Admin's.
 *
 * Notifications and account used to live in a 340px column down the right
 * edge. It was the wrong shape for this product: a rail like that earns
 * its keep when it carries a continuous stream you read alongside your
 * work, and this carries a list you glance at a few times a day — so it
 * spent a fifth of the display permanently, and it made the user side look
 * like a different application from the two consoles next door.
 *
 * Here it is the same bar the studio and admin use: section name on the
 * left, notifications and account on the right, translucent so content
 * passes underneath instead of stopping at an opaque strip.
 *
 * The hairline is a scroll edge effect — it appears only once there is
 * something behind the bar to separate from, because a divider drawn
 * against blank space is a line for its own sake.
 */
export function UserTopBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    ...PRIMARY_NAV,
    SETTINGS_NAV,
    BECOME_CHEF_NAV,
    CHEF_STUDIO_NAV,
  ];

  const activeLabel =
    sections.find(
      (n) => pathname === n.href || pathname.startsWith(`${n.href}/`),
    )?.label ?? "Chefalio";

  return (
    <header
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 px-4 md:px-6"
      style={{
        backgroundColor: "var(--cs-material-regular)",
        backdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
        WebkitBackdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
        borderBottom: `1px solid ${
          scrolled ? "var(--cs-border-subtle)" : "transparent"
        }`,
        transition: "border-color 200ms ease",
      }}
    >
      {/* Desktop names the section, because the rail already carries the
          wordmark. Below `md` the rail is gone, so the bar carries the mark
          instead — the same swap the studio makes. */}
      <span
        className="hidden truncate text-sm font-medium tracking-[-0.006em] md:inline"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {activeLabel}
      </span>

      <Link
        href="/recipes"
        className="focus-ring select-none rounded-md text-xl font-extrabold md:hidden"
        style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
      >
        Chefalio
      </Link>

      <div className="flex items-center gap-1.5">
        <NotificationBell />
        <ToggleThemeButton />
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default UserTopBar;
