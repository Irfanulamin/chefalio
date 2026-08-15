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

  // Chef Studio leads the list for a chef — it's the destination that
  // matters most to them, not one more item after the browsing nav. Become
  // a chef stays where it was: it's a pitch to a member, not a mode switch,
  // so it doesn't compete for the top slot.
  const navItems = isChef
    ? [CHEF_STUDIO_NAV, ...PRIMARY_NAV, SETTINGS_NAV]
    : [...PRIMARY_NAV, BECOME_CHEF_NAV, SETTINGS_NAV];

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
