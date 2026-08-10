"use client";

import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthDivider,
  AuthLink,
  AuthNotice,
  AuthSubmit,
} from "@/components/common/AuthBits";
import { FormField } from "@/components/common/FormField";
import { FieldGroup } from "@/components/ui/field";
import { OAuthButtons } from "@/components/common/OAuthButtons";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  ArrowClockwiseIcon,
} from "@phosphor-icons/react/dist/ssr";

function LoginForm() {
  const { login, resendVerification, isResendingVerification } = useAuth();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unverifiedLogin, setUnverifiedLogin] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const loginSchema = z.object({
    usernameOrEmail: z
      .string()
      .min(3, "Username or email must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm({
    defaultValues: { usernameOrEmail: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setUnverifiedLogin(null);
      setResendSent(false);
      try {
        await login(value);
        toast.success("Signed in successfully!", { position: "bottom-right" });
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Login failed. Please try again.";
        if (errorMessage.toLowerCase().includes("not verified")) {
          setUnverifiedLogin(value.usernameOrEmail);
        } else {
          toast.error(errorMessage, { position: "bottom-right" });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fieldDefinitions = [
    {
      name: "usernameOrEmail",
      label: "Email or Username",
      placeholder: "Enter your username or email",
      type: "text",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  ];

  const handleResendFromLogin = async () => {
    if (!unverifiedLogin) return;
    try {
      await resendVerification({ usernameOrEmail: unverifiedLogin });
      setResendSent(true);
    } catch {
      setResendSent(true);
    }
  };

  const justReset = searchParams.get("reset") === "success";
  const oauthError = searchParams.get("error");

  const oauthErrorMessages: Record<string, string> = {
    oauth_failed: "Google sign-in was cancelled or failed. Please try again.",
    account_deactivated:
      "Your account has been deactivated. Please contact support.",
  };
  const oauthErrorMessage = oauthError
    ? (oauthErrorMessages[oauthError] ??
      "Something went wrong. Please try again.")
    : null;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to get to your library, your saved recipes, and your dashboard."
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/register">Sign up</AuthLink>
        </>
      }
    >
      <div className="space-y-5">
        {justReset && (
          <AuthNotice tone="success">
            Password reset successfully. Sign in with your new password.
          </AuthNotice>
        )}

        {oauthErrorMessage && (
          <AuthNotice tone="error">{oauthErrorMessage}</AuthNotice>
        )}

        {unverifiedLogin && (
          <AuthNotice tone="warning">
            <p>
              Your email is not verified. Check your inbox, or request a new
              link.
            </p>
            {resendSent ? (
              <p className="mt-1.5 font-medium">
                A new verification link has been sent if the account exists.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={isResendingVerification}
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 font-semibold underline underline-offset-2 disabled:opacity-60"
              >
                <ArrowClockwiseIcon
                  size={13}
                  className={isResendingVerification ? "animate-spin" : ""}
                />
                {isResendingVerification
                  ? "Sending…"
                  : "Resend verification email"}
              </button>
            )}
          </AuthNotice>
        )}

        <form
          className={`space-y-5 transition-opacity duration-200 ${
            isSubmitting ? "pointer-events-none opacity-60" : ""
          }`}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {fieldDefinitions.map((fieldDef) => (
              <FormField key={fieldDef.name} form={form} {...fieldDef} />
            ))}
          </FieldGroup>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="type-caption font-medium transition-opacity duration-150 hover:opacity-70"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              Forgot your password?
            </Link>
          </div>

          <AuthSubmit pending={isSubmitting} pendingLabel="Signing in…">
            Sign in
          </AuthSubmit>
        </form>

        <div>
          <AuthDivider label="or continue with" />
          <OAuthButtons />
        </div>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
