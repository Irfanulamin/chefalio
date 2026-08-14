"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserPlusIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { useFollowStatus, useFollowChef, useUnfollowChef } from "@/hooks/useFollow";
import { useProfile } from "@/hooks/useAuth";
import { SPRING } from "@/lib/motion";

/**
 * Follow/unfollow, with the "you're already following" state distinct
 * enough to notice at a glance but quiet enough not to compete with the
 * chef's name it sits beside — a filled pill going hollow, not a colour
 * swap that reads the same weight either way.
 */
export function FollowButton({
  chefId,
  chefUsername,
}: {
  chefId: string;
  /** `/auth/profile` doesn't carry the viewer's own id, only their
     username — that's what the self-follow check compares against. */
  chefUsername: string;
}) {
  const { profile } = useProfile();
  const { status, isLoading } = useFollowStatus(chefId);
  const follow = useFollowChef();
  const unfollow = useUnfollowChef();
  const reduce = useReducedMotion();

  // Not for your own profile, and not before we know who's asking.
  if (!profile || profile.username === chefUsername) return null;
  if (isLoading || !status) {
    return (
      <span
        className="inline-block h-9 w-28 animate-pulse rounded-xl"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      />
    );
  }

  const { isFollowing } = status;
  const pending = follow.isPending || unfollow.isPending;

  return (
    <motion.button
      type="button"
      disabled={pending}
      onClick={() => (isFollowing ? unfollow.mutate(chefId) : follow.mutate(chefId))}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={SPRING.snappy}
      className="focus-ring flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
      style={
        isFollowing
          ? {
              border: "1px solid var(--cs-border-default)",
              color: "var(--cs-text-primary)",
              backgroundColor: "var(--cs-surface-1)",
            }
          : {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }
      }
    >
      {isFollowing ? (
        <>
          <CheckIcon size={15} weight="bold" />
          Following
        </>
      ) : (
        <>
          <UserPlusIcon size={15} weight="bold" />
          Follow
        </>
      )}
    </motion.button>
  );
}

export default FollowButton;
