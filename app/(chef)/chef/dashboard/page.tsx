"use client";

import { useChefRecipeAnalytics, useChefDashboardEarnings } from "@/hooks/useChefs";
import { useProfile } from "@/hooks/useAuth";
import Link from "next/link";
import {
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
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Panel, PanelHeader, PanelEmpty, PanelSkeleton } from "@/components/Chef/studio/Panel";
import { StatTile, StatTileSkeleton } from "@/components/Chef/studio/StatTile";
import {
  ChartTooltip,
  ChartLegend,
  AreaGradient,
  axisProps,
  gridProps,
} from "@/components/Chef/studio/ChartBits";
import {
  MEASURE,
  ORDINAL,
  DIFFICULTY,
  STATUS_COLOR,
  STATUS_LABEL,
  currency,
  cursorFill,
} from "@/components/Chef/studio/viz";

/* ── Data shaping ─────────────────────────────────────────────────────── */

const DIFFICULTY_ORDER = ["beginner", "intermediate", "advance"] as const;

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
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: map.get(key) ?? 0,
    };
  });
}

/* ── Panels ───────────────────────────────────────────────────────────── */

/**
 * Recipe difficulty is an *ordered* scale, so it gets one hue in three
 * steps rather than three unrelated colours.
 *
 * This used to be a donut chart sitting beside a legend that was itself a
 * set of labelled progress bars — the same three numbers drawn twice, in
 * half a panel each. The bars won: they carry the count, the share and the
 * ordering in one row, and they stay legible at this size, which a 44px
 * inner-radius donut does not.
 */
function DifficultyPanel({
  data,
  isLoading,
}: {
  data: { difficulty: string; count: number }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={140} />;

  const ordered = DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    count: data.find((d) => d.difficulty === difficulty)?.count ?? 0,
  }));
  const total = ordered.reduce((a, d) => a + d.count, 0);

  return (
    <Panel>
      <PanelHeader
        title="Recipes by difficulty"
        sub="Where your catalogue sits on the scale"
        value={total > 0 ? total : undefined}
      />
      {total === 0 ? (
        <PanelEmpty
          message="No published recipes yet"
          hint="Difficulty breaks down here once you publish."
          height={140}
        />
      ) : (
        <div className="space-y-4">
          {/* One 100% stacked bar for the shape of the split… */}
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
            {ordered.map((d, i) =>
              d.count === 0 ? null : (
                <div
                  key={d.difficulty}
                  style={{
                    width: `${(d.count / total) * 100}%`,
                    backgroundColor: ORDINAL[i],
                  }}
                />
              ),
            )}
          </div>

          {/* …and labelled rows for the numbers, because a stacked bar can
              show proportion or value, never both. */}
          <div className="space-y-2.5">
            {ordered.map((d, i) => (
              <div key={d.difficulty} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-[2px] shrink-0"
                  style={{ backgroundColor: ORDINAL[i] }}
                />
                <span
                  className="text-xs capitalize flex-1"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  {d.difficulty === "advance" ? "advanced" : d.difficulty}
                </span>
                <span className="text-xs tabular-nums" style={{ color: "var(--cs-text-tertiary)" }}>
                  {Math.round((d.count / total) * 100)}%
                </span>
                <span
                  className="text-xs font-semibold tabular-nums w-6 text-right"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function UploadTrendPanel({
  data,
  isLoading,
}: {
  data: { date: string; count: number }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={168} />;

  const trend = buildUploadTrend(data);
  const total = trend.reduce((a, d) => a + d.count, 0);

  return (
    <Panel>
      <PanelHeader
        title="Recipe uploads"
        sub="Last 14 days"
        value={`${total} published`}
      />
      <ResponsiveContainer width="100%" height={168}>
        <AreaChart data={trend} margin={{ left: -22, right: 8, top: 4 }}>
          <AreaGradient id="cs-uploads" color={MEASURE.uploads} />
          <CartesianGrid {...gridProps} vertical={false} />
          <XAxis dataKey="date" {...axisProps} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...axisProps} allowDecimals={false} width={34} />
          <Tooltip
            content={<ChartTooltip hideName format={(v) => `${v} recipe${v === 1 ? "" : "s"}`} />}
            cursor={{ stroke: "var(--cv-axis)", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Uploads"
            stroke={MEASURE.uploads}
            strokeWidth={2}
            fill="url(#cs-uploads)"
            dot={false}
            activeDot={{ r: 3.5, fill: MEASURE.uploads, stroke: "var(--cs-surface-2)", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

function TopRecipesPanel({
  data,
  isLoading,
}: {
  data: { title: string; lovedCount: number; savedCount: number }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={168} />;

  return (
    <Panel>
      <PanelHeader
        title="Top recipes by engagement"
        sub="Loves and saves combined"
        action={
          <Link
            href="/chef/analytics"
            className="flex items-center gap-1 text-xs shrink-0 transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            Full analytics
            <ArrowRightIcon size={11} />
          </Link>
        }
      />
      {data.length === 0 ? (
        <PanelEmpty message="No engagement yet" hint="Loves and saves show up here as they arrive." />
      ) : (
        <>
          <ChartLegend
            className="mb-3"
            items={[
              { label: "Loves", color: MEASURE.loves },
              { label: "Saves", color: MEASURE.saves },
            ]}
          />
          <ResponsiveContainer width="100%" height={168}>
            <BarChart
              data={data.map((r) => ({
                name: r.title.length > 22 ? r.title.slice(0, 22) + "…" : r.title,
                Loves: r.lovedCount,
                Saves: r.savedCount,
              }))}
              layout="vertical"
              margin={{ left: 4, right: 12 }}
              barSize={12}
            >
              <CartesianGrid {...gridProps} horizontal={false} />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axisProps} width={104} />
              <Tooltip content={<ChartTooltip />} cursor={cursorFill} />
              {/* A 2px surface-coloured gap between stacked segments, so the
                  boundary is a gap rather than two colours touching. */}
              <Bar
                dataKey="Loves"
                stackId="a"
                fill={MEASURE.loves}
                stroke="var(--cs-surface-2)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Saves"
                stackId="a"
                fill={MEASURE.saves}
                stroke="var(--cs-surface-2)"
                strokeWidth={2}
                radius={[0, 3, 3, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </Panel>
  );
}

function TopTagsPanel({
  data,
  isLoading,
}: {
  data: { tag: string; count: number }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={168} />;

  return (
    <Panel>
      <PanelHeader title="Your most used tags" sub="Across all published recipes" />
      {data.length === 0 ? (
        <PanelEmpty message="No tags yet" hint="Tag your recipes to see which themes you cook most." />
      ) : (
        <ResponsiveContainer width="100%" height={168}>
          <BarChart data={data} margin={{ left: -22, right: 8, top: 4 }} barSize={22}>
            <CartesianGrid {...gridProps} vertical={false} />
            <XAxis dataKey="tag" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} width={34} />
            <Tooltip
              content={<ChartTooltip hideName format={(v) => `${v} recipe${v === 1 ? "" : "s"}`} />}
              cursor={cursorFill}
            />
            <Bar
              dataKey="count"
              name="Recipes"
              fill={MEASURE.tags}
              radius={[3, 3, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Panel>
  );
}

function TopCookbooksPanel({
  data,
  isLoading,
}: {
  data: {
    cookbookId: unknown;
    cookbookTitle: string;
    cookbookImage: string;
    totalSold: number;
    totalRevenue: number;
  }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={168} />;

  return (
    <Panel>
      <PanelHeader
        title="Top cookbooks by revenue"
        action={
          <Link
            href="/chef/cookbooks"
            className="flex items-center gap-1 text-xs shrink-0 transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            View all
            <ArrowRightIcon size={11} />
          </Link>
        }
      />
      {data.length === 0 ? (
        <PanelEmpty message="No cookbook sales yet" hint="Your best sellers will rank here." />
      ) : (
        <ul className="-mx-2">
          {data.map((cb, i) => (
            <li
              key={String(cb.cookbookId)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors duration-150 hover:bg-[var(--cs-hover)]"
            >
              <span
                className="text-xs font-semibold w-3 shrink-0 tabular-nums"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                {i + 1}
              </span>
              <div
                className="relative h-9 w-12 rounded-md overflow-hidden shrink-0"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              >
                <Image src={cb.cookbookImage} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {cb.cookbookTitle}
                </p>
                <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
                  {cb.totalSold} sold
                </p>
              </div>
              <span
                className="text-sm font-semibold tabular-nums shrink-0"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {currency(cb.totalRevenue, true)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function RecentOrdersPanel({
  data,
  isLoading,
}: {
  data: {
    _id: unknown;
    cookbookTitle: string;
    cookbookImage: string;
    receiptEmail: string;
    price: number;
    paymentStatus: string;
  }[];
  isLoading: boolean;
}) {
  if (isLoading) return <PanelSkeleton height={168} />;

  return (
    <Panel>
      <PanelHeader
        title="Recent orders"
        action={
          <Link
            href="/chef/orders"
            className="flex items-center gap-1 text-xs shrink-0 transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            View all
            <ArrowRightIcon size={11} />
          </Link>
        }
      />
      {data.length === 0 ? (
        <PanelEmpty message="No orders yet" hint="Sales appear here the moment they clear." />
      ) : (
        <ul className="-mx-2">
          {data.map((order) => (
            <li
              key={String(order._id)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors duration-150 hover:bg-[var(--cs-hover)]"
            >
              <div
                className="relative h-9 w-12 rounded-md overflow-hidden shrink-0"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              >
                <Image src={order.cookbookImage} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {order.cookbookTitle}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--cs-text-tertiary)" }}>
                  {order.receiptEmail}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {currency(order.price, true)}
                </span>
                {/* Status carries a dot *and* a word — the colour is never
                    the only thing saying what state the order is in. */}
                <span
                  className="flex items-center gap-1.5 text-[11px]"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        STATUS_COLOR[order.paymentStatus] ?? "var(--cs-text-tertiary)",
                    }}
                  />
                  {STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ChefDashboardPage() {
  const { profile } = useProfile();
  const { recipeAnalytics, isLoading: analyticsLoading } = useChefRecipeAnalytics();
  const { dashboardEarnings, isLoading: earningsLoading } = useChefDashboardEarnings();

  /**
   * Two requests, and no page-level loading gate.
   *
   * This page used to make four. Two of them — `my-recipes` and
   * `my-cookbooks?limit=100` — existed only so the browser could count
   * their results and sum two fields, which meant downloading every recipe
   * document the chef owns (descriptions, ingredient arrays, every
   * instruction, three image URLs each) to render six integers. Those
   * numbers are now computed in the aggregation that was already running
   * beside them, so the payload no longer grows with the chef's catalogue.
   *
   * And all four used to sit behind one combined `isLoading`, holding the
   * header, the actions and all twelve panels off screen until the slowest
   * of them answered. Each panel now waits only on its own data.
   */
  const recentRecipes = recipeAnalytics?.recentRecipes ?? [];

  const firstName = profile?.fullName?.split(" ")[0] ?? "Chef";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <title>Dashboard – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-xl font-semibold tracking-[-0.018em]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {greeting}, {firstName}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              Here&apos;s what&apos;s happening with your content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/chef/recipes/create"
              className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium rounded-lg transition-colors duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.98]"
              style={{
                border: "1px solid var(--cs-border-default)",
                backgroundColor: "var(--cs-surface-2)",
                color: "var(--cs-text-primary)",
              }}
            >
              <PlusIcon size={12} weight="bold" />
              New recipe
            </Link>
            <Link
              href="/chef/cookbooks/create"
              className="inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium rounded-lg transition-transform duration-150 active:scale-[0.98]"
              style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
            >
              <PlusIcon size={12} weight="bold" />
              New cookbook
            </Link>
          </div>
        </div>

        {/* ── Stat tiles. Each waits on its own query, so the money figures
              don't sit blank because the recipe list is slow. ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {earningsLoading ? (
            <>
              <StatTileSkeleton />
              <StatTileSkeleton />
            </>
          ) : (
            <>
              <StatTile
                label="Revenue"
                value={currency(dashboardEarnings?.totalRevenue ?? 0, true)}
                sub="Lifetime"
                icon={CurrencyDollarIcon}
                accent={MEASURE.revenue}
              />
              <StatTile
                label="Orders"
                value={(dashboardEarnings?.totalOrders ?? 0).toLocaleString()}
                sub="Paid"
                icon={ShoppingCartSimpleIcon}
              />
            </>
          )}

          {analyticsLoading ? (
            <>
              <StatTileSkeleton />
              <StatTileSkeleton />
              <StatTileSkeleton />
            </>
          ) : (
            <>
              <StatTile
                label="Recipes"
                value={recipeAnalytics?.totalRecipes ?? 0}
                sub="Published"
                icon={ForkKnifeIcon}
              />
              <StatTile
                label="Loves"
                value={(recipeAnalytics?.totalLoves ?? 0).toLocaleString()}
                sub="All recipes"
                icon={HeartIcon}
              />
              <StatTile
                label="Saves"
                value={(recipeAnalytics?.totalSaves ?? 0).toLocaleString()}
                sub="All recipes"
                icon={BookmarkSimpleIcon}
              />
            </>
          )}

          {earningsLoading ? (
            <StatTileSkeleton />
          ) : (
            <StatTile
              label="Cookbooks"
              value={dashboardEarnings?.totalCookbooks ?? 0}
              sub="Published"
              icon={BookOpenIcon}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DifficultyPanel
            data={recipeAnalytics?.myDifficultyBreakdown ?? []}
            isLoading={analyticsLoading}
          />
          <UploadTrendPanel
            data={recipeAnalytics?.uploadTrend ?? []}
            isLoading={analyticsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopRecipesPanel data={recipeAnalytics?.topRecipes ?? []} isLoading={analyticsLoading} />
          <TopTagsPanel data={recipeAnalytics?.myTopTags ?? []} isLoading={analyticsLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopCookbooksPanel
            data={dashboardEarnings?.topCookbooks ?? []}
            isLoading={earningsLoading}
          />
          <RecentOrdersPanel
            data={dashboardEarnings?.recentOrders ?? []}
            isLoading={earningsLoading}
          />
        </div>

        {/* ── Recent recipes ── */}
        {analyticsLoading ? (
          <PanelSkeleton height={72} />
        ) : (
          <Panel>
            <PanelHeader
              title="Recent recipes"
              action={
                <Link
                  href="/chef/recipes"
                  className="flex items-center gap-1 text-xs shrink-0 transition-opacity duration-150 hover:opacity-70"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  View all
                  <ArrowRightIcon size={11} />
                </Link>
              }
            />
            {recentRecipes.length === 0 ? (
              <PanelEmpty
                message="No recipes yet"
                height={72}
                hint={
                  <Link
                    href="/chef/recipes/create"
                    className="font-medium hover:underline"
                    style={{ color: "var(--cs-accent-text)" }}
                  >
                    Create your first recipe
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 -mx-2">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe._id}
                    href="/chef/recipes"
                    className="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors duration-150 hover:bg-[var(--cs-hover)]"
                  >
                    <div
                      className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0"
                      style={{ backgroundColor: "var(--cs-surface-3)" }}
                    >
                      <Image
                        src={recipe.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {recipe.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="h-1.5 w-1.5 rounded-[2px] shrink-0"
                          aria-hidden
                          style={{
                            backgroundColor: DIFFICULTY[recipe.difficulty] ?? "var(--cv-ord-2)",
                          }}
                        />
                        <span
                          className="text-[11px] capitalize"
                          style={{ color: "var(--cs-text-tertiary)" }}
                        >
                          {recipe.difficulty === "advance" ? "advanced" : recipe.difficulty}
                        </span>
                        <span
                          className="text-[11px] tabular-nums"
                          style={{ color: "var(--cs-text-tertiary)" }}
                        >
                          {recipe.lovedCount} loves
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
