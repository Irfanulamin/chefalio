"use client";

import { useDashboardAnalytics, useMyRecipes, useMyCookbooks } from "@/hooks/useChefs";
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
} from "recharts";
import {
  ForkKnifeIcon,
  BookOpenIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  PlusIcon,
  ArrowRightIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#86efac",
  intermediate: "#a7d129",
  advance: "#4d7c0f",
};

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

function SectionHeader({
  title,
  badge,
  action,
}: {
  title: string;
  badge?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {badge && (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

export default function ChefDashboardPage() {
  const { profile } = useProfile();
  const { analytics, isLoading: analyticsLoading } = useDashboardAnalytics();
  const { myRecipes, isLoading: recipesLoading } = useMyRecipes();
  const { myCookbooks, isLoading: cookbooksLoading } = useMyCookbooks();

  const isLoading = analyticsLoading || recipesLoading || cookbooksLoading;

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              </div>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
        {[0, 1].map((row) => (
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

  const difficultyData = analytics?.recipesPerDifficulty ?? [];
  const topTagsData = analytics?.topTags ?? [];
  const topAuthors = analytics?.top3MostUploadedAuthors ?? [];
  const totalLoves = myRecipes.reduce((a, r) => a + (r.lovedCount ?? 0), 0);
  const totalSaves = myRecipes.reduce((a, r) => a + (r.savedCount ?? 0), 0);

  const firstName = profile?.fullName?.split(" ")[0] ?? "Chef";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <title>Dashboard – Chefalio</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page header */}
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Recipes"
            value={myRecipes.length}
            sub="Published"
            icon={ForkKnifeIcon}
          />
          <StatCard
            label="Cookbooks"
            value={myCookbooks.length}
            sub="Published"
            icon={BookOpenIcon}
          />
          <StatCard
            label="Total Loves"
            value={totalLoves.toLocaleString()}
            sub="Across all recipes"
            icon={HeartIcon}
          />
          <StatCard
            label="Total Saves"
            value={totalSaves.toLocaleString()}
            sub="Across all recipes"
            icon={BookmarkSimpleIcon}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Difficulty distribution */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <SectionHeader title="Recipes by Difficulty" badge="Global" />
            <div className="mt-5">
              {difficultyData.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm text-zinc-400">
                  No data yet
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={160}>
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        dataKey="count"
                        nameKey="difficulty"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={72}
                        paddingAngle={2}
                      >
                        {difficultyData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              DIFFICULTY_COLORS[entry.difficulty] ?? "#94a3b8"
                            }
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
                  <div className="space-y-2.5 flex-1">
                    {difficultyData.map((d) => (
                      <div key={d.difficulty} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{
                            background:
                              DIFFICULTY_COLORS[d.difficulty] ?? "#94a3b8",
                          }}
                        />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize flex-1">
                          {d.difficulty}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                          {d.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top tags */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <SectionHeader title="Top Tags" badge="Global" />
            <div className="mt-5">
              {topTagsData.length === 0 ? (
                <div className="flex items-center justify-center h-44 text-sm text-zinc-400">
                  No tags yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={topTagsData} margin={{ left: -20, right: 8 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f4f4f5"
                      vertical={false}
                    />
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
                      cursor={{ fill: "#f4f4f5" }}
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
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top creators */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <SectionHeader title="Top Recipe Creators" />
            <div className="mt-4">
              {topAuthors.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-sm text-zinc-400">
                  No data yet
                </div>
              ) : (
                <div className="space-y-1">
                  {topAuthors.map((author, i) => (
                    <div
                      key={author.userId}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                          i === 0
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            : i === 1
                              ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                              : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
                        ].join(" ")}
                      >
                        {i === 0 ? (
                          <TrophyIcon size={11} weight="fill" />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {author.fullName}
                        </p>
                        <p className="text-xs text-zinc-400">@{author.username}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary tabular-nums">
                        {author.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent recipes */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <SectionHeader
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
            <div className="mt-4">
              {myRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-28 gap-2 text-zinc-400">
                  <p className="text-sm">No recipes yet</p>
                  <Link
                    href="/chef/recipes/create"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Create your first recipe
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {myRecipes.slice(0, 4).map((recipe) => (
                    <div
                      key={recipe._id}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={recipe.images[0]}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {recipe.title}
                        </p>
                        <p className="text-xs text-zinc-400 capitalize">
                          {recipe.difficulty}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-400 tabular-nums shrink-0">
                        {recipe.lovedCount.toLocaleString()} loves
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
