"use client";

import { useEffect, useRef, useState } from "react";
import {
  BellIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { useNotifications } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.type";
import Image from "next/image";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "new_recipe")
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0">
        <ForkKnifeIcon size={15} weight="fill" className="text-amber-600 dark:text-amber-400" />
      </span>
    );
  if (type === "new_cookbook")
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
        <BookOpenIcon size={15} weight="fill" className="text-blue-600 dark:text-blue-400" />
      </span>
    );
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 shrink-0">
      <TagIcon size={15} weight="fill" className="text-emerald-600 dark:text-emerald-400" />
    </span>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, isLoading, markAllRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleOpen() {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      markAllRead();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <BellIcon size={20} weight={open ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-background" />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{
            backgroundColor: "var(--cs-surface-1)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
          >
            <span className="text-sm font-semibold text-foreground">
              Notifications
            </span>
            {notifications.length > 0 && (
              <span className="text-xs text-zinc-400">
                {notifications.length} total
              </span>
            )}
          </div>

          {/* List */}
          <div
            className="max-h-96 overflow-y-auto"
            style={{ borderTop: "none" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-24 text-xs text-zinc-400">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-zinc-400">
                <BellIcon size={22} />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Actor avatar or type icon */}
                  {n.actorAvatar ? (
                    <Image
                      src={n.actorAvatar}
                      alt={n.actorName ?? ""}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <NotificationIcon type={n.type} />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {n.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Thumbnail */}
                  {n.thumbnail && (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={n.thumbnail}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
