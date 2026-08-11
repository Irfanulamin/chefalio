"use client";

import { useState, useEffect } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { ToggleThemeButton } from "./ToggleThemeButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationBell } from "./NotificationBell";
import { useProfile } from "@/hooks/useAuth";
import { SPRING } from "@/lib/motion";

const BASE_NAV_LINKS = [
  { label: "Recipes", href: "/recipes" },
  { label: "Cookbooks", href: "/cookbooks" },
  { label: "Chefs", href: "/chefs" },
  { label: "Activity", href: "/activity" },
  { label: "Settings", href: "/settings" },
];

const BECOME_CHEF_LINK = { label: "Become a Chef", href: "/apply-chef" };

export const UserHeader = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { profile } = useProfile();
  const reduce = useReducedMotion();
  const isChef = profile?.role === "chef";

  const navLinks = isChef ? BASE_NAV_LINKS : [...BASE_NAV_LINKS, BECOME_CHEF_LINK];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* Translucent, like the landing header: content passes underneath the
       bar rather than stopping at an opaque strip. It only takes on
       material weight once there is something under it to separate from —
       an unscrolled page has nothing to float above, and a bar that
       shadows itself against blank space is just a line. */
    <header
      className={`sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? "material-thick" : ""
      }`}
      style={
        scrolled
          ? { borderInline: "none", borderTop: "none", borderRadius: 0 }
          : { backgroundColor: "transparent", border: "none", boxShadow: "none" }
      }
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* The raw brand lime fails contrast on white, which is why the
              landing wordmark uses the deepened token. This one didn't. */}
          <Link
            href="/"
            className="focus-ring shrink-0 select-none rounded-md text-2xl font-extrabold"
            style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
          >
            Chefalio
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="focus-ring relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive
                      ? "var(--cs-text-primary)"
                      : "var(--cs-text-secondary)",
                  }}
                >
                  {link.label}
                  {/* One indicator that travels between items, rather than
                      a per-link underline growing from 0% — same reasoning
                      as the segmented control. */}
                  {isActive && (
                    <motion.span
                      layoutId={reduce ? undefined : "user-nav-indicator"}
                      aria-hidden
                      className="absolute inset-x-3 -bottom-0.5 h-px"
                      style={{ backgroundColor: "var(--cs-accent-text)" }}
                      transition={SPRING.snappy}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ToggleThemeButton />
            <NotificationBell />
            <ProfileDropdown />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ToggleThemeButton />
            <NotificationBell />
            <ProfileDropdown />
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="focus-ring rounded-md p-2 transition-colors duration-150"
                  style={{ color: "var(--cs-text-primary)" }}
                  aria-label={sheetOpen ? "Close menu" : "Open menu"}
                  aria-expanded={sheetOpen}
                >
                  {sheetOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="px-0 pb-8">
                <SheetHeader className="px-6 pb-2 pt-6">
                  <SheetTitle
                    className="text-2xl font-extrabold"
                    style={{
                      color: "var(--cs-accent-text)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Chefalio
                  </SheetTitle>
                </SheetHeader>

                <nav aria-label="Main" className="mt-4 flex flex-col px-6">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className="focus-ring py-3 text-base font-medium transition-colors duration-150"
                        style={{
                          color: isActive
                            ? "var(--cs-accent-text)"
                            : "var(--cs-text-secondary)",
                          borderBottom: "1px solid var(--cs-border-subtle)",
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* A soft fade where the bar overlaps content, instead of a hard
          1px rule — the scroll edge effect the landing page uses. */}
      {scrolled && (
        <div
          aria-hidden
          className="scroll-edge pointer-events-none absolute inset-x-0 top-full h-4"
        />
      )}
    </header>
  );
};
