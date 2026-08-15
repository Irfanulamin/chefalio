"use client";

import { useEffect } from "react";
import { WarningIcon, HouseLineIcon, ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";
import { useProfile } from "@/hooks/useAuth";
import {
  StatusPage,
  StatusSecondaryAction,
  StatusButtonAction,
  useHomeHref,
} from "@/components/common/StatusPage";

/**
 * The runtime error boundary — catches whatever the 404 page doesn't:
 * something in a Server or Client Component actually throwing. Next.js
 * requires this to be a Client Component and hands it `reset`, which
 * re-renders the boundary's subtree rather than reloading the page —
 * worth trying first, since plenty of these are transient (a flaky
 * request, a race on first paint) rather than a real, sticky bug.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { profile } = useProfile();
  const homeHref = useHomeHref(profile);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Something went wrong"
      icon={WarningIcon}
      title="That didn't work"
      description="The page hit an error loading. It might be temporary — try again, or head back to something that works."
      actions={
        <>
          <StatusButtonAction variant="primary" onClick={() => reset()}>
            <ArrowClockwiseIcon size={16} weight="bold" />
            Try again
          </StatusButtonAction>
          <StatusSecondaryAction href={homeHref}>
            <HouseLineIcon size={16} weight="bold" />
            Take me home
          </StatusSecondaryAction>
        </>
      }
    />
  );
}
