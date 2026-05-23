"use client";

import AuthLayout from "@/components/common/AuthLayout";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { OAuthButtons } from "@/components/common/OAuthButtons";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";

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
    ? (oauthErrorMessages[oauthError] ?? "Something went wrong. Please try again.")
    : null;

  return (
    <AuthLayout
      imageSrc="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530582/login_wcwztq.png"
      imageAlt="Chefalio Login"
    >
      <div>
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--cs-text-primary)" }}>Sign In</h1>

        {justReset ? (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent)", border: "1px solid var(--cs-accent)" }}>
            Password reset successfully. Sign in with your new password.
          </div>
        ) : oauthErrorMessage ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {oauthErrorMessage}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
            Welcome back! Please enter your details to sign in.
          </p>
        )}

        {unverifiedLogin && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 space-y-2 mt-2">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Your email is not verified. Please check your inbox or request a new link.
            </p>
            {resendSent ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                A new verification link has been sent if the account exists.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={isResendingVerification}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
              >
                <ArrowClockwiseIcon
                  size={13}
                  className={isResendingVerification ? "animate-spin" : ""}
                />
                {isResendingVerification ? "Sending…" : "Resend verification email"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="h-px mb-6" style={{ backgroundColor: "var(--cs-border-subtle)" }} />
      <form
        className={`space-y-4 transition-opacity duration-200 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
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
        <p className="text-sm text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-dashed decoration-gray-400 hover:decoration-black dark:hover:decoration-white"
          >
            Forgot your password?
          </Link>
        </p>
        <Button
          type="submit"
          className="w-full rounded-lg py-5 tracking-wide"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full" style={{ borderTop: "1px solid var(--cs-border-default)" }} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2" style={{ backgroundColor: "var(--cs-surface-1)", color: "var(--cs-text-tertiary)" }}>
            or continue with
          </span>
        </div>
      </div>

      <OAuthButtons />

      <p className="text-sm text-center" style={{ color: "var(--cs-text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium hover:underline"
          style={{ color: "var(--cs-accent)" }}
        >
          Sign up
        </Link>
      </p>
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
