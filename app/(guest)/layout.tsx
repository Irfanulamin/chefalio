import GuestOnlyRoute from "@/components/common/GuestOnlyRoute";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestOnlyRoute>
      {/* No background here — each auth screen paints its own light field,
          and an opaque wrapper would sit on top of it. */}
      <div className="min-h-svh">{children}</div>
    </GuestOnlyRoute>
  );
}
