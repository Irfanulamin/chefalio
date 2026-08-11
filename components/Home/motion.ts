/**
 * The motion vocabulary now lives in `lib/motion.ts`, because the
 * authenticated app shares it — see the note at the top of that file.
 *
 * This re-export exists so the landing page's imports keep resolving.
 * New code should import from `@/lib/motion` directly.
 */
export * from "@/lib/motion";
