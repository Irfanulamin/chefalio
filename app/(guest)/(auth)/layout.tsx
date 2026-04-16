import ProtectedAuthLayout from "@/components/common/ProtectedAuthLayout";

export default function GuestAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAuthLayout>{children}</ProtectedAuthLayout>;
}
