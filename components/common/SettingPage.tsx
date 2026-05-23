"use client";

import { FormField } from "@/components/common/FormField";
import { useAuth } from "@/hooks/axios";
import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
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
import type { Achievement } from "@/types/chef-profile.type";

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
      className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
      style={{ backgroundColor: "var(--cs-surface-3)" }}
    >
      <Icon size={14} weight="duotone" style={{ color: "var(--cs-text-secondary)" }} />
    </span>
    <span className="text-xs w-16 shrink-0" style={{ color: "var(--cs-text-tertiary)" }}>
      {label}
    </span>
    <span className="text-sm font-medium truncate" style={{ color: "var(--cs-text-primary)" }}>
      {value ?? "—"}
    </span>
  </div>
);

function ChefProfileTab() {
  const { profile: chefProfile, isLoading } = useMyChefProfile();
  const { upsertProfile, isPending } = useUpsertChefProfile();

  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newYear, setNewYear] = useState("");
  const genreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chefProfile) {
      setBio(chefProfile.bio ?? "");
      setGenres(chefProfile.genres ?? []);
      setAchievements(chefProfile.achievements ?? []);
    }
  }, [chefProfile]);

  const addGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) setGenres((prev) => [...prev, trimmed]);
    setGenreInput("");
  };

  const addAchievement = () => {
    if (!newTitle.trim()) return;
    const yearNum = newYear ? parseInt(newYear) : undefined;
    setAchievements((prev) => [
      ...prev,
      { title: newTitle.trim(), description: newDesc.trim() || undefined, year: yearNum },
    ]);
    setNewTitle("");
    setNewDesc("");
    setNewYear("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertProfile({ bio, genres, achievements });
      toast.success("Chef profile updated!", { position: "bottom-right" });
    } catch {
      toast.error("Failed to update chef profile.", { position: "bottom-right" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-6 space-y-3"
            style={{
              border: "1px solid var(--cs-border-subtle)",
              backgroundColor: "var(--cs-surface-2)",
            }}
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bio */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-2)",
        }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
            Bio
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
            Tell visitors about your culinary background and style
          </p>
        </div>
        <div className="relative">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Share your culinary story..."
            className="w-full resize-none rounded-lg px-3 py-2.5 text-sm placeholder-[var(--cs-text-tertiary)] focus:outline-none focus:ring-2 transition-shadow"
            style={{
              border: "1px solid var(--cs-border-default)",
              backgroundColor: "var(--cs-surface-3)",
              color: "var(--cs-text-primary)",
            }}
          />
          <span
            className="absolute bottom-2 right-3 text-[11px] tabular-nums"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {bio.length}/1000
          </span>
        </div>
      </div>

      {/* Genres */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-2)",
        }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
            Cuisine Genres
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
            Tag your culinary specialties (e.g. Italian, Vegan, Pastry)
          </p>
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <span
                key={g}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--cs-accent-muted)",
                  color: "var(--cs-accent)",
                  border: "1px solid var(--cs-accent)",
                }}
              >
                {g}
                <button
                  type="button"
                  onClick={() => setGenres((prev) => prev.filter((x) => x !== g))}
                  style={{ color: "var(--cs-accent)" }}
                >
                  <XIcon size={11} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            ref={genreInputRef}
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addGenre(); }
            }}
            placeholder="Type a genre and press Enter..."
            className="flex-1 h-9 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={addGenre} className="h-9 px-3">
            <PlusIcon size={14} />
          </Button>
        </div>
      </div>

      {/* Achievements */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-2)",
        }}
      >
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
            Achievements
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
            Awards, certifications, and career highlights
          </p>
        </div>

        {achievements.length > 0 && (
          <div className="space-y-2">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 p-3 rounded-lg"
                style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <TrophyIcon size={14} weight="fill" style={{ color: "#a16207", marginTop: "2px" }} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight" style={{ color: "#92400e" }}>
                      {a.title}
                      {a.year && (
                        <span className="ml-1.5 text-xs font-normal" style={{ color: "#a16207" }}>
                          {a.year}
                        </span>
                      )}
                    </p>
                    {a.description && (
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#a16207" }}>
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAchievements((prev) => prev.filter((_, idx) => idx !== i))}
                  style={{ color: "#a16207" }}
                  className="shrink-0"
                >
                  <XIcon size={14} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            border: "1px solid var(--cs-border-default)",
            backgroundColor: "var(--cs-surface-3)",
          }}
        >
          <p className="text-xs font-medium" style={{ color: "var(--cs-text-secondary)" }}>
            Add achievement
          </p>
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title *" className="h-9 text-sm" />
          <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="h-9 text-sm" />
          <div className="flex gap-2">
            <Input
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              placeholder="Year (optional)"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              className="h-9 text-sm w-36"
            />
            <Button type="button" variant="outline" size="sm" onClick={addAchievement} disabled={!newTitle.trim()} className="h-9 gap-1.5">
              <PlusIcon size={14} /> Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="h-10 rounded-lg capitalize">
          {isPending ? "Saving..." : "Save Chef Profile"}
        </Button>
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "chef-profile" | "security">("profile");

  const profileFieldDefinitions = [
    { name: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
    { name: "image", label: "Profile Image", placeholder: "Upload your profile image", type: "dropzone" },
  ];

  const changePasswordSchema = z
    .object({
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
      currentPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const securityFieldDefinitions = [
    { name: "currentPassword", label: "Current Password", placeholder: "Enter current password", type: "password" },
    { name: "newPassword", label: "New Password", placeholder: "Enter new password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", placeholder: "Confirm new password", type: "password" },
  ];

  const profileForm = useForm({
    defaultValues: { fullName: "", image: [] as File[] },
    onSubmit: async ({ value }) => {
      try {
        updateProfile(value);
        toast.success("Profile updated successfully!", { position: "bottom-right" });
        profileForm.reset();
      } catch (err: Error | unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update profile.";
        toast.error(msg, { position: "bottom-right" });
      }
    },
  });

  const securityForm = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({ currentPassword: value.currentPassword, newPassword: value.newPassword });
        toast.success("Password updated successfully!", { position: "bottom-right" });
        securityForm.reset();
      } catch (err: Error | unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update password.";
        toast.error(msg, { position: "bottom-right" });
      }
    },
  });

  const tabs: { id: "profile" | "chef-profile" | "security"; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: UserCircleIcon },
    ...(profile?.role === "chef" ? [{ id: "chef-profile" as const, label: "Chef Profile", icon: ChefHatIcon }] : []),
    { id: "security", label: "Security", icon: ShieldCheckIcon },
  ];

  return (
    <div className="page-root">
      <div className="page-content space-y-6">
        {/* Page header */}
        <div className="pb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--cs-text-primary)" }}>
            Settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--cs-text-secondary)" }}>
            Manage your profile and security preferences.
          </p>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                activeTab === id
                  ? {
                      backgroundColor: "var(--cs-surface-1)",
                      color: "var(--cs-text-primary)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      border: "1px solid var(--cs-border-subtle)",
                    }
                  : { color: "var(--cs-text-secondary)" }
              }
            >
              <Icon
                size={16}
                weight={activeTab === id ? "fill" : "regular"}
                style={activeTab === id ? { color: "var(--cs-accent)" } : undefined}
              />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                border: "1px solid var(--cs-border-subtle)",
                backgroundColor: "var(--cs-surface-2)",
              }}
            >
              {/* Banner */}
              <div className="h-20" style={{ backgroundColor: "var(--cs-surface-3)", borderBottom: "1px solid var(--cs-border-subtle)" }} />

              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-5">
                  <div className="relative">
                    <Image
                      src={profile?.profile_url || "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530580/default-profile_j24ibg.png"}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="object-cover w-20 h-20 rounded-full"
                      style={{ border: "4px solid var(--cs-surface-1)" }}
                    />
                    <span
                      className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-400"
                      style={{ border: "2px solid var(--cs-surface-1)" }}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <h2 className="text-lg font-bold leading-tight" style={{ color: "var(--cs-text-primary)" }}>
                    {profile?.fullName || "Your Name"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
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
                  <InfoRow icon={AtIcon} label="Handle" value={`@${profile?.username}`} />
                  <InfoRow icon={UserCircleIcon} label="Name" value={profile?.fullName} />
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                border: "1px solid var(--cs-border-subtle)",
                backgroundColor: "var(--cs-surface-2)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                    Edit Profile
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                    Update your public information
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); profileForm.handleSubmit(); }}
                className="space-y-5"
              >
                {profileFieldDefinitions.map((def) => (
                  <FormField key={def.name} form={profileForm} {...def} />
                ))}
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="h-10 rounded-lg capitalize">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "chef-profile" && <ChefProfileTab />}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Security status */}
            <div
              className="rounded-xl p-5 flex items-start gap-4"
              style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#dcfce7", border: "1px solid #86efac" }}
              >
                <ShieldCheckIcon size={20} weight="fill" style={{ color: "#22c55e" }} />
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#15803d" }}>
                  Account Protected
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#166534" }}>
                  Your account is secured with a strong password. Consider updating it regularly.
                </p>
              </div>
            </div>

            {/* Password form */}
            <div
              className="rounded-xl p-6"
              style={{
                border: "1px solid var(--cs-border-subtle)",
                backgroundColor: "var(--cs-surface-2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    border: "1px solid var(--cs-border-default)",
                  }}
                >
                  <LockKeyIcon size={16} weight="duotone" style={{ color: "var(--cs-text-secondary)" }} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--cs-text-primary)" }}>
                    Change Password
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                    Use a strong, unique password
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); securityForm.handleSubmit(); }}
                className="space-y-5"
              >
                {securityFieldDefinitions.map((def) => (
                  <FormField key={def.name} form={securityForm} {...def} />
                ))}

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--cs-text-tertiary)" }}>
                    <ShieldCheckIcon size={13} weight="fill" style={{ color: "var(--cs-border-default)" }} />
                    Minimum 8 characters recommended
                  </p>
                  <Button type="submit" className="h-10 rounded-lg flex items-center gap-1.5 capitalize">
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
