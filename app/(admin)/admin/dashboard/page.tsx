"use client";

import {
  useUserAnalytics,
  useAdminEarnings,
  useAdminRecipeInteractions,
  useAdminRecipeTrend,
  useAdminTopChefs,
} from "@/hooks/useAdmin";
import { useDashboardAnalytics } from "@/hooks/useChefs";
import { useProfile } from "@/hooks/useAuth";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  UsersIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChefHatIcon,
  CrownSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal, StatCard, Panel } from "@/components/Admin/AdminUI";
import { cn } from "@/lib/utils";

// Difficulty is a severity dimension, not a category — it draws from the
// reserved status triplets (the same ones the recipe table's pills use)
// rather than the categorical data-vis ramp, so "advance" always reads as
// the same red everywhere it appears in the console.
//
// Keys must match the schema's actual enum (`beginner` | `intermediate` |
// `advance` — see recipe.schema.ts). This previously keyed on
// `easy`/`medium`/`hard`, which never matched, so every slice fell through
// to the same fallback color and the pie read as one undifferentiated hue.
const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "var(--cs-success-fg)",
  intermediate: "var(--cs-warning-fg)",
  advance: "var(--cs-danger-fg)",
};
const FALLBACK_COLORS = ["var(--cs-success-fg)", "var(--cs-warning-fg)", "var(--cs-danger-fg)", "var(--cv-4)", "var(--cv-5)"];

// Chart chrome — grid, axis tick and label all read from the data-vis
// tokens so a chart doesn't go illegible the moment dark mode is on; these
// used to be `#f4f4f5` / `#a1a1aa` literals baked for a white card only.
// The grid is solid rather than dashed: a dashed hairline is what a
// spreadsheet export looks like, and this dashboard isn't one.
const GRID_STROKE = "var(--cv-grid)";
const TICK_STYLE = { fontSize: 10, fill: "var(--cv-label)" };
const TOOLTIP_STYLE = {
  borderRadius: "12px",
  border: "1px solid var(--cs-border-subtle)",
  backgroundColor: "var(--cs-surface-1)",
  color: "var(--cs-text-primary)",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "var(--cs-shadow-float)",
};
/** Bar hover column — a soft wash in the chart's own accent rather than the
   flat gray recharts ships by default, so the highlight still reads as
   belonging to this card. */
const cursorFill = (accent: string) => ({ fill: `color-mix(in oklab, ${accent} 10%, transparent)` });

function ChartCard({
  title,
  children,
  index = 0,
  accent = "var(--cv-1)",
  headline,
  hero = false,
  className,
}: {
  title: string;
  children: React.ReactNode;
  index?: number;
  /** A CSS color driving this card's signature hue — echoed as a top edge
     and a soft corner glow behind the plot, so each card reads as its own
     instrument, not an interchangeable gray tile. Chrome only; never data
     ink. */
  accent?: string;
  /** A big inline number beside the title — the hero total the chart below
     it explains, the way a real analytics product leads with the figure
     and uses the chart to justify it rather than making you read axes. */
  headline?: React.ReactNode;
  hero?: boolean;
  className?: string;
}) {
  return (
    <Reveal delay={index * 0.03} className={className}>
      <Panel
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(90deg, ${accent}, color-mix(in oklab, ${accent} 15%, transparent)), radial-gradient(220px 140px at calc(100% + 40px) -40px, color-mix(in oklab, ${accent} ${hero ? 16 : 12}%, transparent), transparent 70%)`,
          backgroundSize: "100% 3px, auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div className="flex items-end justify-between gap-3 mb-5 relative">
          <h2 className={hero ? "ui-heading text-foreground" : "ui-subheading text-foreground"}>{title}</h2>
          {headline && (
            <span
              className={cn("ui-numeric font-semibold leading-none shrink-0", hero ? "text-2xl" : "text-base")}
              style={{ color: accent }}
            >
              {headline}
            </span>
          )}
        </div>
        <div className="relative">{children}</div>
      </Panel>
    </Reveal>
  );
}

function EmptyState({ height = 190 }: { height?: number }) {
  return (
    <div
      className="flex items-center justify-center text-sm"
      style={{ height, color: "var(--cs-text-tertiary)" }}
    >
      No data yet
    </div>
  );
}

export default function AdminDashboardPage() {
  const { profile } = useProfile();
  const { analytics: userAnalytics, isLoading: usersLoading } =
    useUserAnalytics();
  const { analytics: recipeAnalytics, isLoading: recipesLoading } =
    useDashboardAnalytics();
  const { earnings, isLoading: earningsLoading } = useAdminEarnings();
  const { interactions, isLoading: interactionsLoading } =
    useAdminRecipeInteractions();
  const { trend, isLoading: trendLoading } = useAdminRecipeTrend();
  const { topChefs, isLoading: chefsLoading } = useAdminTopChefs();

  const isLoading =
    usersLoading ||
    recipesLoading ||
    earningsLoading ||
    interactionsLoading ||
    trendLoading ||
    chefsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ui-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              </div>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[0, 1].map((j) => (
              <div key={j} className="ui-card p-5">
                <Skeleton className="h-4 w-36 mb-5" />
                <Skeleton className="h-44 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  const firstName = profile?.fullName?.split(" ")[0] ?? "Admin";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // ── Users by role breakdown ────────────────────────────────────────────────
  const roleBreakdown = [
    {
      label: "Members",
      value: userAnalytics?.totalMembers ?? 0,
      active: userAnalytics?.activeMembers ?? 0,
      icon: UsersIcon,
    },
    {
      label: "Chefs",
      value: userAnalytics?.totalChefs ?? 0,
      active: userAnalytics?.activeChefs ?? 0,
      icon: ChefHatIcon,
    },
    {
      label: "Admins",
      value: userAnalytics?.totalAdmins ?? 0,
      active: userAnalytics?.activeAdmins ?? 0,
      icon: CrownSimpleIcon,
    },
  ];
  const totalForPct = roleBreakdown.reduce((s, r) => s + r.value, 0) || 1;

  // ── New users over time — pivot recentJoinedByRole ─────────────────────────
  const pivotMap = new Map<string, { user: number; chef: number }>();
  for (const item of userAnalytics?.recentJoinedByRole ?? []) {
    const entry = pivotMap.get(item.date) ?? { user: 0, chef: 0 };
    if (item.role === "user") entry.user += item.count;
    if (item.role === "chef") entry.chef += item.count;
    pivotMap.set(item.date, entry);
  }
  const userGrowthData = Array.from(pivotMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({
      date: date.slice(5),
      Members: v.user,
      Chefs: v.chef,
    }));

  // ── Recipe difficulty pie ──────────────────────────────────────────────────
  const difficultyData = (recipeAnalytics?.recipesPerDifficulty ?? []).map(
    (d) => ({
      name:
        d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
      value: d.count,
      fill:
        DIFFICULTY_COLORS[d.difficulty.toLowerCase()] ??
        FALLBACK_COLORS[0],
    })
  );

  // ── Top engaged recipes ────────────────────────────────────────────────────
  const topEngagedData = (interactions?.topEngaged ?? []).map((r) => ({
    name:
      r.recipe?.title?.length > 22
        ? r.recipe.title.slice(0, 22) + "…"
        : (r.recipe?.title ?? "Unknown"),
    score: Math.round(r.engagementScore),
    loves: r.totalLoves,
    saves: r.totalSaves,
  }));

  // ── Recipe upload trend labels ─────────────────────────────────────────────
  const uploadTrendData = trend.map((t) => ({
    date: t.date.slice(5),
    Recipes: t.count,
  }));

  // ── Top chefs bar ──────────────────────────────────────────────────────────
  const topChefsBarData = topChefs.map((c) => ({
    name: c.fullName?.split(" ")[0] ?? c.username,
    revenue: c.totalRevenue,
    sales: c.totalSales,
  }));

  // ── KPI sparklines — trailing real series, not fabricated ─────────────────
  const usersTrend = userGrowthData.map((d) => d.Members + d.Chefs);
  const recipesTrend = uploadTrendData.map((d) => d.Recipes);
  const revenueTrend = (earnings?.salesGraph ?? []).map((d) => d.amount);
  // Profit is a fixed cut of revenue, so its trend is the same series scaled
  // by that rate — not a different fabricated shape, the same real curve.
  const profitRateNum = parseFloat(earnings?.profitRate ?? "") / 100 || 0.2;
  const profitTrend = revenueTrend.map((v) => v * profitRateNum);

  return (
    <>
      <title>Dashboard – Chefalio Admin</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page header */}
        <Reveal>
          <h1 className="ui-title text-foreground">
            {greeting}, {firstName}
          </h1>
          <p className="ui-caption mt-0.5" style={{ color: "var(--cs-text-secondary)" }}>
            Platform overview across all users and content.
          </p>
        </Reveal>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            index={0}
            label="Total Users"
            value={(userAnalytics?.totalUsers ?? 0).toLocaleString()}
            sub={`${userAnalytics?.totalMembers ?? 0} members · ${userAnalytics?.totalChefs ?? 0} chefs`}
            icon={UsersIcon}
            tone="info"
            trend={usersTrend}
          />
          <StatCard
            index={1}
            label="Total Recipes"
            value={(recipeAnalytics?.totalRecipes ?? 0).toLocaleString()}
            sub="Published"
            icon={ForkKnifeIcon}
            tone="accent"
            trend={recipesTrend}
          />
          <StatCard
            index={2}
            label="Total Revenue"
            value={`$${(earnings?.totalRevenue ?? 0).toFixed(2)}`}
            sub={`${earnings?.totalOrders ?? 0} orders`}
            icon={CurrencyDollarIcon}
            tone="success"
            trend={revenueTrend}
          />
          <StatCard
            index={3}
            label="Platform Profit"
            value={`$${(earnings?.totalProfit ?? 0).toFixed(2)}`}
            sub={earnings?.profitRate ?? "20% cut"}
            icon={BookOpenIcon}
            tone="violet"
            trend={profitTrend}
          />
        </div>

        {/* ── Hero: Revenue over time ──────────────────────────────────────
             The one number the rest of the dashboard exists to explain gets
             its own full-width row, a taller plot, and the total inline in
             its header — the way a real analytics product leads with the
             figure instead of making you hunt for it in a small multiple. */}
        <ChartCard
          title="Revenue Over Time"
          accent="var(--cs-success-fg)"
          headline={`$${(earnings?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          hero
        >
          {(earnings?.salesGraph ?? []).length === 0 ? (
            <EmptyState height={260} />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={earnings?.salesGraph ?? []}
                margin={{ left: -20, right: 8 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--cs-success-fg)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--cs-success-fg)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={GRID_STROKE}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={TICK_STYLE}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={TICK_STYLE}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ stroke: "var(--cs-success-fg)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  formatter={(val) => [`$${Number(val).toFixed(2)}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--cs-success-fg)"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--cs-surface-1)", fill: "var(--cs-success-fg)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* ── Row: Users by role + New user registrations ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Users by Role" accent="var(--cv-1)">
            <div className="space-y-3">
              {roleBreakdown.map((r) => {
                const pct = Math.round((r.value / totalForPct) * 100);
                return (
                  <div key={r.label} className="flex items-center gap-3">
                    <r.icon size={13} className="shrink-0" style={{ color: "var(--cs-text-tertiary)" }} />
                    <span className="text-xs w-14 shrink-0" style={{ color: "var(--cs-text-secondary)" }}>
                      {r.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground ui-numeric w-8 text-right">
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 grid grid-cols-3 gap-2" style={{ borderTop: "1px solid var(--cs-border-subtle)" }}>
              {roleBreakdown.map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <span className="text-lg font-semibold text-foreground ui-numeric">
                    {r.active}
                  </span>
                  <span className="text-[10px] text-center leading-tight" style={{ color: "var(--cs-text-tertiary)" }}>
                    Active {r.label}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="New User Registrations (Last 30 Days)" index={1} accent="var(--cv-2)">
            {userGrowthData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={userGrowthData}
                  margin={{ left: -20, right: 8 }}
                >
                  <defs>
                    <linearGradient id="memberBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cv-1)" stopOpacity={0.95} />
                      <stop
                        offset="100%"
                        stopColor="var(--cv-1)"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                    <linearGradient id="chefBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cv-2)" stopOpacity={0.95} />
                      <stop
                        offset="100%"
                        stopColor="var(--cv-2)"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "var(--cv-label)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={cursorFill("var(--cv-1)")} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px", color: "var(--cs-text-secondary)" }}
                  />
                  <Bar
                    dataKey="Members"
                    stackId="a"
                    fill="url(#memberBar)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="Chefs"
                    stackId="a"
                    fill="url(#chefBar)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Leaderboard row: three ranked lists side by side ──────────────
             Grouping the "top N" list-style cards into one three-across row
             — instead of pairing each with an unrelated chart — is what
             breaks the "every row is two identical gray boxes" monotony. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Top Selling Cookbooks" accent="var(--cv-3)">
            {(earnings?.top3MostSoldCookbooks ?? []).length === 0 ? (
              <EmptyState height={140} />
            ) : (
              <div className="space-y-1">
                {earnings?.top3MostSoldCookbooks.map((cb, i) => (
                  <div
                    key={cb.cookbookId}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors duration-150 hover:bg-(--cs-hover)"
                  >
                    <span className="text-xs font-bold w-4 shrink-0 text-center" style={{ color: "var(--cs-text-tertiary)" }}>
                      {i + 1}
                    </span>
                    <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                      <Image
                        src={cb.cookbookImage}
                        alt={cb.cookbookTitle}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {cb.cookbookTitle}
                      </p>
                      <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>{cb.totalSold} sold</p>
                    </div>
                    <span className="text-xs font-semibold text-primary ui-numeric">
                      ${cb.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>

          <ChartCard title="Top Recipe Authors" index={1} accent="var(--primary)">
            {(recipeAnalytics?.top3MostUploadedAuthors ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-1">
                {recipeAnalytics?.top3MostUploadedAuthors.map(
                  (author, i) => {
                    const medals = ["🥇", "🥈", "🥉"];
                    const maxCount =
                      recipeAnalytics.top3MostUploadedAuthors[0]?.count || 1;
                    const pct = Math.round((author.count / maxCount) * 100);
                    return (
                      <div key={String(author.userId)} className="px-2 py-3">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-base leading-none">
                            {medals[i] ?? `#${i + 1}`}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {author.fullName}
                            </p>
                            <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
                              @{author.username}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-primary ui-numeric shrink-0">
                            {author.count} recipes
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </ChartCard>

          <ChartCard title="Top Chefs by Revenue" index={2} accent="var(--cv-6)">
            {topChefsBarData.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-1">
                {topChefsBarData.slice(0, 5).map((c, i) => {
                  const maxRevenue = topChefsBarData[0]?.revenue || 1;
                  const pct = Math.round((c.revenue / maxRevenue) * 100);
                  return (
                    <div key={c.name} className="px-2 py-2.5">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {i + 1}. {c.name}
                        </span>
                        <span className="text-xs font-semibold ui-numeric shrink-0" style={{ color: "var(--cv-6)" }}>
                          ${c.revenue.toFixed(0)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--cs-surface-3)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: "var(--cv-6)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── Row: Recipe difficulty mix + Top recipe tags ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Top Recipe Tags" accent="var(--cv-4)">
            {(recipeAnalytics?.topTags ?? []).length === 0 ? (
              <EmptyState height={190} />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={recipeAnalytics?.topTags ?? []}
                  margin={{ left: -20, right: 8 }}
                >
                  <defs>
                    <linearGradient id="tagsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cv-4)" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="var(--cv-4)" stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="tag"
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={cursorFill("var(--cv-4)")} />
                  <Bar dataKey="count" fill="url(#tagsGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Recipe Difficulty Distribution" index={1} accent="var(--cs-warning-fg)">
            {difficultyData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.fill ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(val, name) => [val, name]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px" }}
                    formatter={(value) => (
                      <span className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row: Top engaged recipes + Recipe upload trend ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Top Engaged Recipes" accent="var(--cv-6)">
            {topEngagedData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={topEngagedData}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <defs>
                    <linearGradient id="engagedGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--cv-6)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--cv-6)" stopOpacity={0.95} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={cursorFill("var(--cv-6)")}
                    formatter={(val, key) => [val, key === "score" ? "Engagement Score" : key]}
                  />
                  <Bar
                    dataKey="score"
                    fill="url(#engagedGrad)"
                    radius={[0, 6, 6, 0]}
                    name="Engagement Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Recipe Upload Trend (Last 30 Days)" index={1} accent="var(--cv-2)">
            {uploadTrendData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart
                  data={uploadTrendData}
                  margin={{ left: -20, right: 8 }}
                >
                  <defs>
                    <linearGradient
                      id="uploadGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--cv-2)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--cv-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "var(--cv-label)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ stroke: "var(--cv-2)", strokeWidth: 1, strokeDasharray: "4 4" }}
                    formatter={(val) => [val, "Recipes"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="Recipes"
                    stroke="var(--cv-2)"
                    strokeWidth={2.5}
                    fill="url(#uploadGrad)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--cs-surface-1)", fill: "var(--cv-2)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row: Orders per day + Recipe love/save breakdown ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Orders Per Day" accent="var(--cv-5)">
            {(earnings?.salesGraph ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={earnings?.salesGraph ?? []}
                  margin={{ left: -20, right: 8 }}
                >
                  <defs>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cv-5)" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="var(--cv-5)" stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "var(--cv-label)" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={cursorFill("var(--cv-5)")}
                    formatter={(val) => [val, "Orders"]}
                  />
                  <Bar
                    dataKey="orders"
                    fill="url(#ordersGrad)"
                    radius={[6, 6, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Top Loved vs Saved Recipes" index={1} accent="var(--cs-love)">
            {(interactions?.topLoved ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={(interactions?.topLoved ?? []).map((r) => ({
                    name:
                      r.recipe?.title?.length > 18
                        ? r.recipe.title.slice(0, 18) + "…"
                        : (r.recipe?.title ?? "Unknown"),
                    Loves: r.totalLoves,
                    Saves: r.totalSaves,
                  }))}
                  margin={{ left: -20, right: 8 }}
                >
                  <CartesianGrid
                    stroke={GRID_STROKE}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "var(--cv-label)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={TICK_STYLE}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={cursorFill("var(--cs-love)")} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px", color: "var(--cs-text-secondary)" }} />
                  <Bar dataKey="Loves" fill="var(--cs-love)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Saves" fill="var(--cv-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </>
  );
}
