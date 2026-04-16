import ProtectedAuthLayout from "@/components/common/ProtectedAuthLayout";

export default function GuestAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedAuthLayout>
      <div className="min-h-screen">{children}</div>
    </ProtectedAuthLayout>
  );
}
