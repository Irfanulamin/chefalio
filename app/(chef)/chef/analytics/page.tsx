"use client";

import {
  useChefEngagementAnalytics,
  useChefEarningsAnalytics,
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
  ChartLineUpIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import GridLoader from "@/components/ui/GridLoading";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(val);

// ─── Custom tooltip ───────────────────────────────────────────────────────────

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
    <div className="rounded-xl border border-border bg-white dark:bg-zinc-900 shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-primary font-bold">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p className="text-muted-foreground">{payload[1].value} orders</p>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "#A7D129",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-5 flex items-start gap-4 shadow-sm">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${accent}18` }}
      >
        <Icon size={20} weight="fill" style={{ color: accent }} />
      </span>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground leading-none">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Engagement row bar ───────────────────────────────────────────────────────

function EngagementBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="relative h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChefAnalyticsPage() {
  const {
    recipes,
    engagementData,
    isLoading: engLoading,
  } = useChefEngagementAnalytics();
  const { earnings, isLoading: earningsLoading } = useChefEarningsAnalytics();

  const isLoading = engLoading || earningsLoading;

  const maxEngagement = Math.max(...recipes.map((r) => r.engagementScore), 1);
  const maxLoved = Math.max(...recipes.map((r) => r.lovedCount), 1);

  const salesGraph = (earnings?.salesGraph ?? []).map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const totalEngagement = recipes.reduce((a, r) => a + r.engagementScore, 0);
  const totalLoves = recipes.reduce((a, r) => a + r.lovedCount, 0);
  const totalSaves = recipes.reduce((a, r) => a + r.savedCount, 0);
  const totalUniqueUsers = recipes.reduce((a, r) => a + r.uniqueUsersCount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GridLoader label="Loading analytics..." />
      </div>
    );
  }

  return (
    <>
      <title>Analytics – Chefalio Chef</title>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ChartLineUpIcon size={20} weight="fill" className="text-primary" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Deep insights across your recipes and cookbook sales
            </p>
          </div>
        </div>

        {/* ── EARNINGS SECTION ── */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <CurrencyDollarIcon
              size={16}
              weight="fill"
              className="text-emerald-500"
            />
            <h2 className="text-base font-bold text-foreground">
              Earnings Overview
            </h2>
            <span className="ml-2 text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
              80% profit rate
            </span>
          </div>

          {/* Earnings stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={CurrencyDollarIcon}
              label="Total Revenue"
              value={formatCurrency(earnings?.totalEarned ?? 0)}
              sub="From cookbook sales"
              accent="#10b981"
            />
            <StatCard
              icon={SparkleIcon}
              label="Your Profit"
              value={formatCurrency(earnings?.totalProfit ?? 0)}
              sub={`At ${earnings?.profitRate ?? "80%"} rate`}
              accent="#A7D129"
            />
            <StatCard
              icon={TrendUpIcon}
              label="Total Orders"
              value={earnings?.totalOrders ?? 0}
              sub="Paid cookbook orders"
              accent="#6366f1"
            />
            <StatCard
              icon={UsersIcon}
              label="Avg. Order Value"
              value={
                earnings?.totalOrders
                  ? formatCurrency(
                      (earnings.totalEarned ?? 0) / earnings.totalOrders,
                    )
                  : "$0.00"
              }
              sub="Per transaction"
              accent="#f59e0b"
            />
          </div>

          {/* Sales area chart */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Revenue Over Time
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily paid sales
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                {formatCurrency(earnings?.totalEarned ?? 0)} total
              </span>
            </div>

            {salesGraph.length === 0 ? (
              <div className="flex items-center justify-center h-44 text-muted-foreground text-sm">
                No sales data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesGraph} margin={{ left: 0, right: 8 }}>
                  <defs>
                    <linearGradient
                      id="earningsGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#A7D129"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#A7D129" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<SalesTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#A7D129"
                    strokeWidth={2.5}
                    fill="url(#earningsGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#A7D129" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders per day bar chart */}
          {salesGraph.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Orders Per Day
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily order volume
                </p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={salesGraph} margin={{ left: 0, right: 8 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                    itemStyle={{
                      color: "#A7D129",
                      fontWeight: 600,
                    }}
                    wrapperClassName="!bg-white dark:!bg-black !text-black dark:!text-white !rounded-xl"
                  />
                  <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                    {salesGraph.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i % 2 === 0 ? "#6366f1" : "#818cf8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* ── ENGAGEMENT SECTION ── */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <HeartIcon size={16} weight="fill" className="text-rose-500" />
            <h2 className="text-base font-bold text-foreground">
              Recipe Engagement
            </h2>
            <span className="ml-2 text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
              Top {engagementData?.totalReturned ?? 0} recipes
            </span>
          </div>

          {/* Engagement stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={HeartIcon}
              label="Total Loves"
              value={totalLoves.toLocaleString()}
              sub="Across all recipes"
              accent="#ef4444"
            />
            <StatCard
              icon={BookmarkSimpleIcon}
              label="Total Saves"
              value={totalSaves.toLocaleString()}
              sub="Across all recipes"
              accent="#6366f1"
            />
            <StatCard
              icon={UsersIcon}
              label="Unique Engagers"
              value={totalUniqueUsers.toLocaleString()}
              sub="Distinct users"
              accent="#f59e0b"
            />
            <StatCard
              icon={TrendUpIcon}
              label="Engagement Score"
              value={totalEngagement.toLocaleString()}
              sub="Loves×2 + Saves×1.5"
              accent="#A7D129"
            />
          </div>

          {/* Engagement bar chart + top-10 table split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Horizontal engagement bars */}
            <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-5">
                Engagement by Recipe
              </h3>

              {recipes.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  No engagement data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={recipes.slice(0, 7).map((r) => ({
                      name:
                        r.title.length > 18
                          ? r.title.slice(0, 18) + "…"
                          : r.title,
                      score: r.engagementScore,
                      loves: r.lovedCount,
                    }))}
                    layout="vertical"
                    margin={{ left: 0, right: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      cursor={{ fill: "#f3f4f6" }}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid rgb(229 231 235)",
                      }}
                      wrapperClassName="!bg-white dark:!bg-black !text-black dark:!text-white !rounded-xl"
                      itemStyle={{
                        color: "#A7D129",
                        fontWeight: 600,
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {recipes.slice(0, 7).map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0 ? "#A7D129" : i < 3 ? "#c3e05a" : "#e8f5a0"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top recipes table */}
            <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-5">
                Top Performing Recipes
              </h3>

              {recipes.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                  No recipes yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recipes.slice(0, 5).map((recipe, i) => (
                    <div key={recipe._id} className="flex items-center gap-3">
                      {/* Rank */}
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          i === 0
                            ? "bg-amber-400 text-black"
                            : i === 1
                              ? "bg-zinc-200 text-zinc-700"
                              : i === 2
                                ? "bg-orange-200 text-orange-700"
                                : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground",
                        ].join(" ")}
                      >
                        {i + 1}
                      </span>

                      {/* Thumbnail */}
                      <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={recipe.thumbnail}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {recipe.title}
                        </p>
                        <EngagementBar
                          value={recipe.engagementScore}
                          max={maxEngagement}
                          color="#A7D129"
                        />
                        <div className="flex gap-3 mt-1">
                          <span className="text-[10px] text-rose-500">
                            ❤️ {recipe.lovedCount}
                          </span>
                          <span className="text-[10px] text-indigo-500">
                            🔖 {recipe.savedCount}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            👤 {recipe.uniqueUsersCount}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <span className="text-xs font-bold text-primary shrink-0">
                        {recipe.engagementScore.toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full engagement table */}
          {recipes.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm overflow-x-auto">
              <h3 className="text-sm font-semibold text-foreground mb-5">
                All Recipe Engagement
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border/60">
                    <th className="text-left pb-3 pl-2">#</th>
                    <th className="text-left pb-3">Recipe</th>
                    <th className="text-right pb-3">❤️ Loves</th>
                    <th className="text-right pb-3">🔖 Saves</th>
                    <th className="text-right pb-3">👤 Users</th>
                    <th className="text-right pb-3 pr-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe, i) => (
                    <tr
                      key={recipe._id}
                      className="border-b border-border/30 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3 pl-2 text-muted-foreground text-xs w-8">
                        {i + 1}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-11 rounded-md overflow-hidden shrink-0">
                            <Image
                              src={recipe.thumbnail}
                              alt={recipe.title}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground line-clamp-1 max-w-45">
                            {recipe.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <EngagementBar
                            value={recipe.lovedCount}
                            max={maxLoved}
                            color="#ef4444"
                          />
                          <span className="text-xs font-semibold w-8 text-right">
                            {recipe.lovedCount}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-xs font-medium text-foreground">
                        {recipe.savedCount}
                      </td>
                      <td className="py-3 text-right text-xs font-medium text-foreground">
                        {recipe.uniqueUsersCount}
                      </td>
                      <td className="py-3 pr-2 text-right">
                        <span className="text-xs font-bold text-primary">
                          {recipe.engagementScore.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
