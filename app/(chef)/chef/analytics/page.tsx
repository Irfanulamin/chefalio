"use client";

import { useState } from "react";
import {
  useChefEngagementAnalytics,
  useChefEarningsAnalytics,
  type RevenuePeriod,
  type SalesGraphPoint,
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
  Cell,
} from "recharts";
import {
  CurrencyDollarIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  UsersIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const found = map.get(key);
      return { date: label, amount: found?.amount ?? 0, orders: found?.orders ?? 0 };
    });
  }

  return data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}

const PERIOD_OPTIONS: { key: RevenuePeriod; label: string; short: string }[] = [
  { key: "daily",    label: "Daily",    short: "D" },
  { key: "weekly",   label: "Weekly",   short: "W" },
  { key: "monthly",  label: "Monthly",  short: "M" },
  { key: "lifetime", label: "Lifetime", short: "L" },
];

const PERIOD_LABEL: Record<RevenuePeriod, string> = {
  daily:    "today",
  weekly:   "last 7 days",
  monthly:  "last 30 days",
  lifetime: "all time",
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);

const CHART_GRID_COLOR = "var(--cs-border-subtle)";
const TICK_COLOR = "var(--cs-text-tertiary)";
const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid var(--cs-border-subtle)",
  fontSize: "12px",
  backgroundColor: "var(--cs-surface-2)",
  color: "var(--cs-text-primary)",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>{label}</span>
        <Icon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
      </div>
      <p className="text-2xl font-semibold tabular-nums leading-none" style={{ color: "var(--cs-text-primary)" }}>
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs" style={{ color: "var(--cs-text-tertiary)" }}>{sub}</p>
      )}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h2 className="text-sm font-semibold whitespace-nowrap" style={{ color: "var(--cs-text-primary)" }}>
        {title}
      </h2>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--cs-surface-3)" }} />
    </div>
  );
}

function EngagementBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--cs-surface-3)" }}>
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function SalesTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg shadow-lg px-3 py-2.5 text-xs"
      style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--cs-text-primary)" }}>{label}</p>
      <p className="font-semibold" style={{ color: "var(--cs-accent)" }}>{formatCurrency(payload[0].value)}</p>
      {payload[1] && (
        <p className="mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>{payload[1].value} orders</p>
      )}
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3.5 w-3.5 rounded-sm" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function SkeletonPanel({ height = 44 }: { height?: number }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
    >
      <Skeleton className="h-4 w-40 mb-2" />
      <Skeleton className="h-3 w-48 mb-5" />
      <Skeleton className={`h-[${height}px] w-full rounded-lg`} style={{ height }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChefAnalyticsPage() {
  const [period, setPeriod] = useState<RevenuePeriod>("lifetime");

  const { earnings, isLoading: earningsLoading, isFetching: earningsFetching } =
    useChefEarningsAnalytics(period);
  const { recipes, isLoading: engLoading, isFetching: engFetching } =
    useChefEngagementAnalytics(period);

  const isInitialLoading = earningsLoading || engLoading;
  const isFetching = earningsFetching || engFetching;

  const salesGraph = buildSalesGraph(earnings?.salesGraph ?? [], period);
  const hasOrders = salesGraph.some((d) => d.orders > 0);
  const hasRevenue = salesGraph.some((d) => d.amount > 0);

  const maxEngagement = Math.max(...recipes.map((r) => r.engagementScore), 1);
  const maxLoved = Math.max(...recipes.map((r) => r.lovedCount), 1);

  const totalLoves = recipes.reduce((a, r) => a + r.lovedCount, 0);
  const totalSaves = recipes.reduce((a, r) => a + r.savedCount, 0);
  const totalUniqueUsers = recipes.reduce((a, r) => a + r.uniqueUsersCount, 0);
  const totalEngagement = recipes.reduce((a, r) => a + r.engagementScore, 0);

  const periodSub = PERIOD_LABEL[period];

  if (isInitialLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-72" />
          </div>
          <Skeleton className="h-9 w-52 rounded-lg" />
        </div>
        <div className="space-y-4">
          <SectionDivider title="Earnings" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonPanel height={200} />
          <SkeletonPanel height={160} />
        </div>
        <div className="space-y-4">
          <SectionDivider title="Recipe Engagement" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonPanel height={200} />
            <div
              className="rounded-xl p-5"
              style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
            >
              <Skeleton className="h-4 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-4" />
                    <Skeleton className="h-9 w-12 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Analytics – Chefalio</title>

      <div className="space-y-6 max-w-7xl mx-auto">

        {/* ── Header + period selector ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--cs-text-primary)" }}>Analytics</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              Performance overview across recipes and cookbook sales.
            </p>
          </div>

          {/* Period tabs */}
          <div
            className="flex rounded-lg overflow-hidden shrink-0"
            style={{ border: "1px solid var(--cs-border-default)" }}
          >
            {PERIOD_OPTIONS.map(({ key, label, short }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className="px-3 sm:px-4 py-1.5 text-xs font-medium transition-colors duration-150"
                style={
                  period === key
                    ? { backgroundColor: "var(--cs-accent)", color: "#111110" }
                    : { backgroundColor: "var(--cs-surface-2)", color: "var(--cs-text-secondary)" }
                }
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Faint shimmer overlay while re-fetching */}
        <div className={isFetching ? "pointer-events-none opacity-60 transition-opacity duration-150" : "transition-opacity duration-150"}>
 {/* ── Engagement ── */}
          <div className="space-y-4 mt-6">
            <SectionDivider title="Recipe Engagement" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                icon={HeartIcon}
                label="Loves"
                value={totalLoves.toLocaleString()}
                sub={`Across recipes, ${periodSub}`}
              />
              <MetricCard
                icon={BookmarkSimpleIcon}
                label="Saves"
                value={totalSaves.toLocaleString()}
                sub={`Across recipes, ${periodSub}`}
              />
              <MetricCard
                icon={UsersIcon}
                label="Unique Engagers"
                value={totalUniqueUsers.toLocaleString()}
                sub={`Distinct users, ${periodSub}`}
              />
              <MetricCard
                icon={TrendUpIcon}
                label="Engagement Score"
                value={totalEngagement.toLocaleString()}
                sub="Loves×2 + Saves×1.5"
              />
            </div>

            {recipes.length === 0 ? (
              <div
                className="rounded-xl border-dashed py-16 flex flex-col items-center gap-2 text-center"
                style={{ border: "1px dashed var(--cs-border-subtle)" }}
              >
                <p className="text-sm font-medium" style={{ color: "var(--cs-text-primary)" }}>No engagement data</p>
                <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
                  {period === "lifetime"
                    ? "Publish recipes to start seeing engagement metrics."
                    : `No engagement recorded for this period.`}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div
                    className="rounded-xl p-5"
                    style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
                  >
                    <h3 className="text-sm font-semibold mb-5" style={{ color: "var(--cs-text-primary)" }}>
                      Engagement by Recipe
                    </h3>
                    <div className="h-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={recipes.slice(0, 7).map((r) => ({
                            name: r.title.length > 18 ? r.title.slice(0, 18) + "…" : r.title,
                            score: r.engagementScore,
                          }))}
                          layout="vertical"
                          margin={{ left: 0, right: 8 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: TICK_COLOR }} tickLine={false} axisLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: TICK_COLOR }} tickLine={false} axisLine={false} width={100} />
                          <Tooltip
                            cursor={{ fill: "var(--cs-surface-3)" }}
                            contentStyle={TOOLTIP_STYLE}
                          />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                            {recipes.slice(0, 7).map((_, i) => (
                              <Cell key={i} fill={i === 0 ? "#a7d129" : i < 3 ? "#c8e87a" : "#e4f4a8"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-5"
                    style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
                  >
                    <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--cs-text-primary)" }}>Top Performing</h3>
                    <div className="space-y-3">
                      {recipes.slice(0, 5).map((recipe, i) => (
                        <div key={recipe._id} className="flex items-center gap-3">
                          <span className="text-xs font-semibold w-4 shrink-0 tabular-nums" style={{ color: "var(--cs-text-tertiary)" }}>
                            {i + 1}
                          </span>
                          <div
                            className="relative h-9 w-12 rounded-lg overflow-hidden shrink-0"
                            style={{ backgroundColor: "var(--cs-surface-3)" }}
                          >
                            <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" sizes="48px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: "var(--cs-text-primary)" }}>{recipe.title}</p>
                            <EngagementBar value={recipe.engagementScore} max={maxEngagement} color="#a7d129" />
                            <div className="flex gap-3 mt-0.5">
                              <span className="text-[11px]" style={{ color: "var(--cs-text-tertiary)" }}>{recipe.lovedCount} loves</span>
                              <span className="text-[11px]" style={{ color: "var(--cs-text-tertiary)" }}>{recipe.savedCount} saves</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold tabular-nums shrink-0" style={{ color: "var(--cs-accent)" }}>
                            {recipe.engagementScore.toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full table */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
                >
                  <div
                    className="px-5 py-4"
                    style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                  >
                    <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>All Recipe Engagement</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
                          <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium w-8" style={{ color: "var(--cs-text-tertiary)" }}>#</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Recipe</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Loves</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Saves</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Users</th>
                          <th className="py-2.5 pl-3 pr-5 text-right text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipes.map((recipe, i) => (
                          <tr
                            key={recipe._id}
                            className="last:border-0 hover:bg-(--cs-surface-3) transition-colors duration-150"
                            style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                          >
                            <td className="py-3 pl-5 pr-3 text-xs tabular-nums" style={{ color: "var(--cs-text-tertiary)" }}>{i + 1}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="relative h-8 w-11 rounded-md overflow-hidden shrink-0"
                                  style={{ backgroundColor: "var(--cs-surface-3)" }}
                                >
                                  <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" sizes="44px" />
                                </div>
                                <span className="text-xs font-medium line-clamp-1 max-w-40" style={{ color: "var(--cs-text-primary)" }}>
                                  {recipe.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-end gap-2">
                                <EngagementBar value={recipe.lovedCount} max={maxLoved} color="#f87171" />
                                <span className="text-xs tabular-nums w-8 text-right" style={{ color: "var(--cs-text-primary)" }}>{recipe.lovedCount}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right text-xs tabular-nums" style={{ color: "var(--cs-text-primary)" }}>{recipe.savedCount}</td>
                            <td className="py-3 px-3 text-right text-xs tabular-nums" style={{ color: "var(--cs-text-primary)" }}>{recipe.uniqueUsersCount}</td>
                            <td className="py-3 pl-3 pr-5 text-right">
                              <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--cs-accent)" }}>
                                {recipe.engagementScore.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* ── Earnings ── */}
          <div className="space-y-4">
            <SectionDivider title="Earnings" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                icon={CurrencyDollarIcon}
                label="Revenue"
                value={formatCurrency(earnings?.totalEarned ?? 0)}
                sub={`Cookbook sales, ${periodSub}`}
              />
              <MetricCard
                icon={TrendUpIcon}
                label="Your Profit"
                value={formatCurrency(earnings?.totalProfit ?? 0)}
                sub={`At ${earnings?.profitRate ?? "80%"} rate`}
              />
              <MetricCard
                icon={CurrencyDollarIcon}
                label="Orders"
                value={(earnings?.totalOrders ?? 0).toLocaleString()}
                sub={`Paid orders, ${periodSub}`}
              />
              <MetricCard
                icon={UsersIcon}
                label="Avg. Order Value"
                value={
                  earnings?.totalOrders
                    ? formatCurrency((earnings.totalEarned ?? 0) / earnings.totalOrders)
                    : "$0"
                }
                sub="Per transaction"
              />
            </div>

            {/* Revenue over time */}
            <div
              className="rounded-xl p-5"
              style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>Revenue Over Time</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                    {period === "daily" ? "Hourly" : "Daily"} paid sales, {periodSub}
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--cs-accent)" }}>
                  {formatCurrency(earnings?.totalEarned ?? 0)}
                </span>
              </div>

              <div className="h-50">
                {!hasRevenue && period === "lifetime" ? (
                  <div className="flex items-center justify-center h-full text-sm" style={{ color: "var(--cs-text-tertiary)" }}>
                    No sales data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesGraph} margin={{ left: -10, right: 8 }}>
                      <defs>
                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a7d129" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#a7d129" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: TICK_COLOR }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: TICK_COLOR }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip content={<SalesTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#a7d129"
                        strokeWidth={2}
                        fill="url(#earningsGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: "#a7d129" }}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Orders volume */}
            <div
              className="rounded-xl p-5"
              style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
            >
              <div className="mb-5">
                <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                  {period === "daily" ? "Orders Per Hour" : "Orders Per Day"}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                  {PERIOD_OPTIONS.find((p) => p.key === period)?.label} order volume
                </p>
              </div>

              <div className="h-40">
                {!hasOrders ? (
                  <div className="flex items-center justify-center h-full text-sm" style={{ color: "var(--cs-text-tertiary)" }}>
                    No orders in this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesGraph} margin={{ left: -10, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: TICK_COLOR }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: TICK_COLOR }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="orders" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                        {salesGraph.map((_, i) => (
                          <Cell key={i} fill={i % 2 === 0 ? "#6366f1" : "#a5b4fc"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

         

        </div>
      </div>
    </>
  );
}
