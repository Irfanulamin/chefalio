"use client";

import {
  useMyRecipes,
  useMyCookbooks,
  useChefRecipeAnalytics,
  useChefDashboardEarnings,
} from "@/hooks/useChefs";
import { useProfile } from "@/hooks/useAuth";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  ForkKnifeIcon,
  BookOpenIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  PlusIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  ShoppingCartSimpleIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  PackageIcon,
  XCircleIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#86efac",
  intermediate: "#a7d129",
  advance: "#4d7c0f",
};

const STATUS_DOT: Record<string, string> = {
  paid: "bg-emerald-400",
  shipped: "bg-blue-400",
  delivered: "bg-primary",
  pending: "bg-amber-400",
  failed: "bg-red-400",
  refunded: "bg-zinc-400",
};

const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  paid: CheckCircleIcon,
  shipped: TruckIcon,
  delivered: PackageIcon,
  pending: ClockIcon,
  failed: XCircleIcon,
  refunded: ArrowsClockwiseIcon,
};

// ─── Upload trend builder (zero-fill last 14 days) ───────────────────────────

function buildUploadTrend(data: { date: string; count: number }[]) {
  const map = new Map(data.map((d) => [d.date, d.count]));
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date: label, count: map.get(key) ?? 0 };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

function EmptyState({ height = 160, message = "No data yet" }: { height?: number; message?: string }) {
  return (
    <div
      className="flex items-center justify-center text-sm text-zinc-400"
      style={{ height }}
    >
      {message}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChefDashboardPage() {
  const { profile } = useProfile();
  const { myRecipes, isLoading: recipesLoading } = useMyRecipes();
  const { myCookbooks, isLoading: cookbooksLoading } = useMyCookbooks();
  const { recipeAnalytics, isLoading: recipeAnalyticsLoading } = useChefRecipeAnalytics();
  const { dashboardEarnings, isLoading: earningsLoading } = useChefDashboardEarnings();

  const isLoading = recipesLoading || cookbooksLoading || recipeAnalyticsLoading || earningsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3.5 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              </div>
              <Skeleton className="h-7 w-14" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[0, 1].map((col) => (
              <div key={col} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
                <Skeleton className="h-4 w-36 mb-5" />
                <Skeleton className="h-44 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const totalLoves = myRecipes.reduce((a, r) => a + (r.lovedCount ?? 0), 0);
  const totalSaves = myRecipes.reduce((a, r) => a + (r.savedCount ?? 0), 0);
  const uploadTrendData = buildUploadTrend(recipeAnalytics?.uploadTrend ?? []);
  const difficultyData = recipeAnalytics?.myDifficultyBreakdown ?? [];
  const topTagsData = recipeAnalytics?.myTopTags ?? [];
  const topRecipes = recipeAnalytics?.topRecipes ?? [];
  const recentOrders = dashboardEarnings?.recentOrders ?? [];
  const topCookbooks = dashboardEarnings?.topCookbooks ?? [];

  const firstName = profile?.fullName?.split(" ")[0] ?? "Chef";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <title>Dashboard – Chefalio</title>

      <div className="space-y-6 max-w-7xl mx-auto">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {greeting}, {firstName}
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              Here&apos;s what&apos;s happening with your content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/chef/recipes/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <PlusIcon size={12} weight="bold" />
              New Recipe
            </Link>
            <Link
              href="/chef/cookbooks/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors"
            >
              <PlusIcon size={12} weight="bold" />
              New Cookbook
            </Link>
          </div>
        </div>

        {/* ── 6 stat cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Recipes" value={myRecipes.length} sub="Published" icon={ForkKnifeIcon} />
          <StatCard label="Cookbooks" value={myCookbooks.length} sub="Published" icon={BookOpenIcon} />
          <StatCard label="Total Loves" value={totalLoves.toLocaleString()} sub="All recipes" icon={HeartIcon} />
          <StatCard label="Total Saves" value={totalSaves.toLocaleString()} sub="All recipes" icon={BookmarkSimpleIcon} />
          <StatCard
            label="Revenue"
            value={`$${(dashboardEarnings?.totalRevenue ?? 0).toFixed(2)}`}
            sub="Lifetime earnings"
            icon={CurrencyDollarIcon}
          />
          <StatCard
            label="Orders"
            value={(dashboardEarnings?.totalOrders ?? 0).toLocaleString()}
            sub="Paid orders"
            icon={ShoppingCartSimpleIcon}
          />
        </div>

        {/* ── Row 1: My difficulty distribution + Upload trend ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* My recipe difficulty */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader title="My Recipes by Difficulty" />
            {difficultyData.length === 0 ? (
              <EmptyState message="Publish recipes to see difficulty breakdown" />
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="45%" height={160}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      dataKey="count"
                      nameKey="difficulty"
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {difficultyData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={DIFFICULTY_COLORS[entry.difficulty] ?? "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e4e4e7",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {difficultyData.map((d) => {
                    const total = difficultyData.reduce((a, x) => a + x.count, 0) || 1;
                    const pct = Math.round((d.count / total) * 100);
                    return (
                      <div key={d.difficulty}>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ background: DIFFICULTY_COLORS[d.difficulty] ?? "#94a3b8" }}
                          />
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize flex-1">
                            {d.difficulty}
                          </span>
                          <span className="text-xs font-semibold tabular-nums text-foreground">
                            {d.count}
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: DIFFICULTY_COLORS[d.difficulty] ?? "#94a3b8",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Upload trend */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader title="Recipe Uploads (Last 14 Days)" />
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={uploadTrendData} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7d129" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a7d129" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#a1a1aa" }}
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
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
                  formatter={(val) => [val, "Recipes"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#a7d129"
                  strokeWidth={2}
                  fill="url(#uploadGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#a7d129" }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Top recipes by engagement + My top tags ──────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top recipes by engagement */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader
              title="Top Recipes by Engagement"
              action={
                <Link
                  href="/chef/analytics"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-foreground transition-colors"
                >
                  Full analytics
                  <ArrowRightIcon size={11} />
                </Link>
              }
            />
            {topRecipes.length === 0 ? (
              <EmptyState message="No recipe engagement yet" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={topRecipes.map((r) => ({
                    name: r.title.length > 20 ? r.title.slice(0, 20) + "…" : r.title,
                    Loves: r.lovedCount,
                    Saves: r.savedCount,
                  }))}
                  layout="vertical"
                  margin={{ left: 4, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
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
                    width={96}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
                  />
                  <Bar dataKey="Loves" fill="#ef4444" radius={[0, 3, 3, 0]} stackId="a" />
                  <Bar dataKey="Saves" fill="#a7d129" radius={[0, 3, 3, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* My top tags */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader title="My Top Tags" />
            {topTagsData.length === 0 ? (
              <EmptyState message="Add tags to your recipes to see them here" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={topTagsData} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis
                    dataKey="tag"
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f4f4f580" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Row 3: Top cookbooks by sales + Recent orders ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top cookbooks */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader
              title="Top Cookbooks by Revenue"
              action={
                <Link
                  href="/chef/cookbooks"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-foreground transition-colors"
                >
                  View all
                  <ArrowRightIcon size={11} />
                </Link>
              }
            />
            {topCookbooks.length === 0 ? (
              <EmptyState message="No cookbook sales yet" />
            ) : (
              <div className="space-y-1">
                {topCookbooks.map((cb, i) => (
                  <div
                    key={String(cb.cookbookId)}
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
                    <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
                      ${cb.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent orders */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <CardHeader
              title="Recent Orders"
              action={
                <Link
                  href="/chef/orders"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-foreground transition-colors"
                >
                  View all
                  <ArrowRightIcon size={11} />
                </Link>
              }
            />
            {recentOrders.length === 0 ? (
              <EmptyState message="No orders yet" />
            ) : (
              <div className="space-y-1">
                {recentOrders.map((order) => {
                  const StatusIcon = STATUS_ICON[order.paymentStatus] ?? ClockIcon;
                  return (
                    <div
                      key={String(order._id)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={order.cookbookImage}
                          alt={order.cookbookTitle}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {order.cookbookTitle}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {order.receiptEmail}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-semibold text-foreground tabular-nums">
                          ${order.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[order.paymentStatus] ?? "bg-zinc-300"}`}
                          />
                          {STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 4: Recent recipes ───────────────────────────────────────── */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <CardHeader
            title="Recent Recipes"
            action={
              <Link
                href="/chef/recipes"
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-foreground transition-colors"
              >
                View all
                <ArrowRightIcon size={11} />
              </Link>
            }
          />
          {myRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-2 text-zinc-400">
              <p className="text-sm">No recipes yet</p>
              <Link
                href="/chef/recipes/create"
                className="text-xs text-primary hover:underline font-medium"
              >
                Create your first recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {myRecipes.slice(0, 4).map((recipe) => (
                <div
                  key={recipe._id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={recipe.images[0]}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-zinc-400 capitalize">
                        {recipe.difficulty}
                      </span>
                      <span className="text-[11px] text-zinc-400 tabular-nums">
                        {recipe.lovedCount} ♥
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
