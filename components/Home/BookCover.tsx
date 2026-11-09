/**
 * The featured book's cloth binding, drawn rather than photographed, so the
 * page never shows a picture of some other book. Sizes are in `cqw`: these
 * sit inside a page-flip page, which is a size container, so the cover
 * scales as one piece.
 */

const CLOTH = {
  backgroundColor: "#2E3524",
  color: "#F4EEDF",
  // Cloth grain and a darker band along the spine.
  backgroundImage:
    "linear-gradient(90deg, rgba(0,0,0,0.28) 0, rgba(0,0,0,0.08) 5%, transparent 7%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)",
} as const;

function Frame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-[5%] rounded-[2px]"
      style={{ border: "1px solid rgba(244,238,223,0.22)" }}
    />
  );
}

export function BookCover({ title, chef }: { title: string; chef: string }) {
  return (
    <div
      className="relative flex size-full flex-col justify-between p-[11cqw]"
      style={CLOTH}
    >
      <Frame />
      <p
        className="relative text-[3.2cqw] font-semibold uppercase"
        style={{ letterSpacing: "0.2em", color: "rgba(244,238,223,0.7)" }}
      >
        Chefalio
      </p>

      <p
        className="relative text-[10cqw] font-bold"
        style={{ lineHeight: 1.04, letterSpacing: "-0.035em", textWrap: "balance" }}
      >
        {title}
      </p>

      <div className="relative flex items-end justify-between gap-[3cqw]">
        <p
          className="text-[4cqw] font-medium"
          style={{ color: "rgba(244,238,223,0.85)" }}
        >
          {chef}
        </p>
        <p
          className="text-[3cqw]"
          style={{ color: "rgba(244,238,223,0.6)" }}
        >
          Turn the corner →
        </p>
      </div>
    </div>
  );
}

/** The back board: plain cloth with a small mark. */
export function BookBack({ line }: { line: string }) {
  return (
    <div
      className="relative flex size-full flex-col items-center justify-center p-[11cqw] text-center"
      style={{
        ...CLOTH,
        backgroundImage:
          "linear-gradient(270deg, rgba(0,0,0,0.28) 0, rgba(0,0,0,0.08) 5%, transparent 7%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)",
      }}
    >
      <Frame />
      <p className="relative text-[7cqw] font-bold" style={{ letterSpacing: "-0.03em" }}>
        Chefalio
      </p>
      <p
        className="relative mt-[3cqw] max-w-[30ch] text-[3.4cqw] leading-snug"
        style={{ color: "rgba(244,238,223,0.7)" }}
      >
        {line}
      </p>
    </div>
  );
}

export default BookCover;
