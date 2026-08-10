"use client";

import { AUTH_PANELS } from "@/components/Home/imagery";
import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthLink,
  AuthResult,
  AuthSubmit,
} from "@/components/common/AuthBits";
import { FormField } from "@/components/common/FormField";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
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
        toast.error(
          "Reset token is missing. Please use the link from your email.",
          { position: "bottom-right" },
        );
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

  if (!resetToken) {
    return (
      <AuthLayout
        panel={AUTH_PANELS.recover}
        title="That link didn't work"
        subtitle="Reset links expire, and each one can only be used once."
        footer={<AuthLink href="/login">Back to sign in</AuthLink>}
      >
        <AuthResult
          tone="error"
          title="Invalid reset link"
          actions={
            <AuthLink href="/forgot-password">Request a new link</AuthLink>
          }
        >
          This password reset link is invalid or has expired. Request a new one
          and we&apos;ll email it straight over.
        </AuthResult>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      panel={AUTH_PANELS.recover}
      title="Set a new password"
      subtitle="Choose something at least 6 characters long that you haven't used here before."
      footer={
        <>
          Back to <AuthLink href="/login">sign in</AuthLink>
        </>
      }
    >
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

        <AuthSubmit
          pending={isLoading}
          pendingLabel="Resetting…"
          disabled={!resetToken}
        >
          Reset password
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
