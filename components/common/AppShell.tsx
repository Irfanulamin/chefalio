"use client";

import { AppSidebar } from "./AppSidebar";
import { UserTopBar } from "./UserTopBar";
import { MobileTabBar } from "./MobileChrome";

/**
 * The authenticated app's frame.
 *
 * A rail on the left, a translucent bar across the top, content underneath
 * — the same shape as Chef Studio and Admin, so moving between the three
 * reads as changing mode rather than changing product.
 *
 * The page itself is the only thing that scrolls: the rail is `sticky`
 * against the document rather than a separate scroll container, which is
 * what keeps the browser's own scroll restoration, find-in-page and anchor
 * links working. Nested scrollers are the usual reason an app shell feels
 * subtly broken.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "var(--cs-surface-1)" }}>
      {/* Full bleed. Capping the shell and centring it left a dead gutter
          down the outside of the rail, which is the one thing that reads as
          "web page in a wrapper" rather than an application. */}
      <div className="flex w-full items-start">
        <AppSidebar />

        {/* `min-w-0` is load-bearing: without it a long unbroken string or a
            wide table inside the column would push the flex item past its
            share and force the whole shell to scroll sideways. */}
        <div
          className="flex min-w-0 flex-1 flex-col"
          style={{ minHeight: "100vh" }}
        >
          <UserTopBar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}

export default AppShell;
