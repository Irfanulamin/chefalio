/**
 * Chefalio's dish illustrations: flat, top-down plates drawn in SVG, in the
 * same palette as the doodles and the cloth book cover. Each dish is drawn
 * in a 200 × 200 box centred on (100, 100).
 *
 * Scattered details (rice, pepper, dust) come from a seeded generator, so
 * the markup is identical on server and client and between builds.
 *
 * Motion is CSS only and stops under reduced motion: steam rises
 * (`.art-steam`), the hero plate turns very slowly (`.art-turn`), and a card's
 * plate spins a little on hover (`.art-plate`).
 */

export type DishArtId = "tehari" | "carbonara" | "roganjosh" | "mochi" | "tart";

/** The paper tint each dish sits on in a card. */
export const DISH_TINT: Record<DishArtId, string> = {
  tehari: "#E6EFC6",
  carbonara: "#E4EFC2",
  roganjosh: "#FBEAB8",
  mochi: "#F8DCD0",
  tart: "#FBEAB8",
};

const INK = "#1C1915";
const r1 = (n: number) => Math.round(n * 10) / 10;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Rand = () => number;

function inDisc(rand: Rand, radius: number, cx = 100, cy = 100) {
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * radius;
  return [r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))] as const;
}

/** A soft irregular lump: a chunk of meat, a scrap of pancetta. */
function blob(rand: Rand, cx: number, cy: number, rMin: number, rMax: number, n = 7) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rand() * 0.45;
    const r = rMin + rand() * (rMax - rMin);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const m = mid(pts[n - 1], pts[0]);
  let d = `M${r1(m[0])} ${r1(m[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = mid(p, pts[(i + 1) % n]);
    d += ` Q${r1(p[0])} ${r1(p[1])} ${r1(q[0])} ${r1(q[1])}`;
  }
  return `${d}Z`;
}

function spiral(r0: number, rEnd: number, turns: number, phase: number, steps = 150) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = phase + t * turns * Math.PI * 2;
    const r = r0 + (rEnd - r0) * t;
    d += `${i ? " L" : "M"}${r1(100 + r * Math.cos(a))} ${r1(100 + r * Math.sin(a))}`;
  }
  return d;
}

function scallop(n: number, r: number, depth: number, cx = 100, cy = 100) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const c = r + depth * 2;
    if (i === 0) d += `M${r1(cx + r * Math.cos(a0))} ${r1(cy + r * Math.sin(a0))}`;
    d += ` Q${r1(cx + c * Math.cos(am))} ${r1(cy + c * Math.sin(am))} ${r1(cx + r * Math.cos(a1))} ${r1(cy + r * Math.sin(a1))}`;
  }
  return `${d}Z`;
}

export const SPARKLE_PATH =
  "M0 -12 C1 -4 4 -1 12 0 C4 1 1 4 0 12 C-1 4 -4 1 -12 0 C-4 -1 -1 -4 0 -12Z";

/* ── Tehari ─────────────────────────────────────────────────────────── */

const TEHARI = (() => {
  const rand = rng(7);
  return {
    grains: Array.from({ length: 190 }, () => {
      const [x, y] = inDisc(rand, 65);
      return { x, y, a: Math.round(rand() * 180), warm: rand() < 0.3 };
    }),
    carrots: Array.from({ length: 13 }, () => {
      const [x, y] = inDisc(rand, 56);
      return { x, y, a: Math.round(rand() * 180), len: r1(10 + rand() * 8) };
    }),
    peas: Array.from({ length: 8 }, () => inDisc(rand, 54)),
    beef: [
      [78, 82],
      [119, 76],
      [95, 120],
      [131, 115],
    ].map(([x, y]) => ({
      d: blob(rand, x, y, 9, 14),
      hi: blob(rand, x - 2, y - 3, 3.5, 6),
    })),
    leaves: Array.from({ length: 7 }, () => {
      const [x, y] = inDisc(rand, 50);
      return { x, y, a: Math.round(rand() * 180) };
    }),
  };
})();

function Tehari() {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="#FFFDF8" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#E6DCC8" strokeWidth="1.5" />
      {/* The patterned rim, navy with gold dots */}
      <circle cx="100" cy="100" r="86" fill="#22385C" />
      <circle
        cx="100"
        cy="100"
        r="79"
        fill="none"
        stroke="#F4C542"
        strokeWidth="3.6"
        strokeDasharray="0.1 7.2"
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#E2B33C" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="72" fill="#F7EBD0" />
      {TEHARI.grains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.x}
          cy={g.y}
          rx="3.3"
          ry="1.3"
          fill={g.warm ? "#EBD6A6" : "#FFF8E6"}
          transform={`rotate(${g.a} ${g.x} ${g.y})`}
        />
      ))}
      {TEHARI.carrots.map((c, i) => (
        <rect
          key={i}
          x={r1(c.x - c.len / 2)}
          y={r1(c.y - 2)}
          width={c.len}
          height="4"
          rx="2"
          fill="#F08A2C"
          transform={`rotate(${c.a} ${c.x} ${c.y})`}
        />
      ))}
      {TEHARI.peas.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.6" fill="#E3BC55" />
          <circle cx={r1(x - 1.4)} cy={r1(y - 1.4)} r="1.5" fill="#F6DE95" />
        </g>
      ))}
      {TEHARI.beef.map((b, i) => (
        <g key={i}>
          <path d={b.d} fill="#6B3A24" />
          <path d={b.hi} fill="#8A5234" />
        </g>
      ))}
      {TEHARI.leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="4"
          ry="2.3"
          fill="#4F9A3E"
          transform={`rotate(${l.a} ${l.x} ${l.y})`}
        />
      ))}
    </>
  );
}

/* ── Carbonara ──────────────────────────────────────────────────────── */

const CARBONARA = (() => {
  const rand = rng(21);
  return {
    nests: [spiral(4, 54, 3.2, 0), spiral(7, 50, 3, Math.PI), spiral(12, 58, 2.1, 1.7)],
    pancetta: Array.from({ length: 8 }, () => {
      const [x, y] = inDisc(rand, 46);
      return { d: blob(rand, x, y, 3.5, 6.5, 6), hi: blob(rand, x - 1, y - 1, 1.5, 2.6, 5) };
    }),
    pepper: Array.from({ length: 40 }, () => inDisc(rand, 60)),
    parsley: Array.from({ length: 8 }, (_, i) => ({
      x: r1(108 + Math.cos(i * 0.8) * 7),
      y: r1(90 + Math.sin(i * 0.8) * 6),
      a: Math.round(i * 45),
      dark: i % 2 === 0,
    })),
  };
})();

function Carbonara() {
  return (
    <>
      <circle cx="100" cy="100" r="95" fill="#FFFDF8" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#E6DCC8" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="#EFE6D4" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="66" fill="#F7EEDA" />
      {CARBONARA.nests.map((d, i) => (
        <path key={`a${i}`} d={d} fill="none" stroke="#E3B94F" strokeWidth="7" strokeLinecap="round" />
      ))}
      {CARBONARA.nests.map((d, i) => (
        <path key={`b${i}`} d={d} fill="none" stroke="#F6D883" strokeWidth="3.4" strokeLinecap="round" />
      ))}
      {CARBONARA.pancetta.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="#B5402E" />
          <path d={p.hi} fill="#D96A52" />
        </g>
      ))}
      {CARBONARA.pepper.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill={INK} opacity="0.7" />
      ))}
      {CARBONARA.parsley.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="5"
          ry="2.8"
          fill={l.dark ? "#3E8B3A" : "#5BA846"}
          transform={`rotate(${l.a} ${l.x} ${l.y})`}
        />
      ))}
    </>
  );
}

/* ── Rogan josh ─────────────────────────────────────────────────────── */

const ROGAN = (() => {
  const rand = rng(33);
  return {
    oil: Array.from({ length: 7 }, () => {
      const [x, y] = inDisc(rand, 62);
      return { x, y, rx: r1(3 + rand() * 5), ry: r1(2 + rand() * 2.5) };
    }),
    chicken: Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + 0.3;
      const r = i === 6 ? 0 : 38;
      const x = 100 + r * Math.cos(a);
      const y = 100 + r * Math.sin(a);
      return { shade: blob(rand, x + 2, y + 3, 9, 13), d: blob(rand, x, y, 9, 13) };
    }),
    peppers: Array.from({ length: 6 }, () => {
      const [x, y] = inDisc(rand, 55);
      return { x, y, a: Math.round(rand() * 360) };
    }),
    leaves: Array.from({ length: 9 }, () => {
      const [x, y] = inDisc(rand, 58);
      return { x, y, a: Math.round(rand() * 180) };
    }),
  };
})();

function RoganJosh({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${uid}-curry`}>
          <stop offset="0" stopColor="#E36B30" />
          <stop offset="0.7" stopColor="#C9481F" />
          <stop offset="1" stopColor="#A63519" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#2A2521" />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#3E3732" strokeWidth="3" />
      <circle cx="100" cy="100" r="78" fill={`url(#${uid}-curry)`} />
      {ROGAN.oil.map((o, i) => (
        <ellipse key={i} cx={o.x} cy={o.y} rx={o.rx} ry={o.ry} fill="#F4A24E" opacity="0.4" />
      ))}
      {ROGAN.chicken.map((c, i) => (
        <g key={i}>
          <path d={c.shade} fill="#C47B3C" />
          <path d={c.d} fill="#E8A35F" />
        </g>
      ))}
      {ROGAN.peppers.map((p, i) => (
        <path
          key={i}
          d={`M${p.x - 9} ${p.y} q 9 -9 18 0`}
          fill="none"
          stroke="#E5352A"
          strokeWidth="4.5"
          strokeLinecap="round"
          transform={`rotate(${p.a} ${p.x} ${p.y})`}
        />
      ))}
      {ROGAN.leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx="4.2"
          ry="2.4"
          fill="#4F9A3E"
          transform={`rotate(${l.a} ${l.x} ${l.y})`}
        />
      ))}
    </>
  );
}

/* ── Matcha warabi mochi ────────────────────────────────────────────── */

const MOCHI = (() => {
  const rand = rng(48);
  const cube = (x: number, y: number, a: number) => ({
    x,
    y,
    a,
    specks: Array.from({ length: 6 }, () => [
      r1(x - 11 + rand() * 22),
      r1(y - 11 + rand() * 22),
    ]),
  });
  return {
    plate: scallop(22, 84, 2.5),
    dust: Array.from({ length: 70 }, () => {
      const [x, y] = inDisc(rand, 68);
      return { x, y, r: r1(0.8 + rand()) };
    }),
    cubes: [cube(80, 80, -12), cube(116, 76, 8), cube(134, 108, 14), cube(72, 116, 20), cube(106, 118, -6)],
  };
})();

function Mochi() {
  return (
    <>
      <path d={MOCHI.plate} fill="#F0E2C4" />
      <circle cx="100" cy="100" r="73" fill="#FBF5E8" />
      <circle cx="100" cy="100" r="73" fill="none" stroke="#E3D2AE" strokeWidth="1.2" />
      {MOCHI.dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#9DC54B" opacity="0.55" />
      ))}
      {MOCHI.cubes.map((c, i) => (
        <g key={i} transform={`rotate(${c.a} ${c.x} ${c.y})`}>
          <rect x={c.x - 11} y={c.y - 10} width="30" height="30" rx="6" fill="#6E9A2D" />
          <rect x={c.x - 15} y={c.y - 15} width="30" height="30" rx="6" fill="#92C23E" />
          {c.specks.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r="1" fill="#C3E07E" />
          ))}
        </g>
      ))}
    </>
  );
}

/* ── Chocolate tart ─────────────────────────────────────────────────── */

const TART = (() => {
  const rand = rng(64);
  const berries = Array.from({ length: 11 }, (_, i) => {
    const a = -1.05 + (i / 10) * 2.1;
    const r = i % 2 === 0 ? 56 : 44;
    return [r1(100 + r * Math.cos(a)), r1(100 + r * Math.sin(a))] as const;
  });
  return {
    tin: scallop(40, 90, 1.6),
    berries: berries.map(([x, y]) => ({
      x,
      y,
      drupes: Array.from({ length: 6 }, (_, j) => {
        const a = (j / 6) * Math.PI * 2;
        return [r1(x + 3.6 * Math.cos(a)), r1(y + 3.6 * Math.sin(a))] as const;
      }),
    })),
    salt: Array.from({ length: 30 }, () => {
      const [x, y] = inDisc(rand, 64);
      return { x, y, a: Math.round(rand() * 90) };
    }),
    swirl: spiral(4, 36, 1.7, 0.6),
  };
})();

function Tart() {
  return (
    <>
      <path d={TART.tin} fill="#BFC3C8" />
      <circle cx="100" cy="100" r="86" fill="#D3964F" />
      <circle cx="100" cy="100" r="80" fill="#E6B46C" />
      <circle cx="100" cy="100" r="74" fill="#3A1F14" />
      <path d={TART.swirl} fill="none" stroke="#56331F" strokeWidth="6" strokeLinecap="round" />
      <path d={TART.swirl} fill="none" stroke="#6E432A" strokeWidth="1.6" strokeLinecap="round" />
      {TART.salt.map((f, i) => (
        <rect
          key={i}
          x={f.x - 0.9}
          y={f.y - 0.9}
          width="1.8"
          height="1.8"
          fill="#FFFDF8"
          opacity="0.85"
          transform={`rotate(${f.a} ${f.x} ${f.y})`}
        />
      ))}
      {TART.berries.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="7" fill="#B8243A" />
          {b.drupes.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r="2.6" fill="#DA3F55" />
          ))}
          <circle cx={b.x} cy={b.y} r="2.4" fill="#E8607A" />
        </g>
      ))}
      <ellipse cx="146" cy="84" rx="6" ry="3.2" fill="#4F9A3E" transform="rotate(-30 146 84)" />
      <ellipse cx="150" cy="118" rx="6" ry="3.2" fill="#3E8B3A" transform="rotate(35 150 118)" />
    </>
  );
}

function DishBody({ dish, uid }: { dish: DishArtId; uid: string }) {
  switch (dish) {
    case "tehari":
      return <Tehari />;
    case "carbonara":
      return <Carbonara />;
    case "roganjosh":
      return <RoganJosh uid={uid} />;
    case "mochi":
      return <Mochi />;
    case "tart":
      return <Tart />;
  }
}

/** Three wisps of steam rising from (cx, top). */
export function Steam({ cx, top, scale = 1 }: { cx: number; top: number; scale?: number }) {
  return (
    <g
      className="art-steam"
      transform={`translate(${cx} ${top}) scale(${scale})`}
      fill="none"
      stroke={INK}
      strokeWidth="2.6"
      strokeLinecap="round"
      opacity="0.4"
    >
      <path d="M-14 0 c -5 -6 5 -11 0 -17 c -5 -6 5 -11 0 -17" />
      <path d="M0 -4 c -5 -6 5 -11 0 -17 c -5 -6 5 -11 0 -17" />
      <path d="M14 0 c -5 -6 5 -11 0 -17 c -5 -6 5 -11 0 -17" />
    </g>
  );
}

/**
 * A single dish for a recipe card: the plate sits low in the frame with
 * steam rising above hot dishes. Hovering the card (`.art-card`) gives the
 * plate a little spin.
 */
export function DishArt({
  dish,
  uid,
  label,
  className = "",
}: {
  dish: DishArtId;
  /** Unique per page; names gradients. */
  uid: string;
  label: string;
  className?: string;
}) {
  const hot = dish !== "mochi" && dish !== "tart";
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={className}>
      <ellipse cx="104" cy="120" rx="80" ry="80" fill={INK} opacity="0.08" />
      <g transform="translate(100 114) scale(0.8) translate(-100 -100)">
        <g className="art-plate">
          <DishBody dish={dish} uid={uid} />
        </g>
      </g>
      {hot ? (
        <Steam cx={100} top={38} />
      ) : (
        <g transform="translate(160 40)">
          <g className="art-twinkle">
            <path d={SPARKLE_PATH} fill="#F4C542" />
          </g>
        </g>
      )}
    </svg>
  );
}

/**
 * The hero: a whole table seen from above. The main plate turns very slowly
 * on a scalloped placemat, with a dish of pickles, a bowl of yoghurt and a
 * spoon around it.
 */
export function HeroTable({ dish, label }: { dish: DishArtId; label: string }) {
  const rand = rng(91);
  const beet = Array.from({ length: 14 }, () => {
    const x = r1(105 + (rand() - 0.5) * 90);
    const y = r1(392 + (rand() - 0.5) * 62);
    return { x, y, a: Math.round(rand() * 180) };
  });
  const carrot = Array.from({ length: 12 }, () => {
    const x = r1(105 + (rand() - 0.5) * 90);
    const y = r1(392 + (rand() - 0.5) * 62);
    return { x, y, a: Math.round(rand() * 180) };
  });

  return (
    <svg viewBox="0 0 640 480" role="img" aria-label={label} className="block h-auto w-full">
      <defs>
        <pattern id="hero-dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="3.4" fill="#F4C542" opacity="0.5" />
        </pattern>
        <clipPath id="hero-clip">
          <rect width="640" height="480" rx="28" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-clip)">
        <rect width="640" height="480" fill="#E6EFC6" />
        <rect width="640" height="480" fill="url(#hero-dots)" />

        {/* Placemat */}
        <path d={scallop(30, 196, 4, 330, 245)} fill="#D3E58E" />

        {/* Pickled salad, bottom left */}
        <g>
          <ellipse cx="108" cy="398" rx="84" ry="60" fill={INK} opacity="0.07" />
          <ellipse cx="104" cy="392" rx="80" ry="56" fill="#FFFDF8" stroke="#E6DCC8" strokeWidth="1.5" />
          <ellipse cx="104" cy="392" rx="64" ry="42" fill="#F6EEDD" />
          {beet.map((b, i) => (
            <path
              key={`b${i}`}
              d={`M${b.x - 8} ${b.y} q 8 -6 16 0`}
              fill="none"
              stroke="#9A2352"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform={`rotate(${b.a} ${b.x} ${b.y})`}
            />
          ))}
          {carrot.map((c, i) => (
            <path
              key={`c${i}`}
              d={`M${c.x - 9} ${c.y} q 9 5 18 0`}
              fill="none"
              stroke="#F08A2C"
              strokeWidth="2.6"
              strokeLinecap="round"
              transform={`rotate(${c.a} ${c.x} ${c.y})`}
            />
          ))}
          <ellipse cx="84" cy="378" rx="12" ry="8" fill="none" stroke="#E9A0B8" strokeWidth="2" />
          <ellipse cx="124" cy="404" rx="10" ry="7" fill="none" stroke="#E9A0B8" strokeWidth="2" />
        </g>

        {/* Yoghurt, top right */}
        <g>
          <circle cx="566" cy="96" r="58" fill={INK} opacity="0.08" />
          <circle cx="560" cy="90" r="56" fill="#B9683C" />
          <circle cx="560" cy="90" r="46" fill="#A35631" />
          <circle cx="560" cy="90" r="42" fill="#FFFDF8" />
          <path
            d="M540 92 c 6 -14 26 -14 30 -2 c 3 9 -10 14 -16 6"
            fill="none"
            stroke="#EBE1CC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Spoon */}
        <g transform="rotate(-28 590 300)">
          <rect x="585" y="300" width="10" height="92" rx="5" fill="#CFC8BC" />
          <ellipse cx="590" cy="282" rx="17" ry="24" fill="#DDD7CD" stroke="#BDB5A8" strokeWidth="1.5" />
        </g>

        {/* Main plate */}
        <ellipse cx="342" cy="258" rx="176" ry="176" fill={INK} opacity="0.1" />
        <g transform="translate(330 245) scale(1.8) translate(-100 -100)">
          <g className="art-turn">
            <DishBody dish={dish} uid="hero" />
          </g>
        </g>

        <Steam cx={330} top={62} scale={1.5} />

        <g transform="translate(470 420) scale(1.4)">
          <g className="art-twinkle">
            <path d={SPARKLE_PATH} fill="#E4572E" />
          </g>
        </g>
        <g transform="translate(188 70)">
          <g className="art-twinkle" style={{ animationDelay: "-1.4s" }}>
            <path d={SPARKLE_PATH} fill={INK} />
          </g>
        </g>
      </g>
    </svg>
  );
}
