"use client";

import { useState, useEffect } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { ToggleThemeButton } from "./ToggleThemeButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationBell } from "./NotificationBell";

const NAV_LINKS = [
  { label: "Recipes", href: "/recipes" },
  { label: "Cookbooks", href: "/cookbooks" },
  { label: "Chefs", href: "/chefs" },
] as const;

export const Header = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSheet = () => setSheetOpen(false);

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
          {user && (
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-medium transition-colors duration-150 group"
                  style={{ color: "var(--cs-text-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-secondary)")
                  }
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "var(--cs-accent)" }}
                  />
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <ToggleThemeButton />
            {user ? (
              <>
                <NotificationBell />
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button size="sm" onClick={() => router.push("/register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center gap-2">
            <ToggleThemeButton />
            {!isLoading && user && (
              <>
                <NotificationBell />
                <ProfileDropdown />
              </>
            )}
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

                {user && (
                  <nav className="flex flex-col px-6 mt-4 gap-0">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={closeSheet}
                        className="py-3 text-base font-medium transition-colors duration-150"
                        style={{
                          color: "var(--cs-text-secondary)",
                          borderBottom: "1px solid var(--cs-border-subtle)",
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                )}

                {!isLoading && (
                  <div className="flex flex-col gap-3 px-6 mt-6">
                    {user ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          logout();
                          router.push("/");
                          closeSheet();
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full"
                          onClick={() => {
                            router.push("/login");
                            closeSheet();
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={() => {
                            router.push("/register");
                            closeSheet();
                          }}
                        >
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
