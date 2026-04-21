"use client";

import { useDashboardAnalytics } from "@/hooks/useChefs";
import { useMyRecipes } from "@/hooks/useChefs";
import { useMyCookbooks } from "@/hooks/useChefs";
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
  TrophyIcon,
  PlusIcon,
  ArrowRightIcon,
  ChartBarIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#EEFABD",
  intermediate: "#A7D129",
  advance: "#616F39",
};

const TAG_COLOR = "#A7D129";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
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
        style={{ background: accent ? `${accent}18` : "#A7D12918" }}
      >
        <Icon size={20} weight="fill" style={{ color: accent ?? "#A7D129" }} />
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

export default function ChefDashboardPage() {
  const { profile } = useProfile();
  const { analytics, isLoading } = useDashboardAnalytics();
  const { myRecipes } = useMyRecipes();
  const { myCookbooks } = useMyCookbooks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const difficultyData = analytics?.recipesPerDifficulty ?? [];
  const topTagsData = analytics?.topTags ?? [];
  const topAuthors = analytics?.top3MostUploadedAuthors ?? [];

  return (
    <>
      <title>Chef Dashboard – Chefalio</title>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/80 via-primary to-lime-500 p-6 md:p-8 shadow-lg">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 50%, rgba(255,255,255,0.4) 0%, transparent 40%),
                radial-gradient(circle at 90% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SparkleIcon
                  size={18}
                  weight="fill"
                  className="text-black/60"
                />
                <span className="text-sm font-semibold text-black/70 tracking-wide">
                  Chef Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">
                Welcome back, {profile?.fullName?.split(" ")[0] ?? "Chef"}! 👨‍🍳
              </h1>
              <p className="mt-1.5 text-sm text-black/70 max-w-md">
                You have <strong>{myRecipes.length} recipes</strong> and{" "}
                <strong>{myCookbooks.length} cookbooks</strong> published. Keep
                creating!
              </p>
            </div>

            <div className="flex gap-2.5 flex-wrap">
              <Link
                href="/chef/recipes/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/80 text-white text-sm font-semibold hover:bg-black transition-colors shadow"
              >
                <PlusIcon size={16} weight="bold" />
                New Recipe
              </Link>
              <Link
                href="/chef/cookbooks/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 text-black text-sm font-semibold hover:bg-white transition-colors shadow"
              >
                <PlusIcon size={16} weight="bold" />
                New Cookbook
              </Link>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={ForkKnifeIcon}
            label="My Recipes"
            value={myRecipes.length}
            sub="Published recipes"
          />
          <StatCard
            icon={BookOpenIcon}
            label="My Cookbooks"
            value={myCookbooks.length}
            sub="Published cookbooks"
            accent="#6366f1"
          />
          <StatCard
            icon={TrophyIcon}
            label="Total Loves"
            value={myRecipes
              .reduce((acc, r) => acc + (r.lovedCount ?? 0), 0)
              .toLocaleString()}
            sub="Across all recipes"
            accent="#ef4444"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Pie */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <ChartBarIcon size={16} weight="fill" className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Recipes by Difficulty
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Global
              </span>
            </div>

            {difficultyData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={180}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      dataKey="count"
                      nameKey="difficulty"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            DIFFICULTY_COLORS[entry.difficulty] ?? "#94a3b8"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {difficultyData.map((d) => (
                    <div
                      key={d.difficulty}
                      className="flex items-center gap-2.5"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{
                          background:
                            DIFFICULTY_COLORS[d.difficulty] ?? "#94a3b8",
                        }}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {d.difficulty}
                      </span>
                      <span className="text-xs font-semibold text-foreground ml-auto pl-2">
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Tags Bar */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <ChartBarIcon size={16} weight="fill" className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Top 5 Tags
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Global
              </span>
            </div>

            {topTagsData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No tags yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={topTagsData} margin={{ left: -10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="tag"
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
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid rgb(229 231 235)",
                    }}
                    wrapperClassName="!bg-white dark:!bg-black !text-black dark:!text-white !rounded-xl"
                  />
                  <Bar dataKey="count" fill={TAG_COLOR} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Authors + Recent Recipes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top uploaders */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TrophyIcon size={16} weight="fill" className="text-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">
                Top Recipe Creators
              </h2>
            </div>

            {topAuthors.length === 0 ? (
              <div className="flex items-center justify-center h-28 text-muted-foreground text-sm">
                No data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topAuthors.map((author, i) => (
                  <div
                    key={author.userId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60"
                  >
                    <span
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        i === 0
                          ? "bg-amber-400 text-black"
                          : i === 1
                            ? "bg-zinc-300 text-black"
                            : "bg-orange-300 text-black",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {author.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{author.username}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {author.count} recipes
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Recipes */}
          <div className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ForkKnifeIcon
                  size={16}
                  weight="fill"
                  className="text-primary"
                />
                <h2 className="text-sm font-semibold text-foreground">
                  My Recent Recipes
                </h2>
              </div>
              <Link
                href="/chef/recipes"
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                View all <ArrowRightIcon size={12} />
              </Link>
            </div>

            {myRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-36 gap-3 text-muted-foreground">
                <p className="text-sm">No recipes yet.</p>
                <Link
                  href="/chef/recipes/create"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Create your first recipe →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myRecipes.slice(0, 4).map((recipe) => (
                  <div key={recipe._id} className="flex items-center gap-3">
                    <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={recipe.images[0]}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {recipe.difficulty}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      ❤️ {recipe.lovedCount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
