"use client";

import { useState, useEffect } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CaretRightIcon,
  ChefHatIcon,
  ForkKnifeIcon,
  PathIcon,
  QuestionIcon,
  SignOutIcon,
  SparkleIcon,
  TagIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
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
  { label: "Recipes", href: "/recipes", icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/cookbooks", icon: BookOpenIcon },
  { label: "Chefs", href: "/chefs", icon: ChefHatIcon },
] as const;

// Guests land on the marketing page, so they get section anchors instead of
// app routes they cannot reach yet. Names are specific on purpose — a nav
// item should say what's behind it, not sit under a vague umbrella.
const GUEST_LINKS = [
  { label: "Who it's for", href: "/#personas", icon: UsersThreeIcon },
  { label: "Features", href: "/#features", icon: SparkleIcon },
  { label: "How it works", href: "/#how-it-works", icon: PathIcon },
  { label: "Pricing", href: "/#pricing", icon: TagIcon },
  { label: "FAQ", href: "/#faq", icon: QuestionIcon },
] as const;

/** Past this, the bar condenses into a floating pill. */
const CONDENSE_AT = 24;

export const Header = () => {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    // Hysteresis, so a bar sitting exactly on the threshold doesn't flicker
    // between its two states as the page settles.
    const onScroll = () => {
      const y = window.scrollY;
      setCondensed((was) => (was ? y > CONDENSE_AT - 12 : y > CONDENSE_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSheet = () => setSheetOpen(false);

  return (
    // Fixed, not sticky. Translucent chrome is supposed to float with content
    // passing underneath it — and a sticky bar also consumes a strip of flow
    // above the hero, which is what stopped `h-svh` from being one screen.
    // Fixed also means condensing can't shift the page below it.
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="px-3 transition-[padding] duration-300 ease-out md:px-5"
        style={{ paddingTop: condensed ? 10 : 0, paddingBottom: 0 }}
      >
        {/* The chrome itself. Translucent so content passes beneath it
            rather than stopping at an opaque strip, and it only takes on
            material weight once there is something underneath to separate
            from. */}
        <div
          className={`mx-auto flex items-center justify-between gap-4 transition-all duration-300 ease-out ${
            condensed
              ? "material max-w-5xl rounded-full px-4 py-2.5"
              : "max-w-7xl rounded-none border-transparent px-2 py-3.5"
          }`}
          style={
            condensed
              ? undefined
              : { backgroundColor: "transparent", boxShadow: "none" }
          }
        >
          <Link
            href="/"
            className="shrink-0 select-none text-xl font-extrabold tracking-tight md:text-2xl"
            style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
          >
            Chefalio
          </Link>

          {!isLoading && (
            <nav className="hidden items-center gap-1 lg:flex">
              {(user ? NAV_LINKS : GUEST_LINKS).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="type-caption rounded-full px-3 py-1.5 font-medium transition-colors duration-150"
                  style={{ color: "var(--cs-text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--cs-text-primary)";
                    e.currentTarget.style.backgroundColor =
                      "var(--cs-accent-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--cs-text-secondary)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {user ? (
              <>
                <NotificationBell />
                <ProfileDropdown />
              </>
            ) : (
              // One CTA, not two — this goes to sign-in, and the sign-in
              // screen itself links to sign-up for anyone who needs it. A
              // second nav button whose only job is "I don't have an
              // account yet" doesn't earn a permanent slot in the bar.
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                onClick={() => router.push("/sign-in")}
                className="type-caption cursor-pointer rounded-full px-4 py-2 font-semibold"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Get started
              </motion.button>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {!isLoading && user && (
              <>
                <NotificationBell />
                <ProfileDropdown />
              </>
            )}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                  className="cursor-pointer rounded-full p-2"
                  style={{ color: "var(--cs-text-primary)" }}
                  aria-label="Open menu"
                >
                  {sheetOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
                </motion.button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="gap-0 border-0 p-0"
                style={{ backgroundColor: "var(--cs-surface-1)" }}
              >
                {/* A warm wash at the top so the panel reads as part of the
                    landing page rather than a system drawer dropped on top. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-56"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 100% at 20% 0%, var(--cs-accent-muted), transparent 70%)",
                  }}
                />

                <SheetHeader className="relative px-6 pb-4 pt-6">
                  <SheetTitle
                    className="text-2xl font-extrabold"
                    style={{
                      color: "var(--cs-accent-text)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Chefalio
                  </SheetTitle>
                  <p
                    className="type-caption"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    Recipes and cookbooks from the pros
                  </p>
                </SheetHeader>

                {!isLoading && (
                  <nav className="relative flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-2">
                    {(user ? NAV_LINKS : GUEST_LINKS).map((link) => {
                      const Icon = link.icon;
                      return (
                        <motion.div
                          key={link.label}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.26,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={closeSheet}
                            className="flex items-center gap-3 rounded-2xl px-3 py-3"
                            style={{
                              backgroundColor: "var(--cs-surface-2)",
                              border: "1px solid var(--cs-border-subtle)",
                            }}
                          >
                            <span
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                              style={{
                                backgroundColor: "var(--cs-accent-muted)",
                              }}
                            >
                              <Icon
                                size={17}
                                weight="fill"
                                style={{ color: "var(--cs-accent-text)" }}
                              />
                            </span>
                            <span
                              className="type-subheading flex-1"
                              style={{ color: "var(--cs-text-primary)" }}
                            >
                              {link.label}
                            </span>
                            <CaretRightIcon
                              size={14}
                              style={{ color: "var(--cs-text-tertiary)" }}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                )}

                {!isLoading && (
                  <div
                    className="relative flex flex-col gap-2.5 p-4"
                    style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
                  >
                    {user ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                        onClick={() => {
                          logout();
                          router.push("/");
                          closeSheet();
                        }}
                        className="type-subheading inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full"
                        style={{
                          color: "var(--cs-text-primary)",
                          border: "1px solid var(--cs-border-default)",
                        }}
                      >
                        <SignOutIcon size={16} weight="bold" />
                        Log out
                      </motion.button>
                    ) : (
                      // Same one-CTA reasoning as the desktop bar — sign-in,
                      // which links to sign-up for anyone who needs it.
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                        onClick={() => {
                          router.push("/sign-in");
                          closeSheet();
                        }}
                        className="type-subheading inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }}
                      >
                        Start cooking free
                        <ArrowRightIcon size={15} weight="bold" />
                      </motion.button>
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
