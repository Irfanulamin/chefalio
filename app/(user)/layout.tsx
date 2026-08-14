"use client";

import { ConsoleShell } from "@/components/common/ConsoleShell";
import { MobileTabBar } from "@/components/common/MobileChrome";
import { useProfile } from "@/hooks/useAuth";
import {
  PRIMARY_NAV,
  SETTINGS_NAV,
  BECOME_CHEF_NAV,
  CHEF_STUDIO_NAV,
} from "@/components/common/navigation";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useProfile();
  const isChef = profile?.role === "chef";

  const navItems = [
    ...PRIMARY_NAV,
    isChef ? CHEF_STUDIO_NAV : BECOME_CHEF_NAV,
    SETTINGS_NAV,
  ];

  return (
    <>
      <ConsoleShell
        navItems={navItems}
        logoPrefix="Chefalio"
        logoHref="/recipes"
        logoIcon={ForkKnifeIcon}
        allowedRoles={["user", "chef"]}
      >
        {children}
      </ConsoleShell>
      <MobileTabBar />
    </>
  );
}
