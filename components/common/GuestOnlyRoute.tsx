"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GridLoader } from "../ui/GridLoading";

export default function GuestOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background animate-in fade-in duration-300 [animation-delay:2s] fill-mode-both opacity-0">
        <GridLoader />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "chef") redirect("/chef/dashboard");
    if (user?.role === "admin") redirect("/admin/dashboard");
    redirect("/recipes");
  }

  return <>{children}</>;
}
