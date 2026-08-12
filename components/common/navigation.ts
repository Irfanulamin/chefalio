import type { ElementType } from "react";
import {
  ForkKnifeIcon,
  BookOpenIcon,
  UsersIcon,
  PulseIcon,
  GearSixIcon,
  UsersFourIcon,
  ChefHatIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * The app's navigation, declared once.
 *
 * The sidebar, the mobile tab bar and the account menu were each carrying
 * their own copy of this list, which is why "Become a Chef" appeared in
 * the header for chefs who already were one. One source, one role rule.
 */
export type NavItem = {
  label: string;
  href: string;
  Icon: ElementType;
};

/** The four destinations that are always available, in scan order. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Recipes", href: "/recipes", Icon: ForkKnifeIcon },
  { label: "Cookbooks", href: "/cookbooks", Icon: BookOpenIcon },
  { label: "Chefs", href: "/chefs", Icon: UsersIcon },
  { label: "Activity", href: "/activity", Icon: PulseIcon },
];

export const SETTINGS_NAV: NavItem = {
  label: "Settings",
  href: "/settings",
  Icon: GearSixIcon,
};

export const BECOME_CHEF_NAV: NavItem = {
  label: "Become a chef",
  href: "/apply-chef",
  Icon: UsersFourIcon,
};

export const CHEF_STUDIO_NAV: NavItem = {
  label: "Chef Studio",
  href: "/chef/dashboard",
  Icon: ChefHatIcon,
};

/* `RAIL_ROUTES` lived here while account and notifications occupied a
   right-hand column and had to be suppressed on pages that needed the
   width. They moved into the top bar, which costs no horizontal space, so
   there is nothing left to opt out of. */
