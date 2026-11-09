/**
 * The light field behind the hero.
 *
 * This used to be five beams oscillating on 11–15s loops. A full-viewport
 * background that breathes on a slow cycle is exactly the thing to avoid:
 * it's the largest moving object on the page, it never resolves, and it
 * competes with the content for the eye at the one moment the content has
 * something to say. Depth here now comes from static layered light —
 * gradients, a masked grid, a warm ground glow — and all the motion budget
 * goes to things the user can actually touch.
 *
 * Kept gradient-based rather than WebGL because Chefalio ships a white
 * light theme as well as a near-black dark one, and volumetric ray effects
 * only read against dark backgrounds. Every colour derives from `--primary`
 * and `--accent`, so both themes hold.
 *
 * No client hooks, so this renders on the server.
 */

export function Beams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Shafts.
          These were five rotated elements each carrying `filter: blur(48px)`
          across 150% of the viewport — five large layers the compositor had
          to blur on every paint, which is the most expensive thing that was
          on this page and the first thing to stutter on a weak GPU.
          A 48px-blurred gradient is, visually, just a wider gradient, so the
          whole fan is now one element painting three radial stops: same
          light, no filter, no extra layers. */}
      <div
        className="absolute inset-x-0 -top-1/3 h-[150%]"
        style={{
          background: [
            "radial-gradient(ellipse 26% 55% at 14% 8%, color-mix(in oklab, var(--primary) 26%, transparent), transparent 70%)",
            "radial-gradient(ellipse 34% 62% at 48% 0%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 72%)",
            "radial-gradient(ellipse 28% 55% at 84% 6%, color-mix(in oklab, var(--primary) 24%, transparent), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Grid, masked out toward the edges so it never reads as a border */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--cs-border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--cs-border-subtle) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)",
        }}
      />

      {/* Warm ground glow — keeps the lime from reading cold on white */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse 90% 100% at 50% 100%, color-mix(in oklab, var(--accent) 42%, transparent), transparent 72%)",
        }}
      />

      {/* Top fade, so the translucent header has clean surface to sit on */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, var(--cs-surface-1), transparent)",
        }}
      />
    </div>
  );
}

export default Beams;
