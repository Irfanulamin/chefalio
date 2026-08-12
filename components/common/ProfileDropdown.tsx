"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/axios";
import {
  ForkKnifeIcon,
  GearSixIcon,
  SignOutIcon,
  BookOpenIcon,
  UsersIcon,
  ChefHatIcon,
  ShieldCheckIcon,
  PulseIcon,
  UsersFourIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useProfile } from "@/hooks/useAuth";
import { SafeImage } from "@/components/common/SafeImage";
import { initialsOf } from "@/lib/recipe-display";

/**
 * The account menu.
 *
 * Rebuilt around one question: what is this menu *for*? It was carrying
 * three things at once — an identity card, a read-only copy of that same
 * identity, and the app's navigation — and the middle one was pure
 * duplication. The header showed your name and email, then two more rows
 * below repeated your username and email again, as `DropdownMenuItem`s
 * with `cursor-default`. Being menu items, they took keyboard focus: arrowing
 * down through the menu stopped twice on rows that don't do anything. They're
 * gone; the header is the identity block.
 *
 * The rest follows Apple's guidance fairly directly:
 *
 * - **The menu is a material**, not an opaque card — translucent with a
 *   blur and a float shadow, so it reads as a layer above the page rather
 *   than a rectangle pasted onto it. The base component already anchors its
 *   transform-origin to the trigger, so it scales out of the avatar you
 *   pressed instead of appearing from nowhere.
 * - **Every row responds on pointer-down**, not on release.
 * - **Log out uses the danger triplet** rather than `text-red-500` /
 *   `bg-red-500/10`, which were light-mode literals — a pale pink wash
 *   glowing off a near-black menu in dark mode.
 */

const AVATAR = 36;

function Avatar({
  src,
  name,
  size = AVATAR,
  ringed = false,
}: {
  src?: string;
  name?: string;
  size?: number;
  ringed?: boolean;
}) {
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--cs-accent-muted)",
        boxShadow: ringed ? "0 0 0 1px var(--cs-border-default)" : undefined,
      }}
    >
      {/* The fallback used to render `{profile?.fullName}` — the entire name,
          in white, with no background, inside a 38px circle. It overflowed
          into an unreadable smear on every account without a picture. */}
      <SafeImage
        src={src}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
        fallback={
          <span
            className="flex h-full w-full items-center justify-center text-xs font-semibold"
            style={{ color: "var(--cs-accent-text)" }}
          >
            {initialsOf(name ?? "")}
          </span>
        }
      />
    </span>
  );
}

type NavItem = { label: string; href: string; Icon: React.ElementType };

const ROLE_NAV: Record<string, NavItem[]> = {
  user: [
    { label: "Recipes", href: "/recipes", Icon: ForkKnifeIcon },
    { label: "Cookbooks", href: "/cookbooks", Icon: BookOpenIcon },
    { label: "Chefs", href: "/chefs", Icon: ChefHatIcon },
    { label: "Activity", href: "/activity", Icon: PulseIcon },
    { label: "Become a chef", href: "/apply-chef", Icon: UsersFourIcon },
  ],
  chef: [
    { label: "Recipes", href: "/recipes", Icon: ForkKnifeIcon },
    { label: "Cookbooks", href: "/cookbooks", Icon: BookOpenIcon },
    { label: "Chefs", href: "/chefs", Icon: ChefHatIcon },
    { label: "Activity", href: "/activity", Icon: PulseIcon },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", Icon: ShieldCheckIcon },
    { label: "Users", href: "/admin/users", Icon: UsersIcon },
    { label: "Recipes", href: "/admin/recipes", Icon: ForkKnifeIcon },
    { label: "Cookbooks", href: "/admin/cookbooks", Icon: BookOpenIcon },
  ],
};

/** One row. Shared so every entry has identical metrics and press feel. */
const rowClass =
  "flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm cursor-pointer " +
  "transition-transform duration-100 active:scale-[0.98] " +
  "focus:bg-(--cs-hover) data-highlighted:bg-(--cs-hover)";

export const ProfileDropdown = () => {
  const { profile, isProfileLoading } = useProfile();
  const { logout } = useAuth();

  const navItems: NavItem[] = ROLE_NAV[profile?.role ?? ""] ?? [];
  const isChef = profile?.role === "chef";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="focus-ring rounded-full transition-transform duration-150 active:scale-[0.94]"
        >
          {isProfileLoading ? (
            <span
              className="block animate-pulse rounded-full"
              style={{
                width: AVATAR,
                height: AVATAR,
                backgroundColor: "var(--cs-surface-3)",
              }}
            />
          ) : (
            <Avatar src={profile?.profile_url} name={profile?.fullName} ringed />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 p-1.5 rounded-2xl"
        style={{
          backgroundColor: "var(--cs-material-thick)",
          backdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
          WebkitBackdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
          border: "1px solid var(--cs-material-edge)",
          boxShadow: "var(--cs-shadow-float)",
        }}
      >
        {/* ── Identity ──
            Name, handle and email, stated once. Text over a translucent
            surface takes a little more weight than it would over a solid
            one, since what's behind it keeps changing. */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar src={profile?.profile_url} name={profile?.fullName} />
          <div className="flex min-w-0 flex-col">
            <span
              className="truncate text-sm font-semibold leading-tight"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {profile?.fullName || "Your account"}
            </span>
            <span
              className="truncate text-xs leading-tight"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {profile?.username ? `@${profile.username}` : profile?.email}
            </span>
          </div>
        </div>

        {isChef && (
          <>
            <DropdownMenuSeparator
              className="my-1"
              style={{ backgroundColor: "var(--cs-border-subtle)" }}
            />
            {/* The one promoted destination in the menu, and the only thing
                here wearing a fill — which is what marks it as promoted.
                It's a real menu item now, so it closes the menu on select
                and takes keyboard focus like everything else; it used to be
                a bare Link that did neither. */}
            <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
              <Link
                href="/chef/dashboard"
                className="flex items-center gap-2 min-w-0 bg-primary/10 px-2.5 h-9 rounded-lg cursor-pointer transition-transform duration-100 active:scale-[0.98]"
              >
                <ChefHatIcon
                  size={15}
                  weight="duotone"
                  className="text-black shrink-0 dark:text-white"
                />
                <span className="text-sm font-semibold tracking-tight text-foreground truncate">
                  Chef <span style={{ color: "var(--cs-accent-text)" }}>Studio</span>
                </span>
                <CaretRightIcon
                  size={12}
                  weight="bold"
                  className="ml-auto shrink-0"
                  style={{ color: "var(--cs-text-tertiary)" }}
                />
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {navItems.length > 0 && (
          <>
            <DropdownMenuSeparator
              className="my-1"
              style={{ backgroundColor: "var(--cs-border-subtle)" }}
            />
            <DropdownMenuGroup>
              {navItems.map(({ label, href, Icon }) => (
                <DropdownMenuItem key={href} asChild className="p-0 focus:bg-transparent">
                  <Link href={href} className={rowClass}>
                    <Icon
                      size={16}
                      className="shrink-0"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    />
                    <span style={{ color: "var(--cs-text-primary)" }}>{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator
          className="my-1"
          style={{ backgroundColor: "var(--cs-border-subtle)" }}
        />

        <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
          <Link
            href={profile?.role === "admin" ? "/admin/settings" : "/settings"}
            className={rowClass}
          >
            <GearSixIcon
              size={16}
              className="shrink-0"
              style={{ color: "var(--cs-text-tertiary)" }}
            />
            <span style={{ color: "var(--cs-text-primary)" }}>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator
          className="my-1"
          style={{ backgroundColor: "var(--cs-border-subtle)" }}
        />

        <DropdownMenuItem
          onSelect={() => logout()}
          className="flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm cursor-pointer transition-[background-color,transform] duration-100 active:scale-[0.98] focus:bg-(--cs-danger-bg) data-highlighted:bg-(--cs-danger-bg)"
          style={{ color: "var(--cs-danger-fg)" }}
        >
          <SignOutIcon size={16} className="shrink-0" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
