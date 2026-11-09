"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * `richColors` + Sonner's default box painted every toast in its own
 * saturated red/green/amber on a flat opaque card — a different material
 * and a different color language than the rest of the product, which
 * reserves saturated color for state and puts everything else on the
 * translucent `.material` surfaces used for the header, sheets, and auth
 * card. `unstyled` drops Sonner's built-in box entirely (it still owns all
 * the motion, stacking, and swipe-to-dismiss — only the paint is ours), so
 * the classNames below rebuild the toast in that same material: blurred
 * translucent background, restrained neutral text, and a tinted *icon*
 * only — never a tinted card — for the four tones, matching `AuthNotice`.
 */
const TONE_ICON_COLOR = {
  success: "var(--cs-accent-text)",
  error: "var(--cs-danger-fg)",
  warning: "var(--cs-warning-fg)",
  info: "var(--cs-text-secondary)",
} as const;

export const MainLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster
        position="bottom-right"
        gap={10}
        icons={{
          success: (
            <CheckCircleIcon
              size={18}
              weight="fill"
              style={{ color: TONE_ICON_COLOR.success }}
            />
          ),
          error: (
            <WarningCircleIcon
              size={18}
              weight="fill"
              style={{ color: TONE_ICON_COLOR.error }}
            />
          ),
          warning: (
            <WarningCircleIcon
              size={18}
              weight="fill"
              style={{ color: TONE_ICON_COLOR.warning }}
            />
          ),
          info: (
            <InfoIcon size={18} weight="fill" style={{ color: TONE_ICON_COLOR.info }} />
          ),
        }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "material-thick flex items-start gap-3 rounded-2xl px-4 py-3.5 w-[min(356px,calc(100vw-2rem))]",
            icon: "!m-0 mt-0.5 flex shrink-0 items-center justify-center [&>svg]:!m-0",
            content: "flex min-w-0 flex-1 flex-col gap-0.5",
            title: "type-caption font-semibold",
            description: "type-micro",
            actionButton:
              "type-micro shrink-0 rounded-lg px-2.5 py-1.5 font-semibold",
            cancelButton:
              "type-micro shrink-0 rounded-lg px-2.5 py-1.5 font-medium",
          },
          style: {
            color: "var(--cs-text-primary)",
          },
          descriptionClassName: "!text-[var(--cs-text-secondary)]",
        }}
      />
    </>
  );
};
