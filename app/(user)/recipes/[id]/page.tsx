"use client";

import { use, useState } from "react";
import {
  useSingleRecipe,
  useRecipeStats,
  useToggleLove,
  useToggleSave,
} from "@/hooks/useRecipe";
import {
  ShareIcon,
  HeartIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "framer-motion";
import { ImageCarousel } from "./_components/ImageCarousel";
import { Instructions } from "./_components/Instructions";
import { Recipe } from "@/types/recipes.type";
import { SafeImage } from "@/components/common/SafeImage";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusPill } from "@/components/User/shared/StatusPill";
import { difficultyDisplay, initialsOf } from "@/lib/recipe-display";
import { EASE, SPRING } from "@/lib/motion";
import Link from "next/link";

const TOGGLE_POP = [1, 1.18, 1];

function ActionButton({
  active,
  onClick,
  label,
  children,
  activeStyle,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  activeStyle: React.CSSProperties;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={SPRING.snappy}
      className="focus-ring flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150"
      style={
        active
          ? activeStyle
          : {
              backgroundColor: "var(--cs-surface-2)",
              color: "var(--cs-text-secondary)",
              border: "1px solid var(--cs-border-default)",
            }
      }
    >
      {children}
    </motion.button>
  );
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const { stats } = useRecipeStats(recipe._id);
  const { mutate: toggleLove } = useToggleLove();
  const { mutate: toggleSave } = useToggleSave();
  const reduce = useReducedMotion();

  const toggleStep = (step: number) =>
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });

  const initials = initialsOf(recipe.authorId.fullName);
  const diff = difficultyDisplay(recipe.difficulty);
  const progress = recipe.instructions.length
    ? Math.round((completedSteps.size / recipe.instructions.length) * 100)
    : 0;
  const allDone =
    recipe.instructions.length > 0 &&
    completedSteps.size === recipe.instructions.length;

  /* Sharing used to write to the clipboard *and* open the share sheet, so
     on a phone you got a system sheet you hadn't asked for on top of a
     silent copy. Now it's one or the other, and either way the button
     says what happened — a copy with no confirmation is
     indistinguishable from a dead button. */
  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${recipe._id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text: recipe.description, url });
        return;
      } catch {
        // Cancelled, or unavailable — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; nothing useful to say beyond leaving the icon.
    }
  };

  return (
    <div className="app-root">
      <div className="page-content">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col lg:w-[480px]">
            <ImageCarousel
              images={recipe.images}
              title={recipe.title}
              difficulty={recipe.difficulty}
            />

            <div className="mb-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h1 className="ui-title" style={{ color: "var(--cs-text-primary)" }}>
                  {recipe.title}
                </h1>
                <motion.button
                  onClick={handleShare}
                  aria-label={copied ? "Link copied" : "Share this recipe"}
                  whileTap={reduce ? undefined : { scale: 0.94 }}
                  transition={SPRING.snappy}
                  className="focus-ring mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-150"
                  style={{
                    backgroundColor: copied
                      ? "var(--cs-success-bg)"
                      : "var(--cs-surface-2)",
                    border: `1px solid ${
                      copied ? "var(--cs-success-edge)" : "var(--cs-border-subtle)"
                    }`,
                    color: copied
                      ? "var(--cs-success-fg)"
                      : "var(--cs-text-secondary)",
                  }}
                >
                  <motion.span
                    key={copied ? "copied" : "share"}
                    initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    {copied ? <CheckIcon size={15} weight="bold" /> : <ShareIcon size={15} />}
                  </motion.span>
                </motion.button>
              </div>
              <p className="ui-body" style={{ color: "var(--cs-text-secondary)" }}>
                {recipe.description}
              </p>
            </div>

            <Link
              href={`/chefs/${recipe.authorId._id}`}
              className="ui-card ui-card-interactive focus-ring mb-5 flex items-center gap-3 p-4"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                <SafeImage
                  src={recipe.authorId.profile_url}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 object-cover"
                  fallback={
                    <span
                      className="flex h-11 w-11 items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: "var(--cs-accent-muted)",
                        color: "var(--cs-accent-text)",
                      }}
                    >
                      {initials}
                    </span>
                  }
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="ui-subheading"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {recipe.authorId.fullName}
                </p>
                <p
                  className="ui-micro mt-0.5 truncate"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  @{recipe.authorId.username}
                </p>
              </div>

              <span className="ui-label shrink-0" style={{ color: "var(--cs-text-tertiary)" }}>
                Chef
              </span>
            </Link>

            <ul className="mb-5 flex flex-wrap gap-2">
              {recipe.tags.map((t) => (
                <li
                  key={t}
                  className="ui-micro rounded-lg px-2.5 py-1 font-medium capitalize"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    color: "var(--cs-text-secondary)",
                  }}
                >
                  {t}
                </li>
              ))}
              <li>
                <StatusPill tone={diff.tone}>{diff.label}</StatusPill>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <ActionButton
                active={Boolean(stats?.isLoved)}
                onClick={() => toggleLove(recipe._id)}
                label={stats?.isLoved ? "Remove from favourites" : "Add to favourites"}
                activeStyle={{
                  backgroundColor: "var(--cs-love-bg)",
                  color: "var(--cs-love)",
                  border: "1px solid var(--cs-love)",
                }}
              >
                <motion.span
                  className="flex"
                  animate={reduce ? undefined : { scale: stats?.isLoved ? TOGGLE_POP : 1 }}
                  transition={{ duration: 0.3, times: [0, 0.42, 1], ease: EASE }}
                >
                  <HeartIcon
                    weight={stats?.isLoved ? "fill" : "regular"}
                    className="h-4 w-4"
                  />
                </motion.span>
                <span className="ui-numeric">{recipe.lovedCount.toLocaleString()}</span>
              </ActionButton>

              <ActionButton
                active={Boolean(stats?.isSaved)}
                onClick={() => toggleSave(recipe._id)}
                label={stats?.isSaved ? "Remove from saved" : "Save recipe"}
                activeStyle={{
                  backgroundColor: "var(--cs-text-primary)",
                  color: "var(--cs-surface-1)",
                  border: "1px solid transparent",
                }}
              >
                <motion.span
                  className="flex"
                  animate={reduce ? undefined : { scale: stats?.isSaved ? TOGGLE_POP : 1 }}
                  transition={{ duration: 0.3, times: [0, 0.42, 1], ease: EASE }}
                >
                  <BookmarkSimpleIcon
                    weight={stats?.isSaved ? "fill" : "regular"}
                    className="h-4 w-4"
                  />
                </motion.span>
                {stats?.isSaved ? "Saved" : "Save"}
              </ActionButton>
            </div>
          </div>

          {/* The rule between the columns only exists at lg, where there
              are actually two columns. This used to be a `<style>` tag
              injected into the middle of the render tree — a global
              stylesheet re-parsed on every render of this component. */}
          <div
            className="flex h-fit w-full flex-col lg:sticky lg:top-24 lg:border-l lg:pl-8"
            style={{ borderColor: "var(--cs-border-subtle)" }}
          >
            <section className="mb-8">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
                  Ingredients
                </h2>
                <span
                  className="ui-caption ui-numeric rounded-lg px-2.5 py-1 font-semibold"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                    color: "var(--cs-text-secondary)",
                  }}
                >
                  {recipe.ingredients.length} items
                </span>
              </div>

              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {recipe.ingredients.map((item, i) => (
                  <li
                    key={i}
                    className="ui-card flex items-center gap-3 px-4 py-3"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                    <span
                      className="ui-body leading-tight"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <Instructions
              recipe={recipe}
              progress={progress}
              allDone={allDone}
              completedSteps={completedSteps}
              toggleStep={toggleStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SingleRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { singleRecipe, isSingleRecipeLoading } = useSingleRecipe(id);
  const recipe = singleRecipe?.data;

  if (isSingleRecipeLoading) {
    return (
      <div className="app-root">
        <div className="page-content flex min-h-[60vh] items-center justify-center">
          <CircleNotchIcon
            size={24}
            className="animate-spin"
            style={{ color: "var(--cs-text-tertiary)" }}
          />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="app-root">
        <div className="page-content">
          <EmptyState
            icon={<BookmarkSimpleIcon size={24} />}
            title="No recipe at this address"
            description="It may have been unpublished by its chef, or the link may be wrong."
            action={{ label: "Browse recipes", href: "/recipes" }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <title>{`${recipe.title} — Chefalio`}</title>
      <RecipeDetail recipe={recipe} />
    </>
  );
}
