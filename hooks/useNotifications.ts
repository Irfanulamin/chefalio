"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import axiosInstance from "@/hooks/axios/interceptors";
import type {
  AppNotification,
  NotificationsResponse,
} from "@/types/notification.type";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000";

const POLL_INTERVAL_MS = 30_000;

/**
 * A pushed item, tagged with when it arrived.
 *
 * The tag is what lets a pushed item be retired without consulting the
 * clock during render: it is compared against the timestamp of the last
 * REST snapshot, not against "now".
 */
type PushedNotification = AppNotification & { receivedAt: number };

export function useNotifications() {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  /** Items the socket delivered that the REST list may not carry yet. */
  const [pushed, setPushed] = useState<PushedNotification[]>([]);

  /** Set optimistically by "mark all read"; otherwise the server's value wins. */
  const [readAtOverride, setReadAtOverride] = useState<Date | null>(null);

  // Always fetch fresh on mount + refocus; poll as a socket fallback.
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axiosInstance
        .get<NotificationsResponse>("/notifications")
        .then((r) => r.data),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: POLL_INTERVAL_MS,
  });

  // Socket.IO — real-time push.
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("notification", (notification: AppNotification) => {
      setPushed((prev) =>
        prev.some((n) => n._id === notification._id)
          ? prev
          : [{ ...notification, receivedAt: Date.now() }, ...prev],
      );
    });

    /* The subject was deleted. Drop it now rather than leaving it on screen
       until the next poll — it is currently showing a title and thumbnail
       for something that no longer exists, and linking to a page that
       would 404. */
    socket.on("notification:removed", ({ targetId }: { targetId: string }) => {
      setPushed((prev) =>
        prev.filter((n) => String(n.targetId ?? "") !== targetId),
      );
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const restItems = useMemo(() => data?.data ?? [], [data]);

  /**
   * The merged list, derived during render rather than mirrored into state
   * by an effect. The old version copied the query result into a `useState`
   * inside `useEffect`, which is a second source of truth for data the
   * query already owns — and it re-rendered twice on every poll.
   */
  const notifications = useMemo(() => {
    const restIds = new Set(restItems.map((n) => n._id));

    /* A pushed item survives only until a REST snapshot newer than it has
       had the chance to include it.

       "Absent from REST" has two causes: the write hasn't landed yet, or
       the notification was deleted server-side because its recipe was.
       Keeping everything absent treated the second as the first, so a
       deleted notification survived in this tab until a full reload.
       Comparing against the snapshot's own timestamp separates them
       without reading the clock mid-render. */
    const pending = pushed.filter(
      (n) => !restIds.has(n._id) && n.receivedAt > dataUpdatedAt,
    );

    return [...pending, ...restItems];
  }, [restItems, pushed, dataUpdatedAt]);

  const serverReadAt = data?.lastReadAt ? new Date(data.lastReadAt) : null;

  /* The optimistic value only wins while it is ahead of the server's, so a
     later refetch can't roll the badge back to unread. */
  const lastReadAt =
    readAtOverride && (!serverReadAt || readAtOverride > serverReadAt)
      ? readAtOverride
      : serverReadAt;

  const unreadCount = notifications.filter(
    (n) => !lastReadAt || new Date(n.createdAt) > lastReadAt,
  ).length;

  const markAllRead = useMutation({
    mutationFn: () =>
      axiosInstance.patch("/notifications/mark-read").then((r) => r.data),
    onSuccess: () => {
      setReadAtOverride(new Date());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAllRead: () => markAllRead.mutate(),
  };
}
