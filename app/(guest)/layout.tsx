import Footer from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import GuestOnlyRoute from "@/components/common/GuestOnlyRoute";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestOnlyRoute>
      <Header />
      {children}
      <Footer />
    </GuestOnlyRoute>
  );
}
