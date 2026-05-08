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

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#a7d129",
  medium: "#f59e0b",
  hard: "#ef4444",
};
const FALLBACK_COLORS = ["#a7d129", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"];

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <Icon size={14} className="text-zinc-400 dark:text-zinc-500" />
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

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <h2 className="text-sm font-semibold text-foreground mb-5">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ height = 176 }: { height?: number }) {
  return (
    <div
      className="flex items-center justify-center text-sm text-zinc-400"
      style={{ height }}
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
            <div
              key={i}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3"
            >
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
              <div
                key={j}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
              >
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

  return (
    <>
      <title>Dashboard – Chefalio Admin</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page header */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            Platform overview across all users and content.
          </p>
        </div>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Users"
            value={(userAnalytics?.totalUsers ?? 0).toLocaleString()}
            sub={`${userAnalytics?.totalMembers ?? 0} members · ${userAnalytics?.totalChefs ?? 0} chefs`}
            icon={UsersIcon}
          />
          <StatCard
            label="Total Recipes"
            value={(recipeAnalytics?.totalRecipes ?? 0).toLocaleString()}
            sub="Published"
            icon={ForkKnifeIcon}
          />
          <StatCard
            label="Total Revenue"
            value={`$${(earnings?.totalRevenue ?? 0).toFixed(2)}`}
            sub={`${earnings?.totalOrders ?? 0} orders`}
            icon={CurrencyDollarIcon}
          />
          <StatCard
            label="Platform Profit"
            value={`$${(earnings?.totalProfit ?? 0).toFixed(2)}`}
            sub={earnings?.profitRate ?? "20% cut"}
            icon={BookOpenIcon}
          />
        </div>

        {/* ── Row 1: Users by role + Revenue over time ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Users by Role">
            <div className="space-y-3">
              {roleBreakdown.map((r) => {
                const pct = Math.round((r.value / totalForPct) * 100);
                return (
                  <div key={r.label} className="flex items-center gap-3">
                    <r.icon size={13} className="text-zinc-400 shrink-0" />
                    <span className="text-xs text-zinc-500 w-14 shrink-0">
                      {r.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums w-8 text-right">
                      {r.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-3 gap-2">
              {roleBreakdown.map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <span className="text-lg font-semibold text-foreground tabular-nums">
                    {r.active}
                  </span>
                  <span className="text-[10px] text-zinc-400 text-center leading-tight">
                    Active {r.label}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Revenue Over Time">
            {(earnings?.salesGraph ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
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
                        stopColor="#a7d129"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#a7d129"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val) => [`$${Number(val).toFixed(2)}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#a7d129"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 2: Top tags + Top selling cookbooks ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Top Recipe Tags">
            {(recipeAnalytics?.topTags ?? []).length === 0 ? (
              <EmptyState height={140} />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={recipeAnalytics?.topTags ?? []}
                  margin={{ left: -20, right: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="tag"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#a7d129" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Top Selling Cookbooks">
            {(earnings?.top3MostSoldCookbooks ?? []).length === 0 ? (
              <EmptyState height={140} />
            ) : (
              <div className="space-y-1">
                {earnings?.top3MostSoldCookbooks.map((cb, i) => (
                  <div
                    key={cb.cookbookId}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-zinc-400 w-4 shrink-0 text-center">
                      {i + 1}
                    </span>
                    <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
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
                      <p className="text-xs text-zinc-400">{cb.totalSold} sold</p>
                    </div>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      ${cb.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>

        {/* ── Row 3: New user growth + Recipe difficulty mix ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="New User Registrations (Last 30 Days)">
            {userGrowthData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <BarChart
                  data={userGrowthData}
                  margin={{ left: -20, right: 8 }}
                >
                  <defs>
                    <linearGradient id="memberBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a7d129" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#a7d129"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                    <linearGradient id="chefBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
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
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Recipe Difficulty Distribution">
            {difficultyData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
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
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val, name) => [val, name]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px" }}
                    formatter={(value) => (
                      <span className="text-xs text-zinc-500">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 4: Top engaged recipes + Top recipe authors ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Top Engaged Recipes">
            {topEngagedData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <BarChart
                  data={topEngagedData}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val, key) => [val, key === "score" ? "Engagement Score" : key]}
                  />
                  <Bar
                    dataKey="score"
                    fill="#a7d129"
                    radius={[0, 4, 4, 0]}
                    name="Engagement Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Top Recipe Authors">
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
                            <p className="text-xs text-zinc-400">
                              @{author.username}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
                            {author.count} recipes
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
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
        </div>

        {/* ── Row 5: Recipe upload trend + Top chefs by revenue ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Recipe Upload Trend (Last 30 Days)">
            {uploadTrendData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
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
                        stopColor="#6366f1"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val) => [val, "Recipes"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="Recipes"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#uploadGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Top Chefs by Revenue">
            {topChefsBarData.length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <BarChart
                  data={topChefsBarData}
                  layout="vertical"
                  margin={{ left: 8, right: 24 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val, key) => [
                      key === "revenue"
                        ? `$${Number(val).toFixed(2)}`
                        : val,
                      key === "revenue" ? "Revenue" : "Sales",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 6: Orders per day + Recipe love/save breakdown ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Orders Per Day">
            {(earnings?.salesGraph ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
                <BarChart
                  data={earnings?.salesGraph ?? []}
                  margin={{ left: -20, right: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(val) => [val, "Orders"]}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#14b8a6"
                    radius={[4, 4, 0, 0]}
                    name="Orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Top Loved vs Saved Recipes">
            {(interactions?.topLoved ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <ResponsiveContainer width="100%" height={176}>
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
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar dataKey="Loves" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Saves" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>
    </>
  );
}
