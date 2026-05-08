"use client";

import { useUserAnalytics, useAdminEarnings } from "@/hooks/useAdmin";
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
} from "recharts";
import {
  UsersIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChefHatIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function AdminDashboardPage() {
  const { profile } = useProfile();
  const { analytics: userAnalytics, isLoading: usersLoading } =
    useUserAnalytics();
  const { analytics: recipeAnalytics, isLoading: recipesLoading } =
    useDashboardAnalytics();
  const { earnings, isLoading: earningsLoading } = useAdminEarnings();

  const isLoading = usersLoading || recipesLoading || earningsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              </div>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <Skeleton className="h-4 w-32 mb-5" />
              <Skeleton className="h-44 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
              <Skeleton className="h-4 w-40 mb-5" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const firstName = profile?.fullName?.split(" ")[0] ?? "Admin";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
      icon: ShieldCheckIcon,
    },
  ];
  const totalForPct =
    roleBreakdown.reduce((s, r) => s + r.value, 0) || 1;

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

        {/* Stats */}
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

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Users by role */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Users by Role
            </h2>
            <div className="mt-5 space-y-3">
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
          </div>

          {/* Revenue over time */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Revenue Over Time
            </h2>
            <div className="mt-5">
              {(earnings?.salesGraph ?? []).length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm text-zinc-400">
                  No sales data yet
                </div>
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
                      formatter={(val) => [
                        `$${Number(val).toFixed(2)}`,
                        "Revenue",
                      ]}
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
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top tags */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Top Recipe Tags
            </h2>
            <div className="mt-5">
              {(recipeAnalytics?.topTags ?? []).length === 0 ? (
                <div className="flex items-center justify-center h-36 text-sm text-zinc-400">
                  No tag data yet
                </div>
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
                    <Bar
                      dataKey="count"
                      fill="#a7d129"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Top selling cookbooks */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-foreground">
              Top Selling Cookbooks
            </h2>
            <div className="mt-4">
              {(earnings?.top3MostSoldCookbooks ?? []).length === 0 ? (
                <div className="flex items-center justify-center h-36 text-sm text-zinc-400">
                  No sales yet
                </div>
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
                        <p className="text-xs text-zinc-400">
                          {cb.totalSold} sold
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-primary tabular-nums">
                        ${cb.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
