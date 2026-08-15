"use client";

import { AUTH_PANELS } from "@/components/Home/imagery";
import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthLink,
  AuthResult,
  AuthSubmit,
} from "@/components/common/AuthBits";
import { AuthField } from "@/components/common/AuthField";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [onSuccess, setOnSuccess] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.email("Invalid email format"),
  });

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword(value);
        toast.success(
          "If an account exists, a password reset link has been sent to your email.",
          { position: "bottom-right" },
        );
        setOnSuccess(true);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
      }
    },
  });

  if (onSuccess) {
    return (
      <AuthLayout
        panel={AUTH_PANELS.recover}
        title="Link sent"
        subtitle="If that email is registered, the reset link is on its way."
        footer={<AuthLink href="/sign-in">Back to sign in</AuthLink>}
      >
        <AuthResult label="Email sent" title="Check your email">
          If an account exists for that address, a password reset link has been
          sent. Check your spam folder if you don&apos;t see it.
        </AuthResult>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      panel={AUTH_PANELS.recover}
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
      footer={
        <>
          Remembered it? <AuthLink href="/sign-in">Back to sign in</AuthLink>
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
        <AuthField
          form={form}
          name="email"
          label="Email address"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          icon={EnvelopeSimpleIcon}
        />

        <AuthSubmit pending={isLoading} pendingLabel="Sending…">
          Send reset link
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
}
