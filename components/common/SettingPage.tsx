"use client";

import { FormField } from "@/components/common/FormField";
import { useAuth } from "@/hooks/axios";
import { useForm, useStore } from "@tanstack/react-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import {
  ShieldCheckIcon,
  UserCircleIcon,
  LockKeyIcon,
  EnvelopeIcon,
  AtIcon,
  ChefHatIcon,
  PlusIcon,
  TrophyIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SPRING } from "@/lib/motion";
import { Chip, RemoveButton, TextInput } from "@/components/common/form/FormKit";
import z from "zod";
import { useProfile } from "@/hooks/useAuth";
import { useMyChefProfile, useUpsertChefProfile } from "@/hooks/useChefProfile";
import type { Achievement, ChefProfile } from "@/types/chef-profile.type";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { SegmentedTabs, type Segment } from "@/components/User/shared/SegmentedTabs";
import { SafeImage } from "@/components/common/SafeImage";
import { initialsOf } from "@/lib/recipe-display";

const MIN_PASSWORD_LENGTH = 6;

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
    confirmPassword: z.string(),
    currentPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** A labelled fact about the account. */
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) => (
  <div
    className="flex items-center gap-3 py-2.5 last:border-0"
    style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
  >
    <span
      aria-hidden
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <Icon size={14} weight="duotone" style={{ color: "var(--cs-text-secondary)" }} />
    </span>
    <span
      className="ui-micro w-16 shrink-0"
      style={{ color: "var(--cs-text-tertiary)" }}
    >
      {label}
    </span>
    <span
      className="ui-body truncate font-medium"
      style={{ color: "var(--cs-text-primary)" }}
    >
      {value ?? "—"}
    </span>
  </div>
);

/** The card shell every settings section shares. */
function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ui-card space-y-4 p-6">
      <div>
        <h3 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
          {title}
        </h3>
        <p className="ui-caption mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

/**
 * The chef profile form.
 *
 * Split from its loader so it can initialise `useState` straight from
 * props. It previously copied the fetched profile into state inside a
 * `useEffect`, which meant a background refetch could silently overwrite
 * edits in progress — you could be halfway through rewriting your bio,
 * have React Query refetch on window focus, and watch your text revert.
 * Mounting under a `key` gives the same "load once" behaviour without
 * the effect or the clobbering.
 */
function ChefProfileForm({ initial }: { initial: ChefProfile | null }) {
  const { upsertProfile, isPending } = useUpsertChefProfile();

  const [bio, setBio] = useState(initial?.bio ?? "");
  const [genres, setGenres] = useState<string[]>(initial?.genres ?? []);
  const [achievements, setAchievements] = useState<Achievement[]>(
    initial?.achievements ?? [],
  );
  const [genreInput, setGenreInput] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newYear, setNewYear] = useState("");

  const addGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) setGenres((prev) => [...prev, trimmed]);
    setGenreInput("");
  };

  const addAchievement = () => {
    if (!newTitle.trim()) return;
    setAchievements((prev) => [
      ...prev,
      {
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        year: newYear ? parseInt(newYear) : undefined,
      },
    ]);
    setNewTitle("");
    setNewDesc("");
    setNewYear("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertProfile({ bio, genres, achievements });
      toast.success("Chef profile updated", { position: "bottom-right" });
    } catch {
      toast.error("Couldn't update your chef profile", { position: "bottom-right" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SettingsSection
        title="Bio"
        description="This is the first thing someone reads on your profile."
      >
        <div className="relative">
          <label htmlFor="chef-bio" className="sr-only">
            Bio
          </label>
          <textarea
            id="chef-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Where you've cooked, and what you cook…"
            className="focus-ring w-full resize-none rounded-lg px-3 py-2.5 pb-7 text-sm outline-none"
            style={{
              border: "1px solid var(--cs-border-default)",
              backgroundColor: "var(--cs-surface-1)",
              color: "var(--cs-text-primary)",
            }}
          />
          <span
            className="ui-micro ui-numeric absolute bottom-3 right-3"
            style={{
              color: bio.length > 950 ? "var(--cs-warning-fg)" : "var(--cs-text-tertiary)",
            }}
          >
            {bio.length}/1000
          </span>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Cuisine genres"
        description="What you specialise in — Italian, vegan, pastry."
      >
        {/* Chips pop on arrival and scale away on removal, entering and
            leaving along the same path. The list reflows with a spring, so
            removing one from the middle visibly closes the gap rather than
            teleporting the rest. */}
        {genres.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            <AnimatePresence initial={false} mode="popLayout">
              {genres.map((g) => (
                <motion.li key={g} layout>
                  <Chip
                    label={g}
                    onRemove={() => setGenres((prev) => prev.filter((x) => x !== g))}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <div className="flex gap-2">
          <label htmlFor="chef-genre" className="sr-only">
            Add a genre
          </label>
          <TextInput
            id="chef-genre"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addGenre();
              }
            }}
            placeholder="Type a genre and press Enter…"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addGenre}
            disabled={!genreInput.trim()}
            className="h-9 px-3 shrink-0 rounded-[10px]"
            aria-label="Add genre"
          >
            <PlusIcon size={14} />
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Achievements"
        description="Awards, certifications and career highlights."
      >
        {/*
          These were rendered on `--cs-warning-bg` inside `--cs-warning-edge`,
          with the year and the trophy in `--cs-warning-fg`. That's the
          reserved caution triplet — the same amber the app uses for "stock
          running low" and "this needs attention" — spent on a Michelin star.
          Every award a chef had earned was styled as a problem with their
          account.

          Status colours are reserved; an achievement isn't a status. These
          now sit on the ordinary surface ramp, and the only colour on them
          is the accent on the trophy, which is the one thing here that is
          genuinely celebratory.
        */}
        {achievements.length > 0 && (
          <ul className="space-y-2">
            <AnimatePresence initial={false} mode="popLayout">
              {achievements.map((a, i) => (
                <motion.li
                  key={`${a.title}-${a.year ?? ""}`}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={SPRING.snappy}
                  className="flex items-start justify-between gap-3 rounded-xl p-3"
                  style={{
                    backgroundColor: "var(--cs-surface-1)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--cs-accent-muted)" }}
                    >
                      <TrophyIcon
                        size={13}
                        weight="fill"
                        style={{ color: "var(--cs-accent-text)" }}
                      />
                    </span>
                    <div className="min-w-0">
                      <p
                        className="ui-subheading leading-tight"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {a.title}
                        {a.year && (
                          <span
                            className="ui-micro ui-numeric ml-1.5 font-normal"
                            style={{ color: "var(--cs-text-tertiary)" }}
                          >
                            {a.year}
                          </span>
                        )}
                      </p>
                      {a.description && (
                        <p
                          className="ui-micro mt-0.5"
                          style={{ color: "var(--cs-text-secondary)" }}
                        >
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <RemoveButton
                    onClick={() =>
                      setAchievements((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    label={`Remove ${a.title}`}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* The composer is one step recessed from the saved entries above
            it, so "things you've added" and "the thing you're adding" are
            visibly different states rather than one undifferentiated stack. */}
        <div
          className="space-y-3 rounded-xl p-4"
          style={{
            border: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-3)",
          }}
        >
          <p className="ui-label" style={{ color: "var(--cs-text-tertiary)" }}>
            Add achievement
          </p>
          <label htmlFor="ach-title" className="sr-only">
            Achievement title
          </label>
          <TextInput
            id="ach-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAchievement();
              }
            }}
            placeholder="Title — required"
          />
          <label htmlFor="ach-desc" className="sr-only">
            Achievement description
          </label>
          <TextInput
            id="ach-desc"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description — optional"
          />
          <div className="flex gap-2">
            <label htmlFor="ach-year" className="sr-only">
              Year
            </label>
            <TextInput
              id="ach-year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="Year"
              type="number"
              inputMode="numeric"
              min={1900}
              max={new Date().getFullYear()}
              className="w-32 shrink-0 tabular-nums"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
              disabled={!newTitle.trim()}
              className="h-9 gap-1.5 rounded-[10px] ml-auto"
            >
              <PlusIcon size={14} /> Add
            </Button>
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="h-10 rounded-lg">
          {isPending ? "Saving…" : "Save chef profile"}
        </Button>
      </div>
    </form>
  );
}

function ChefProfileTab() {
  const { profile: chefProfile, isLoading } = useMyChefProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="ui-card space-y-3 p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return <ChefProfileForm key={chefProfile?._id ?? "new"} initial={chefProfile ?? null} />;
}

/* ── Security ─────────────────────────────────────────────────────────── */

/**
 * Live feedback on the new password, as it's typed.
 *
 * The rule was stated once in the section description and then enforced at
 * submit — you typed a five-character password, pressed the button, waited
 * for a round trip, and got told the length was wrong. Apple's guidance on
 * feedback is that it should be continuous *during* an interaction and
 * validated inline, not on submit, and that a control needing a legend to
 * interpret has a mapping problem. So the requirement is a meter attached
 * to the field it governs, filling as you satisfy it.
 *
 * It is deliberately not a "strength" score. Those grade entropy with a
 * heuristic and then say "Weak" about a passphrase that is fine; this
 * reports the one rule the system actually enforces, so the meter reaching
 * the end means the form will accept it.
 */
function PasswordRequirement({
  value,
  confirm,
}: {
  value: string;
  confirm: string;
}) {
  const longEnough = value.length >= MIN_PASSWORD_LENGTH;
  const progress = Math.min(1, value.length / MIN_PASSWORD_LENGTH);
  const matches = confirm.length > 0 && value === confirm;
  const mismatch = confirm.length > 0 && value !== confirm;

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-2.5">
        <div
          className="h-1 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <motion.div
            className="h-full rounded-full"
            animate={{
              width: `${progress * 100}%`,
              backgroundColor: longEnough ? "var(--cs-accent)" : "var(--cs-border-default)",
            }}
            transition={SPRING.snappy}
          />
        </div>
        <span
          className="ui-micro ui-numeric shrink-0"
          style={{
            color: longEnough ? "var(--cs-accent-text)" : "var(--cs-text-tertiary)",
          }}
        >
          {Math.min(value.length, MIN_PASSWORD_LENGTH)} / {MIN_PASSWORD_LENGTH}
        </span>
      </div>

      {/* Match state is reported the moment there's something to compare,
          rather than being held back until submit. */}
      <AnimatePresence initial={false}>
        {(matches || mismatch) && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={SPRING.snappy}
            className="ui-micro flex items-center gap-1.5 overflow-hidden"
            style={{
              color: matches ? "var(--cs-accent-text)" : "var(--cs-danger-fg)",
            }}
          >
            {matches ? (
              <>
                <CheckCircleIcon size={13} weight="fill" aria-hidden />
                Both fields match.
              </>
            ) : (
              <>
                <WarningCircleIcon size={13} weight="fill" aria-hidden />
                The two passwords don&rsquo;t match yet.
              </>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The security tab.
 *
 * Beyond the inline validation, the change here is that the tab says what
 * changing a password actually *does*. It used to be three unlabelled-in-
 * context fields and a button, with one line of reassurance tucked beside
 * the submit. Changing a credential is a consequential action, and Apple's
 * framing is that people need to know where they are and what will happen —
 * so the consequences are stated up front, next to the thing that causes
 * them, rather than discovered afterwards.
 */
function SecurityTab() {
  const { changePassword } = useAuth();

  /* The form lives here rather than in the page. It was declared alongside
     the profile form at the top of `SettingsPage`, which meant every
     keystroke in either one re-rendered the whole settings screen —
     including the chef profile tab's bio, genres and achievements. */
  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        toast.success("Password updated", { position: "bottom-right" });
        form.reset();
      } catch (err: Error | unknown) {
        const msg =
          err instanceof Error ? err.message : "Couldn't update your password";
        toast.error(msg, { position: "bottom-right" });
      }
    },
  });

  const values = useStore(form.store, (s) => s.values);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Change password"
        description={`At least ${MIN_PASSWORD_LENGTH} characters, and not one you use anywhere else.`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <FormField
            form={form}
            name="currentPassword"
            label="Current password"
            placeholder="The one you're using now"
            type="password"
          />

          <div className="space-y-3">
            <FormField
              form={form}
              name="newPassword"
              label="New password"
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              type="password"
            />
            <FormField
              form={form}
              name="confirmPassword"
              label="Confirm new password"
              placeholder="Type it once more"
              type="password"
            />
            {/* The meter governs both fields, so it sits under the pair
                rather than under either one — proximity is what says which
                controls it applies to. */}
            <PasswordRequirement
              value={values.newPassword}
              confirm={values.confirmPassword}
            />
          </div>

          <div
            className="flex items-start gap-2.5 rounded-xl p-3"
            style={{
              backgroundColor: "var(--cs-surface-3)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <LockKeyIcon
              size={14}
              weight="fill"
              aria-hidden
              className="mt-px shrink-0"
              style={{ color: "var(--cs-text-tertiary)" }}
            />
            <p className="ui-micro" style={{ color: "var(--cs-text-secondary)" }}>
              You&rsquo;ll stay signed in on this device. Anywhere else
              you&rsquo;re signed in will need the new password next time.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg transition-transform duration-150 active:scale-[0.98]"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
}

type Tab = "profile" | "chef-profile" | "security";

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();

  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const profileFieldDefinitions = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      name: "image",
      label: "Profile Image",
      placeholder: "Upload your profile image",
      type: "dropzone",
    },
  ];

  const profileForm = useForm({
    defaultValues: { fullName: "", image: [] as File[] },
    onSubmit: async ({ value }) => {
      try {
        updateProfile(value);
        toast.success("Profile updated", { position: "bottom-right" });
        profileForm.reset();
      } catch (err: Error | unknown) {
        const msg = err instanceof Error ? err.message : "Couldn't update your profile";
        toast.error(msg, { position: "bottom-right" });
      }
    },
  });

  const tabs: readonly Segment<Tab>[] = [
    { id: "profile", label: "Profile", Icon: UserCircleIcon },
    ...(profile?.role === "chef"
      ? [{ id: "chef-profile" as const, label: "Chef profile", Icon: ChefHatIcon }]
      : []),
    { id: "security", label: "Security", Icon: ShieldCheckIcon },
  ];

  return (
    <div className="app-root">
      <title>Chefalio — Settings</title>
      <div className="page-content space-y-6">
        <PageHeader
          title="Settings"
          lede="Your account details, and the password that protects them."
        />

        <SegmentedTabs
          segments={tabs}
          value={activeTab}
          onChange={setActiveTab}
          label="Settings sections"
        />

        {activeTab === "profile" && (
          <div className="space-y-6">
            <section className="ui-card overflow-hidden">
              <div
                className="h-20"
                style={{
                  backgroundColor: "var(--cs-surface-3)",
                  borderBottom: "1px solid var(--cs-border-subtle)",
                }}
              />

              <div className="px-6 pb-6">
                <div className="-mt-10 mb-5 flex items-end justify-between">
                  <div
                    className="relative h-20 w-20 overflow-hidden rounded-full"
                    style={{ border: "4px solid var(--cs-surface-1)" }}
                  >
                    <SafeImage
                      src={profile?.profile_url}
                      alt=""
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                      fallback={
                        <span
                          className="flex h-full w-full items-center justify-center text-xl font-bold"
                          style={{
                            backgroundColor: "var(--cs-accent-muted)",
                            color: "var(--cs-accent-text)",
                          }}
                        >
                          {initialsOf(profile?.fullName ?? "")}
                        </span>
                      }
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
                    {profile?.fullName || "Your name"}
                  </h2>
                  <p className="ui-body" style={{ color: "var(--cs-text-secondary)" }}>
                    @{profile?.username || "username"}
                  </p>
                </div>

                <div
                  className="rounded-lg px-4 py-1"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <InfoRow icon={EnvelopeIcon} label="Email" value={profile?.email} />
                  <InfoRow
                    icon={AtIcon}
                    label="Handle"
                    value={profile?.username ? `@${profile.username}` : undefined}
                  />
                  <InfoRow
                    icon={UserCircleIcon}
                    label="Name"
                    value={profile?.fullName}
                  />
                </div>
              </div>
            </section>

            <SettingsSection
              title="Edit profile"
              description="Your name and picture, as other people see them."
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  profileForm.handleSubmit();
                }}
                className="space-y-5"
              >
                {profileFieldDefinitions.map((def) => (
                  <FormField key={def.name} form={profileForm} {...def} />
                ))}
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="h-10 rounded-lg">
                    Save changes
                  </Button>
                </div>
              </form>
            </SettingsSection>
          </div>
        )}

        {activeTab === "chef-profile" && <ChefProfileTab />}

        {activeTab === "security" && (
          <SecurityTab />
        )}
      </div>
    </div>
  );
}
