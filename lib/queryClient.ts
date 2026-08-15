import { QueryClient, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

// The exact string DemoReadOnlyGuard sends back (see chefalio-backend
// src/auth/demo-read-only.guard.ts) — every write from a demo account gets
// blocked with this, verbatim, regardless of which mutation triggered it.
const DEMO_READ_ONLY_MESSAGE = "Demo accounts are read-only.";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  // A safety net, not the primary error path — most mutations already
  // catch and toast their own message correctly. This exists because that
  // pattern is easy to get wrong (a bare `catch {}`, a hardcoded fallback
  // string that never checks the real error) and each time it does, a demo
  // account sees a confusing generic failure instead of "this is a demo
  // account" — which reads as the app being broken, not as it working as
  // designed. Fixed `id` so a burst of failed demo actions collapses into
  // one toast instead of stacking duplicates.
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof Error && error.message === DEMO_READ_ONLY_MESSAGE) {
        toast.error(DEMO_READ_ONLY_MESSAGE, {
          position: "bottom-right",
          id: "demo-read-only",
        });
      }
    },
  }),
});
