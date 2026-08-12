import ProtectedRoute from "@/components/common/ProtectedRoute";
import { AppShell } from "@/components/common/AppShell";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["user", "chef"]}>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
