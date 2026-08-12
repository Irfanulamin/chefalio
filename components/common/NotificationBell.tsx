"use client";

import { useEffect, useRef, useState } from "react";
import {
  BellIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  TagIcon,
  ImageSquareIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.type";
import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { SPRING } from "@/lib/motion";
import { timeAgo } from "@/lib/time";
import { notificationHref } from "@/lib/notification-link";

/**
 * The type glyph doubles as the avatar fallback, so a notification with
 * no actor picture and one whose picture is dead look the same. It used
 * to be amber / blue / emerald chips — three hues that appear nowhere
 * else in the product — so the tray was the most colourful surface in
 * the app while carrying the least important information.
 */
function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  const Icon =
    type === "new_recipe"
      ? ForkKnifeIcon
      : type === "new_cookbook"
        ? BookOpenIcon
        : TagIcon;

  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{
        backgroundColor: "var(--cs-accent-muted)",
        color: "var(--cs-accent-text)",
      }}
    >
      <Icon size={15} weight="fill" />
    </span>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, isLoading, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    // A panel you can open with the keyboard has to be closable with it.
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleOpen() {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) markAllRead();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleOpen}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        className="focus-ring relative rounded-md p-1.5 transition-colors"
        style={{ color: open ? "var(--cs-text-primary)" : "var(--cs-text-secondary)" }}
      >
        <BellIcon size={20} weight={open ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span
            className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full"
            style={{
              backgroundColor: "var(--cs-danger-fg)",
              boxShadow: "0 0 0 1.5px var(--cs-surface-1)",
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          /* Scales from its top-right corner — the button it came from —
             rather than out of its own middle, so the panel reads as
             belonging to the bell. */
          <motion.div
            role="dialog"
            aria-label="Notifications"
            className="material-thick absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl"
            style={{ transformOrigin: "top right" }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -6 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
            transition={SPRING.snappy}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
            >
              <span className="ui-subheading" style={{ color: "var(--cs-text-primary)" }}>
                Notifications
              </span>
              {notifications.length > 0 && (
                <span
                  className="ui-micro ui-numeric"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {notifications.length} total
                </span>
              )}
            </div>

            <div className="scroll-panel max-h-96">
              {isLoading ? (
                <div
                  className="ui-caption flex h-24 items-center justify-center"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  Loading…
                </div>
              ) : notifications.length === 0 ? (
                <div
                  className="flex h-32 flex-col items-center justify-center gap-2"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  <BellIcon size={22} aria-hidden />
                  <p className="ui-caption">Nothing yet</p>
                  <p className="ui-micro max-w-[15rem] text-center">
                    New recipes and cookbooks from chefs you follow land here.
                  </p>
                </div>
              ) : (
                <ul>
                  {notifications.map((n) => {
                    const href = notificationHref(n);
                    const Row = href ? Link : "div";

                    return (
                    <li key={n._id}>
                    <Row
                      {...(href ? { href, onClick: () => setOpen(false) } : {})}
                      className="ui-row focus-ring flex items-start gap-3 px-4 py-3"
                    >
                      <SafeImage
                        src={n.actorAvatar}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                        fallback={<NotificationIcon type={n.type} />}
                      />

                      <div className="min-w-0 flex-1">
                        <p
                          className="ui-micro font-semibold leading-snug"
                          style={{ color: "var(--cs-text-primary)" }}
                        >
                          {n.title}
                        </p>
                        <p
                          className="ui-micro mt-0.5 line-clamp-2 leading-relaxed"
                          style={{ color: "var(--cs-text-secondary)" }}
                        >
                          {n.message}
                        </p>
                        <p
                          className="ui-micro mt-1"
                          style={{ color: "var(--cs-text-tertiary)" }}
                        >
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>

                      {/* The slot is always drawn once a notification has
                          any thumbnail intent, so a dead URL doesn't
                          collapse the row's layout to a different shape
                          from its neighbours. */}
                      {n.thumbnail && (
                        <div
                          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md"
                          style={{ backgroundColor: "var(--cs-surface-3)" }}
                        >
                          <SafeImage
                            src={n.thumbnail}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                            fallback={
                              <span
                                aria-hidden
                                className="flex h-full w-full items-center justify-center"
                                style={{ color: "var(--cs-text-tertiary)" }}
                              >
                                <ImageSquareIcon size={16} />
                              </span>
                            }
                          />
                        </div>
                      )}
                    </Row>
                    </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
