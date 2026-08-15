"use client";

import { useRouter } from "next/navigation";
import { HouseLineIcon, ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { useProfile } from "@/hooks/useAuth";
import {
  StatusPage,
  StatusPrimaryAction,
  StatusButtonAction,
  useHomeHref,
} from "@/components/common/StatusPage";

/**
 * The catch-all for any URL that doesn't match a route at all — including
 * ones outside every route group, which is why this can't lean on
 * `ConsoleShell` (that requires an authenticated layout context this page
 * may never have).
 *
 * The scoped `not-found.tsx` files (recipes, cookbooks, chefs) stay as they
 * are — this is only the fallback for everything those don't cover.
 */
export default function NotFound() {
  const router = useRouter();
  const { profile } = useProfile();
  const homeHref = useHomeHref(profile);

  return (
    <StatusPage
      eyebrow="404"
      title="This page doesn't exist"
      description="The link might be broken, or the page may have moved. Let's get you back to something real."
      actions={
        <>
          <StatusPrimaryAction href={homeHref}>
            <HouseLineIcon size={16} weight="bold" />
            Take me home
          </StatusPrimaryAction>
          <StatusButtonAction onClick={() => router.back()}>
            <ArrowLeftIcon size={16} weight="bold" />
            Go back
          </StatusButtonAction>
        </>
      }
    />
  );
}
