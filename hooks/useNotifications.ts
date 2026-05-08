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

  const [liveNotifications, setLiveNotifications] = useState<AppNotification[]>([]);
  const [lastReadAt, setLastReadAt] = useState<Date | null>(null);

  // Always fetch fresh on mount + refocus; poll every 30s as socket fallback
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axiosInstance
        .get<NotificationsResponse>("/notifications")
        .then((r) => r.data),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  // Merge REST data with any socket-only items not yet persisted in DB
  useEffect(() => {
    if (!data) return;
    setLastReadAt(data.lastReadAt ? new Date(data.lastReadAt) : null);
    setLiveNotifications((prev) => {
      const restIds = new Set(data.data.map((n) => n._id));
      // Keep socket-delivered items that REST hasn't returned yet (brief delay)
      const socketOnly = prev.filter((n) => !restIds.has(n._id));
      return [...socketOnly, ...data.data];
    });
  }, [data]);

  // Socket.IO — real-time push
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("notification", (notification: AppNotification) => {
      setLiveNotifications((prev) => {
        // Skip if polling already added it
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const unreadCount = liveNotifications.filter((n) => {
    if (!lastReadAt) return true;
    return new Date(n.createdAt) > lastReadAt;
  }).length;

  const markAllRead = useMutation({
    mutationFn: () =>
      axiosInstance.patch("/notifications/mark-read").then((r) => r.data),
    onSuccess: () => {
      setLastReadAt(new Date());
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
