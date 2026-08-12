/**
 * Chef Studio data-visualisation vocabulary.
 *
 * Every colour a chart draws with is named here by the *job it does*, never
 * by its hue and never inline in a page. A slot assigned per-chart drifts:
 * "Loves" was #ef4444 on the dashboard and #f87171 on analytics, and orders
 * alternated indigo/light-indigo per bar — which encodes even-vs-odd, a fact
 * about the array index rather than about the data.
 *
 * The lead series colour is Chefalio lime, so the studio screenshots as
 * ours. What changed from the old charts is not the hue but the discipline
 * around it: the studio used to paint raw #A7D129 on everything, which
 * measures 1.7:1 on a light card — a pale smear rather than a series. The
 * `--cv-*` tokens in globals.css hold the brand hue at a per-theme step,
 * validated for lightness band, chroma floor, adjacent-pair CVD separation,
 * normal-vision separation and contrast against the card it renders on.
 *
 * Raw --cs-accent stays what it always was: chrome. Buttons, active nav,
 * links, and the hairline on a KPI tile.
 */

/* ── Series slots ──────────────────────────────────────────────────────
   Slot 1 is the brand lime, slot 2 is blue. Assigned in fixed order, never
   cycled. A chart that would need a ninth series folds the tail into
   "Other" instead of inventing a hue. */
export const SERIES = {
  1: "var(--cv-1)",
  2: "var(--cv-2)",
  3: "var(--cv-3)",
  4: "var(--cv-4)",
  5: "var(--cv-5)",
  6: "var(--cv-6)",
  7: "var(--cv-7)",
  8: "var(--cv-8)",
} as const;

/**
 * Named roles, so the same measure is the same colour everywhere in the
 * studio. Revenue is blue on the dashboard and blue on analytics; loves are
 * orange in both places. Consistency across pages is what lets someone read
 * the second chart without re-reading the legend.
 */
export const MEASURE = {
  revenue: SERIES[1],
  orders: SERIES[2],
  loves: SERIES[2],
  saves: SERIES[1],
  uploads: SERIES[1],
  tags: SERIES[1],
  engagement: SERIES[1],
} as const;

/**
 * The studio deliberately runs on two hues, not eight.
 *
 * Slots 3–8 exist and are validated, but a dashboard where every panel
 * introduces a new colour reads as confetti: the reader learns that hue
 * carries no meaning across panels and stops looking at it. Two hues is
 * also what makes the studio look like one product rather than a chart
 * gallery — single-series panels are all brand lime, the second series in a
 * pair is always blue, and ordered data gets the lime ramp. A third hue has
 * to earn its place by encoding something the first two can't.
 */

/** Ordinal ramp — low → high magnitude in one hue. Direction flips per
 *  theme (light runs light→dark, dark runs dark→light); the tokens already
 *  encode that, so consumers just index by rank. */
export const ORDINAL = ["var(--cv-ord-1)", "var(--cv-ord-2)", "var(--cv-ord-3)"] as const;

/** Recipe difficulty is ordered, not categorical — beginner → advance is a
 *  ramp, so it gets one hue in three steps rather than three unrelated
 *  hues. The old three-shades-of-green set encoded the order correctly by
 *  accident but was indistinguishable at chart size. */
export const DIFFICULTY: Record<string, string> = {
  beginner: ORDINAL[0],
  intermediate: ORDINAL[1],
  advance: ORDINAL[2],
};

/** Reserved. A status colour never doubles as a series colour, and never
 *  carries meaning alone — it always ships beside a label. */
export const STATUS_COLOR: Record<string, string> = {
  paid: "var(--cv-good)",
  shipped: "var(--cv-1)",
  delivered: "var(--cv-good)",
  pending: "var(--cv-warning)",
  failed: "var(--cv-critical)",
  refunded: "var(--cs-text-tertiary)",
};

export const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

/* ── Chrome ───────────────────────────────────────────────────────────
   Grid and axis are recessive on purpose: on a card this small the data is
   the only thing allowed to have weight. */
export const CHROME = {
  grid: "var(--cv-grid)",
  axis: "var(--cv-axis)",
  label: "var(--cv-label)",
} as const;

/** Shared axis props. Passed by spread so no chart re-declares tick styling
 *  and then quietly disagrees with the one next to it. */
export const axis = {
  tick: { fontSize: 11, fill: CHROME.label },
  tickLine: false,
  axisLine: false,
} as const;

export const grid = {
  stroke: CHROME.grid,
  strokeDasharray: "2 4",
} as const;

/** Hover band behind the mark under the cursor. */
export const cursorFill = { fill: "var(--cs-hover)" } as const;

export const currency = (val: number, cents = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(val);

export const compactCurrency = (val: number) =>
  val >= 1000
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(val)
    : currency(val);
