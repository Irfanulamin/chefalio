"use client";

import { FormField } from "@/components/common/FormField";
import { useAuth } from "@/hooks/axios";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";
import {
  ShieldCheckIcon,
  UserCircleIcon,
  LockKeyIcon,
  EnvelopeIcon,
  AtIcon,
  ChefHatIcon,
  XIcon,
  PlusIcon,
  TrophyIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import z from "zod";
import { useProfile } from "@/hooks/useAuth";
import { useMyChefProfile, useUpsertChefProfile } from "@/hooks/useChefProfile";
import type { Achievement, ChefProfile } from "@/types/chef-profile.type";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { SegmentedTabs, type Segment } from "@/components/User/shared/SegmentedTabs";
import { SafeImage } from "@/components/common/SafeImage";
import { initialsOf } from "@/lib/recipe-display";

const MIN_PASSWORD_LENGTH = 6;

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
        {genres.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <li key={g} className="ui-chip" data-active="true">
                {g}
                <button
                  type="button"
                  onClick={() => setGenres((prev) => prev.filter((x) => x !== g))}
                  aria-label={`Remove ${g}`}
                  className="focus-ring rounded-full"
                >
                  <XIcon size={11} weight="bold" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <label htmlFor="chef-genre" className="sr-only">
            Add a genre
          </label>
          <Input
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
            className="h-9 flex-1 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addGenre}
            className="h-9 px-3"
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
        {achievements.length > 0 && (
          <ul className="space-y-2">
            {achievements.map((a, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg p-3"
                style={{
                  backgroundColor: "var(--cs-warning-bg)",
                  border: "1px solid var(--cs-warning-edge)",
                }}
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <TrophyIcon
                    size={14}
                    weight="fill"
                    aria-hidden
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--cs-warning-fg)" }}
                  />
                  <div className="min-w-0">
                    <p
                      className="ui-subheading leading-tight"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {a.title}
                      {a.year && (
                        <span
                          className="ui-micro ui-numeric ml-1.5 font-normal"
                          style={{ color: "var(--cs-warning-fg)" }}
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
                <button
                  type="button"
                  onClick={() =>
                    setAchievements((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  aria-label={`Remove ${a.title}`}
                  className="focus-ring shrink-0 rounded-md"
                  style={{ color: "var(--cs-warning-fg)" }}
                >
                  <XIcon size={14} weight="bold" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div
          className="space-y-3 rounded-lg p-4"
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
          <Input
            id="ach-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (required)"
            className="h-9 text-sm"
          />
          <label htmlFor="ach-desc" className="sr-only">
            Achievement description
          </label>
          <Input
            id="ach-desc"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="h-9 text-sm"
          />
          <div className="flex gap-2">
            <label htmlFor="ach-year" className="sr-only">
              Year
            </label>
            <Input
              id="ach-year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="Year (optional)"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              className="h-9 w-36 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAchievement}
              disabled={!newTitle.trim()}
              className="h-9 gap-1.5"
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

type Tab = "profile" | "chef-profile" | "security";

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { changePassword } = useAuth();

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

  const securityFieldDefinitions = [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter current password",
      type: "password",
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
      type: "password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm new password",
      type: "password",
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

  const securityForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        toast.success("Password updated", { position: "bottom-right" });
        securityForm.reset();
      } catch (err: Error | unknown) {
        const msg = err instanceof Error ? err.message : "Couldn't update your password";
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
          <div className="space-y-6">
            <SettingsSection
              title="Change password"
              description={`At least ${MIN_PASSWORD_LENGTH} characters, and not one you use anywhere else.`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  securityForm.handleSubmit();
                }}
                className="space-y-5"
              >
                {securityFieldDefinitions.map((def) => (
                  <FormField key={def.name} form={securityForm} {...def} />
                ))}

                <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p
                    className="ui-micro flex items-center gap-1.5"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    <LockKeyIcon size={13} weight="fill" aria-hidden />
                    You&rsquo;ll stay signed in on this device.
                  </p>
                  <Button type="submit" className="h-10 rounded-lg">
                    Update password
                  </Button>
                </div>
              </form>
            </SettingsSection>
          </div>
        )}
      </div>
    </div>
  );
}
