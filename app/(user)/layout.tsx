import { AuthenticatedFooter } from "@/components/common/AuthenticatedFooter";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { UserHeader } from "@/components/common/UserHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <UserHeader />
      <div className="min-h-screen container max-w-7xl mx-auto px-1.5 md:px-3 xl:px-0 ">
        {children}
      </div>
      <AuthenticatedFooter
        links={[
          { label: "Recipes", href: "/recipes" },
          { label: "Cookbooks", href: "/cookbooks" },
          { label: "Activity", href: "/activity" },
          { label: "Chefs", href: "/chefs" },
        ]}
      />
    </ProtectedRoute>
  );
}
