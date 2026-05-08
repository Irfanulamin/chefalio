"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import axiosInstance from "@/hooks/axios/interceptors";
import type {
  AppNotification,
  NotificationsResponse,
} from "@/types/notification.type";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000";

export function useNotifications() {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  // Local list — seeded from REST, then updated by socket pushes
  const [liveNotifications, setLiveNotifications] = useState<
    AppNotification[]
  >([]);
  const [lastReadAt, setLastReadAt] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);

  // ── Fetch persisted notifications from REST ─────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axiosInstance
        .get<NotificationsResponse>("/notifications")
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Seed local state once REST data arrives
  useEffect(() => {
    if (data && !initialized) {
      setLiveNotifications(data.data);
      setLastReadAt(data.lastReadAt ? new Date(data.lastReadAt) : null);
      setInitialized(true);
    }
  }, [data, initialized]);

  // ── Socket.IO connection ────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("notification", (notification: AppNotification) => {
      setLiveNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Unread count ────────────────────────────────────────────────────────────
  const unreadCount = liveNotifications.filter((n) => {
    if (!lastReadAt) return true;
    return new Date(n.createdAt) > lastReadAt;
  }).length;

  // ── Mark all read ───────────────────────────────────────────────────────────
  const markAllRead = useMutation({
    mutationFn: () =>
      axiosInstance.patch("/notifications/mark-read").then((r) => r.data),
    onSuccess: () => {
      const now = new Date();
      setLastReadAt(now);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: liveNotifications,
    unreadCount,
    isLoading,
    markAllRead: () => markAllRead.mutate(),
  };
}
