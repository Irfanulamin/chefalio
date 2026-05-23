import GuestOnlyRoute from "@/components/common/GuestOnlyRoute";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestOnlyRoute>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--cs-surface-1)" }}
      >
        {children}
      </div>
    </GuestOnlyRoute>
  );
}
