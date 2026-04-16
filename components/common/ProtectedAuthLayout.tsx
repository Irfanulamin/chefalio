"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedAuthLayout({ children }: AuthLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isLoading) return null;

  if (isAuthenticated) {
    if (user?.role === "user") {
      router.replace("/recipes");
    } else if (user?.role === "chef") {
      router.replace("/settings/chef");
    } else {
      router.replace("/");
    }

    return null;
  }

  return <>{children}</>;
}
