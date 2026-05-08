"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GridLoader } from "../ui/GridLoading";

export default function GuestOnlyRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "chef") router.replace("/chef/dashboard");
      else if (user?.role === "admin") router.replace("/admin/dashboard");
      else router.replace("/recipes");
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <GridLoader />
      </div>
    );
  }

  return <>{children}</>;
}
