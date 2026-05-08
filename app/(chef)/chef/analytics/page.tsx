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

  // lifetime — use data as-is, format date labels
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
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <Icon size={14} className="text-zinc-300 dark:text-zinc-600" />
      </div>
      <p className="text-2xl font-semibold text-foreground tabular-nums leading-none">
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">{sub}</p>
      )}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h2 className="text-sm font-semibold text-foreground whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}

function EngagementBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
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
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg px-3 py-2.5 text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      <p className="text-primary font-semibold">{formatCurrency(payload[0].value)}</p>
      {payload[1] && (
        <p className="text-zinc-400 mt-0.5">{payload[1].value} orders</p>
      )}
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
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                </div>
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-48 mb-5" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-3 w-44 mb-5" />
            <Skeleton className="h-[160px] w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-36" />
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                </div>
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <Skeleton className="h-4 w-40 mb-5" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
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
            <h1 className="text-base font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              Performance overview across recipes and cookbook sales.
            </p>
          </div>

          {/* Period tabs */}
          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0">
            {PERIOD_OPTIONS.map(({ key, label, short }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={[
                  "px-3 sm:px-4 py-1.5 text-xs font-medium transition-colors",
                  period === key
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                ].join(" ")}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Faint shimmer overlay while re-fetching (no layout shift) */}
        <div className={isFetching ? "pointer-events-none opacity-60 transition-opacity duration-150" : "transition-opacity duration-150"}>

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
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Revenue Over Time</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {period === "daily" ? "Hourly" : "Daily"} paid sales, {periodSub}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary tabular-nums">
                  {formatCurrency(earnings?.totalEarned ?? 0)}
                </span>
              </div>

              {/* Fixed height — no layout shift on period switch */}
              <div className="h-[200px]">
                {!hasRevenue && period === "lifetime" ? (
                  <div className="flex items-center justify-center h-full text-sm text-zinc-400">
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#a1a1aa" }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#a1a1aa" }}
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

            {/* Orders volume — always rendered to prevent layout shift */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">
                  {period === "daily" ? "Orders Per Hour" : "Orders Per Day"}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {PERIOD_OPTIONS.find((p) => p.key === period)?.label} order volume
                </p>
              </div>

              <div className="h-[160px]">
                {!hasOrders ? (
                  <div className="flex items-center justify-center h-full text-sm text-zinc-400">
                    No orders in this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesGraph} margin={{ left: -10, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#a1a1aa" }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#a1a1aa" }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
                      />
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
              <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 py-16 flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-medium text-foreground">No engagement data</p>
                <p className="text-xs text-zinc-400">
                  {period === "lifetime"
                    ? "Publish recipes to start seeing engagement metrics."
                    : `No engagement recorded for this period.`}
                </p>
              </div>
            ) : (
              <>
                {/* Engagement charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-5">
                      Engagement by Recipe
                    </h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={recipes.slice(0, 7).map((r) => ({
                            name: r.title.length > 18 ? r.title.slice(0, 18) + "…" : r.title,
                            score: r.engagementScore,
                          }))}
                          layout="vertical"
                          margin={{ left: 0, right: 8 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} axisLine={false} width={100} />
                          <Tooltip
                            cursor={{ fill: "#f4f4f5" }}
                            contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
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

                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Top Performing</h3>
                    <div className="space-y-3">
                      {recipes.slice(0, 5).map((recipe, i) => (
                        <div key={recipe._id} className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-zinc-400 w-4 shrink-0 tabular-nums">
                            {i + 1}
                          </span>
                          <div className="relative h-9 w-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" sizes="48px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{recipe.title}</p>
                            <EngagementBar value={recipe.engagementScore} max={maxEngagement} color="#a7d129" />
                            <div className="flex gap-3 mt-0.5">
                              <span className="text-[11px] text-zinc-400">{recipe.lovedCount} loves</span>
                              <span className="text-[11px] text-zinc-400">{recipe.savedCount} saves</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
                            {recipe.engagementScore.toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full table */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                  <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-semibold text-foreground">All Recipe Engagement</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium text-zinc-400 w-8">#</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400">Recipe</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-zinc-400">Loves</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-zinc-400">Saves</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-zinc-400">Users</th>
                          <th className="py-2.5 pl-3 pr-5 text-right text-xs font-medium text-zinc-400">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipes.map((recipe, i) => (
                          <tr
                            key={recipe._id}
                            className="border-b border-zinc-50 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                          >
                            <td className="py-3 pl-5 pr-3 text-xs text-zinc-400 tabular-nums">{i + 1}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="relative h-8 w-11 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                                  <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" sizes="44px" />
                                </div>
                                <span className="text-xs font-medium text-foreground line-clamp-1 max-w-[160px]">
                                  {recipe.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-end gap-2">
                                <EngagementBar value={recipe.lovedCount} max={maxLoved} color="#f87171" />
                                <span className="text-xs tabular-nums text-foreground w-8 text-right">{recipe.lovedCount}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right text-xs text-foreground tabular-nums">{recipe.savedCount}</td>
                            <td className="py-3 px-3 text-right text-xs text-foreground tabular-nums">{recipe.uniqueUsersCount}</td>
                            <td className="py-3 pl-3 pr-5 text-right">
                              <span className="text-xs font-semibold text-primary tabular-nums">
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

        </div>
      </div>
    </>
  );
}
