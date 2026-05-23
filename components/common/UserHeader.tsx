"use client";

import { useState, useEffect } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
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
  const isChef = profile?.role === "chef";

  const navLinks = isChef ? BASE_NAV_LINKS : [...BASE_NAV_LINKS, BECOME_CHEF_LINK];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-shadow duration-200"
      style={{
        backgroundColor: "var(--cs-surface-1)",
        borderBottom: scrolled
          ? "1px solid var(--cs-border-subtle)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 8px 0 rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight select-none"
            style={{ color: "var(--cs-accent)" }}
          >
            Chefalio
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-150 group"
                  style={{
                    color: isActive
                      ? "var(--cs-text-primary)"
                      : "var(--cs-text-secondary)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px transition-all duration-300"
                    style={{
                      backgroundColor: "var(--cs-accent)",
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <ToggleThemeButton />
            <NotificationBell />
            <ProfileDropdown />
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <ToggleThemeButton />
            <NotificationBell />
            <ProfileDropdown />
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-md transition-colors duration-150"
                  style={{ color: "var(--cs-text-primary)" }}
                  aria-label="Open menu"
                >
                  {sheetOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="px-0 pb-8">
                <SheetHeader className="px-6 pt-6 pb-2">
                  <SheetTitle
                    className="text-2xl font-extrabold tracking-tight"
                    style={{ color: "var(--cs-accent)" }}
                  >
                    Chefalio
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col px-6 mt-4 gap-0">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setSheetOpen(false)}
                        className="py-3 text-base font-medium transition-colors duration-150"
                        style={{
                          color: isActive
                            ? "var(--cs-accent)"
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
    </header>
  );
};
