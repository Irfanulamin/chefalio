"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GridLoader } from "../ui/GridLoading";

export type AllowedRole = "user" | "chef" | "admin";

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
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background animate-in fade-in duration-300 [animation-delay:2s] fill-mode-both opacity-0">
        <GridLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect(redirectTo);
  }

  if (
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(user?.role as AllowedRole)
  ) {
    redirect(unauthorizedRedirect);
  }

  return <>{children}</>;
}
