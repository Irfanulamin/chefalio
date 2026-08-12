"use client";

import { useState } from "react";
import {
  useChefEngagementAnalytics,
  useChefEarningsAnalytics,
  type RevenuePeriod,
  type SalesGraphPoint,
  type RecipeEngagement,
} from "@/hooks/useChefs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CurrencyDollarIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  UsersIcon,
  TrendUpIcon,
  ReceiptIcon,
  ChartBarIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelHeader, PanelEmpty, PanelSkeleton } from "@/components/Chef/studio/Panel";
import { StatTile, StatTileSkeleton } from "@/components/Chef/studio/StatTile";
import { SegmentedControl } from "@/components/common/form/FormKit";
import { ChartTooltip, AreaGradient, axisProps, gridProps } from "@/components/Chef/studio/ChartBits";
import { MEASURE, currency, compactCurrency, cursorFill } from "@/components/Chef/studio/viz";

/* ── Helpers ──────────────────────────────────────────────────────────── */

function buildSalesGraph(
  data: SalesGraphPoint[],
  period: RevenuePeriod,
): { date: string; amount: number; orders: number }[] {
  if (period === "daily") {
    const map = new Map(data.map((d) => [d.date, d]));
    return Array.from({ length: 24 }, (_, h) => {
      const key = `${String(h).padStart(2, "0")}:00`;
      const found = map.get(key);
      return { date: key, amount: found?.amount ?? 0, orders: found?.orders ?? 0 };
    });
  }

  if (period === "weekly" || period === "monthly") {
    const days = period === "weekly" ? 7 : 30;
    const map = new Map(data.map((d) => [d.date, d]));
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
      const found = map.get(key);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: found?.amount ?? 0,
        orders: found?.orders ?? 0,
      };
    });
  }

  return data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}

const PERIOD_OPTIONS: { key: RevenuePeriod; label: string; short: string }[] = [
  { key: "daily", label: "Today", short: "D" },
  { key: "weekly", label: "7 days", short: "7D" },
  { key: "monthly", label: "30 days", short: "30D" },
  { key: "lifetime", label: "All time", short: "All" },
];

const PERIOD_LABEL: Record<RevenuePeriod, string> = {
  daily: "today",
  weekly: "last 7 days",
  monthly: "last 30 days",
  lifetime: "all time",
};

/* ── Chrome ───────────────────────────────────────────────────────────── */

/**
 * The page's headline figure.
 *
 * Analytics opened with a title, a sentence of description, and then
 * sixteen equally-weighted numbers. Nothing on it was the answer — you had
 * to go find one. The hero states the thing a chef opens this page to know,
 * at a size nothing else competes with, and every panel below is the
 * working behind it.
 *
 * Tracking goes negative here because the text is large: letters read too
 * far apart as they grow, so display type tightens where body type doesn't.
 */
function HeroFigure({
  value,
  caption,
  isLoading,
}: {
  value: string;
  caption: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-44" />
      </div>
    );
  }

  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.06em]"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        Revenue
      </p>
      <p
        className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.028em] mt-1"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {value}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--cs-text-secondary)" }}>
        {caption}
      </p>
    </div>
  );
}

/**
 * Time range selector.
 *
 * It was solid brand lime on the selected segment — the loudest thing on a
 * page whose job is to show data. It now uses the same segmented control
 * the forms use, so a range picker in Analytics and a difficulty picker in
 * the recipe editor are visibly the same control: raised chip on a recessed
 * track, indicator sliding between positions rather than cutting.
 */
function PeriodTabs({
  value,
  onChange,
}: {
  value: RevenuePeriod;
  onChange: (p: RevenuePeriod) => void;
}) {
  return (
    <SegmentedControl
      name="time-range"
      value={value}
      onChange={onChange}
      options={PERIOD_OPTIONS.map(({ key, label }) => ({ value: key, label }))}
    />
  );
}

function SectionHeading({
  title,
  icon: Icon,
}: {
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <Icon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
      <h2
        className="text-xs font-semibold uppercase tracking-[0.06em]"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--cs-border-subtle)" }} />
    </div>
  );
}

/** Ranked horizontal bar with the value direct-labelled, so the row never
 *  depends on reading a colour or measuring against a gridline. */
function RankRow({
  rank,
  title,
  thumbnail,
  value,
  max,
  caption,
}: {
  rank: number;
  title: string;
  thumbnail: string;
  value: number;
  max: number;
  caption: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className="text-xs font-semibold w-3 shrink-0 tabular-nums"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        {rank}
      </span>
      <div
        className="relative h-9 w-12 rounded-lg overflow-hidden shrink-0"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        <Image src={thumbnail} alt="" fill className="object-cover" sizes="48px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--cs-text-primary)" }}>
          {title}
        </p>
        <div
          className="h-1 w-full rounded-full overflow-hidden mt-1.5"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${max > 0 ? Math.max(2, (value / max) * 100) : 0}%`,
              backgroundColor: MEASURE.engagement,
            }}
          />
        </div>
        <p className="text-[11px] mt-1" style={{ color: "var(--cs-text-tertiary)" }}>
          {caption}
        </p>
      </div>
      <span
        className="text-xs font-semibold tabular-nums shrink-0"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {value.toFixed(0)}
      </span>
    </li>
  );
}

/* ── Sections ─────────────────────────────────────────────────────────── */

function EarningsSection({
  earnings,
  isLoading,
  period,
}: {
  earnings:
    | { totalEarned: number; totalProfit: number; profitRate: string; totalOrders: number; salesGraph: SalesGraphPoint[] }
    | undefined;
  isLoading: boolean;
  period: RevenuePeriod;
}) {
  const periodSub = PERIOD_LABEL[period];
  const salesGraph = buildSalesGraph(earnings?.salesGraph ?? [], period);
  const hasRevenue = salesGraph.some((d) => d.amount > 0);
  const hasOrders = salesGraph.some((d) => d.orders > 0);

  return (
    <section className="space-y-4">
      <SectionHeading title="Earnings" icon={ReceiptIcon} />

      {/* Revenue and order count are the hero's job now, so these three
          answer the questions the hero raises rather than restating it. */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <StatTileSkeleton key={i} />)
        ) : (
          <>
            <StatTile
              label="Your profit"
              value={currency(earnings?.totalProfit ?? 0)}
              sub={`At ${earnings?.profitRate ?? "80%"} rate`}
              icon={CurrencyDollarIcon}
              accent={MEASURE.revenue}
            />
            <StatTile
              label="Average order"
              value={
                earnings?.totalOrders
                  ? currency((earnings.totalEarned ?? 0) / earnings.totalOrders, true)
                  : "—"
              }
              sub="Per transaction"
              icon={ChartBarIcon}
            />
            <StatTile
              label="Orders"
              value={(earnings?.totalOrders ?? 0).toLocaleString()}
              sub={`Paid, ${periodSub}`}
              icon={ReceiptIcon}
              accent={MEASURE.orders}
              className="col-span-2 lg:col-span-1"
            />
          </>
        )}
      </div>

      {isLoading ? (
        <>
          <PanelSkeleton height={208} />
          <PanelSkeleton height={152} />
        </>
      ) : (
        <>
          <Panel>
            <PanelHeader
              title="Revenue over time"
              sub={`${period === "daily" ? "Hourly" : "Daily"} paid sales, ${periodSub}`}
            />
            {!hasRevenue ? (
              <PanelEmpty
                message="No sales in this range"
                hint="Revenue plots here once a cookbook sells."
                height={208}
              />
            ) : (
              <ResponsiveContainer width="100%" height={208}>
                <AreaChart data={salesGraph} margin={{ left: -12, right: 8, top: 4 }}>
                  <AreaGradient id="cs-revenue" color={MEASURE.revenue} />
                  <CartesianGrid {...gridProps} vertical={false} />
                  <XAxis dataKey="date" {...axisProps} interval="preserveStartEnd" minTickGap={28} />
                  <YAxis
                    {...axisProps}
                    width={46}
                    tickFormatter={(v: number) => compactCurrency(v)}
                  />
                  <Tooltip
                    content={<ChartTooltip hideName format={(v) => currency(v, true)} />}
                    cursor={{ stroke: "var(--cv-axis)", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Revenue"
                    stroke={MEASURE.revenue}
                    strokeWidth={2}
                    fill="url(#cs-revenue)"
                    dot={false}
                    activeDot={{
                      r: 3.5,
                      fill: MEASURE.revenue,
                      stroke: "var(--cs-surface-2)",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Panel>

          <Panel>
            <PanelHeader
              title={period === "daily" ? "Orders per hour" : "Orders per day"}
              sub={`Order volume, ${periodSub}`}
              value={(earnings?.totalOrders ?? 0).toLocaleString()}
            />
            {!hasOrders ? (
              <PanelEmpty message="No orders in this range" height={152} />
            ) : (
              /* Every bar is one colour. The previous version alternated two
                 shades of indigo by array index, which encodes "this bar is
                 even" — a fact about the loop, not about the orders. */
              <ResponsiveContainer width="100%" height={152}>
                <BarChart data={salesGraph} margin={{ left: -22, right: 8, top: 4 }}>
                  <CartesianGrid {...gridProps} vertical={false} />
                  <XAxis dataKey="date" {...axisProps} interval="preserveStartEnd" minTickGap={28} />
                  <YAxis {...axisProps} allowDecimals={false} width={34} />
                  <Tooltip
                    content={<ChartTooltip hideName format={(v) => `${v} order${v === 1 ? "" : "s"}`} />}
                    cursor={cursorFill}
                  />
                  <Bar
                    dataKey="orders"
                    name="Orders"
                    fill={MEASURE.orders}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </>
      )}
    </section>
  );
}

function EngagementSection({
  recipes,
  isLoading,
  period,
}: {
  recipes: RecipeEngagement[];
  isLoading: boolean;
  period: RevenuePeriod;
}) {
  const periodSub = PERIOD_LABEL[period];

  const totalLoves = recipes.reduce((a, r) => a + r.lovedCount, 0);
  const totalSaves = recipes.reduce((a, r) => a + r.savedCount, 0);
  const totalUniqueUsers = recipes.reduce((a, r) => a + r.uniqueUsersCount, 0);
  const totalEngagement = recipes.reduce((a, r) => a + r.engagementScore, 0);
  const maxEngagement = Math.max(...recipes.map((r) => r.engagementScore), 1);

  return (
    <section className="space-y-4">
      <SectionHeading title="Recipe engagement" icon={HeartIcon} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatTileSkeleton key={i} />)
        ) : (
          <>
            <StatTile
              label="Loves"
              value={totalLoves.toLocaleString()}
              sub={`Across recipes, ${periodSub}`}
              icon={HeartIcon}
              accent={MEASURE.loves}
            />
            <StatTile
              label="Saves"
              value={totalSaves.toLocaleString()}
              sub={`Across recipes, ${periodSub}`}
              icon={BookmarkSimpleIcon}
              accent={MEASURE.saves}
            />
            <StatTile
              label="Unique engagers"
              value={totalUniqueUsers.toLocaleString()}
              sub={`Distinct users, ${periodSub}`}
              icon={UsersIcon}
            />
            <StatTile
              label="Engagement score"
              value={totalEngagement.toLocaleString()}
              sub="Loves ×2 + saves ×1.5"
              icon={TrendUpIcon}
            />
          </>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PanelSkeleton height={208} />
          <PanelSkeleton height={208} />
        </div>
      ) : recipes.length === 0 ? (
        <Panel>
          <PanelEmpty
            message="No engagement data"
            hint={
              period === "lifetime"
                ? "Publish recipes to start seeing engagement."
                : "Nothing recorded in this range."
            }
          />
        </Panel>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Panel>
              <PanelHeader title="Engagement by recipe" sub="Top 7" />
              {/* One hue for every bar. Colouring bar 1 dark, bars 2–3 mid and
                  the rest pale made colour restate the sort order and, worse,
                  meant a filter that reordered the list repainted every
                  surviving bar. Rank is already the y-axis. */}
              <ResponsiveContainer width="100%" height={208}>
                <BarChart
                  data={recipes.slice(0, 7).map((r) => ({
                    name: r.title.length > 20 ? r.title.slice(0, 20) + "…" : r.title,
                    score: Number(r.engagementScore.toFixed(1)),
                  }))}
                  layout="vertical"
                  margin={{ left: 0, right: 12 }}
                  barSize={14}
                >
                  <CartesianGrid {...gridProps} horizontal={false} />
                  <XAxis type="number" {...axisProps} />
                  <YAxis type="category" dataKey="name" {...axisProps} width={104} />
                  <Tooltip
                    content={<ChartTooltip hideName format={(v) => `${v} score`} />}
                    cursor={cursorFill}
                  />
                  <Bar
                    dataKey="score"
                    name="Engagement"
                    fill={MEASURE.engagement}
                    radius={[0, 3, 3, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <PanelHeader title="Top performing" sub="By engagement score" />
              <ul className="space-y-3.5">
                {recipes.slice(0, 5).map((recipe, i) => (
                  <RankRow
                    key={recipe._id}
                    rank={i + 1}
                    title={recipe.title}
                    thumbnail={recipe.thumbnail}
                    value={recipe.engagementScore}
                    max={maxEngagement}
                    caption={`${recipe.lovedCount} loves · ${recipe.savedCount} saves`}
                  />
                ))}
              </ul>
            </Panel>
          </div>

          <Panel flush>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                All recipe engagement
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                {recipes.length} recipe{recipes.length === 1 ? "" : "s"}, {periodSub}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
                    <th
                      className="py-2.5 pl-5 pr-3 text-left text-xs font-medium w-8"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      #
                    </th>
                    <th
                      className="py-2.5 px-3 text-left text-xs font-medium"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      Recipe
                    </th>
                    {["Loves", "Saves", "Users"].map((h) => (
                      <th
                        key={h}
                        className="py-2.5 px-3 text-right text-xs font-medium"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        {h}
                      </th>
                    ))}
                    <th
                      className="py-2.5 pl-3 pr-5 text-right text-xs font-medium"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe, i) => (
                    <tr
                      key={recipe._id}
                      className="last:border-0 transition-colors duration-150 hover:bg-[var(--cs-hover)]"
                      style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                    >
                      <td
                        className="py-3 pl-5 pr-3 text-xs tabular-nums"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        {i + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="relative h-8 w-11 rounded-md overflow-hidden shrink-0"
                            style={{ backgroundColor: "var(--cs-surface-3)" }}
                          >
                            <Image
                              src={recipe.thumbnail}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <span
                            className="text-xs font-medium line-clamp-1 max-w-40"
                            style={{ color: "var(--cs-text-primary)" }}
                          >
                            {recipe.title}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-3 px-3 text-right text-xs tabular-nums"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {recipe.lovedCount}
                      </td>
                      <td
                        className="py-3 px-3 text-right text-xs tabular-nums"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {recipe.savedCount}
                      </td>
                      <td
                        className="py-3 px-3 text-right text-xs tabular-nums"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {recipe.uniqueUsersCount}
                      </td>
                      <td className="py-3 pl-3 pr-5 text-right">
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{ color: "var(--cs-text-primary)" }}
                        >
                          {recipe.engagementScore.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ChefAnalyticsPage() {
  const [period, setPeriod] = useState<RevenuePeriod>("lifetime");

  const { earnings, isLoading: earningsLoading, isFetching: earningsFetching } =
    useChefEarningsAnalytics(period);
  const { recipes, isLoading: engagementLoading, isFetching: engagementFetching } =
    useChefEngagementAnalytics(period);

  /**
   * Each section owns its loading state.
   *
   * Both queries keep their previous data across a period change, so
   * switching range no longer blanks the page — the old numbers stay
   * readable while the new ones land. The only signal that a refetch is in
   * flight is a hairline under the header, which is the smallest thing that
   * can say "working" without moving anything the reader is looking at.
   */
  const isRefetching =
    (earningsFetching && !earningsLoading) || (engagementFetching && !engagementLoading);

  return (
    <>
      <title>Analytics – Chefalio</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <HeroFigure
            value={currency(earnings?.totalEarned ?? 0)}
            caption={`${(earnings?.totalOrders ?? 0).toLocaleString()} paid order${
              earnings?.totalOrders === 1 ? "" : "s"
            } · ${PERIOD_LABEL[period]}`}
            isLoading={earningsLoading}
          />
          <PeriodTabs value={period} onChange={setPeriod} />
        </div>

        <div className="relative h-px" style={{ backgroundColor: "var(--cs-border-subtle)" }}>
          {isRefetching && (
            <span
              className="absolute inset-y-0 left-0 w-1/3 sl-refetch"
              style={{ backgroundColor: "var(--cs-accent)" }}
              aria-hidden
            />
          )}
        </div>

        <EarningsSection earnings={earnings} isLoading={earningsLoading} period={period} />
        <EngagementSection recipes={recipes} isLoading={engagementLoading} period={period} />
      </div>

      <style>{`
        .sl-refetch {
          animation: sl-refetch 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        @keyframes sl-refetch {
          from { transform: translateX(-100%); }
          to   { transform: translateX(300%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sl-refetch { animation: none; width: 100%; opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
