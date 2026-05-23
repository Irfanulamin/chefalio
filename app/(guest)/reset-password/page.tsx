"use client";

import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { LockKeyIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";
  const { resetPassword, isLoading } = useAuth();

  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      if (!resetToken) {
        toast.error("Reset token is missing. Please use the link from your email.", {
          position: "bottom-right",
        });
        return;
      }

      try {
        await resetPassword({ resetToken, newPassword: value.newPassword });
        toast.success("Your password has been reset successfully.", {
          position: "bottom-right",
        });
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--cs-surface-1)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-sm"
        style={{
          backgroundColor: "var(--cs-surface-1)",
          border: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="block text-xl font-extrabold tracking-tight mb-8"
          style={{ color: "var(--cs-accent)" }}
        >
          Chefalio
        </Link>

        {!resetToken ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50">
              <WarningCircleIcon size={28} className="text-red-500" weight="fill" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--cs-text-primary)" }}>
                Invalid reset link
              </h2>
              <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium mt-2"
              style={{ color: "var(--cs-accent)" }}
            >
              Request new link
            </Link>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--cs-accent-muted)" }}
            >
              <LockKeyIcon size={22} weight="duotone" style={{ color: "var(--cs-accent)" }} />
            </div>

            <h1
              className="text-xl font-semibold tracking-tight mb-1"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Set a new password
            </h1>
            <p className="text-sm mb-6" style={{ color: "var(--cs-text-secondary)" }}>
              Choose a strong password of at least 6 characters.
            </p>

            <div className="h-px mb-6" style={{ backgroundColor: "var(--cs-border-subtle)" }} />

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <FormField
                  form={form}
                  name="newPassword"
                  label="New password"
                  placeholder="At least 6 characters"
                  type="password"
                />
                <FormField
                  form={form}
                  name="confirmPassword"
                  label="Confirm new password"
                  placeholder="Repeat your password"
                  type="password"
                />
              </FieldGroup>

              <Button
                type="submit"
                className="w-full py-5 font-semibold"
                disabled={isLoading || !resetToken}
              >
                {isLoading ? "Resetting…" : "Reset Password"}
              </Button>

              <p className="text-center text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                Back to{" "}
                <Link
                  href="/login"
                  className="font-medium hover:underline"
                  style={{ color: "var(--cs-accent)" }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
