"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type AllowedRole = "user" | "chef" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
  redirectTo?: string;
  unauthorizedRedirect?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
  unauthorizedRedirect = "/unauthorized",
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    redirect(redirectTo);
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user?.role as AllowedRole);
    if (!hasRole) {
      redirect(unauthorizedRedirect);
    }
  }

  return <>{children}</>;
}
