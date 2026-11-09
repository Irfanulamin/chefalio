"use client";

import AuthLayout from "@/components/common/AuthLayout";
import {
  AuthDivider,
  AuthLink,
  AuthNotice,
  AuthSubmit,
} from "@/components/common/AuthBits";
import { AuthField } from "@/components/common/AuthField";
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
  ChefHatIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

// Fixed accounts from `seed-demo-accounts.js`, one per role — so anyone
// reviewing the project can get into every dashboard without registering
// or being handed real credentials out of band.
const DEMO_ACCOUNTS = [
  {
    role: "User",
    usernameOrEmail: "user@chefalio-demo.com",
    icon: UserIcon,
  },
  {
    role: "Chef",
    usernameOrEmail: "chef@chefalio-demo.com",
    icon: ChefHatIcon,
  },
  {
    role: "Admin",
    usernameOrEmail: "admin@chefalio-demo.com",
    icon: ShieldCheckIcon,
  },
] as const;
const DEMO_PASSWORD = "Chefalio123!";

function LoginForm() {
  const { login, resendVerification, isResendingVerification } = useAuth();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoRole, setDemoRole] = useState<string | null>(null);
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

  /* `autoComplete` was missing entirely, so password managers had to guess
     what these two fields were — and browsers wouldn't offer to fill or
     save the credential at all. */
  const fieldDefinitions = [
    {
      name: "usernameOrEmail",
      label: "Email or username",
      placeholder: "you@example.com",
      type: "text",
      autoComplete: "username",
      icon: UserIcon,
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Your password",
      type: "password",
      autoComplete: "current-password",
      icon: LockIcon,
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

  const handleDemoLogin = async (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setDemoRole(account.role);
    try {
      await login({
        usernameOrEmail: account.usernameOrEmail,
        password: DEMO_PASSWORD,
      });
      toast.success(`Signed in as demo ${account.role.toLowerCase()}`, {
        position: "bottom-right",
      });
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Demo login failed.";
      toast.error(errorMessage, { position: "bottom-right" });
    } finally {
      setDemoRole(null);
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
      subtitle="Sign in to your saved recipes, the chefs you follow and your orders."
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/sign-up">Sign up</AuthLink>
        </>
      }
      aside={
        <div>
          <p className="type-caption" style={{ color: "var(--ink-soft)" }}>
            Just looking? Try a read-only demo account.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              const pending = demoRole === account.role;
              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleDemoLogin(account)}
                  disabled={demoRole !== null}
                  aria-label={`Sign in as the demo ${account.role.toLowerCase()}`}
                  className="landing-focus type-caption inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-(--rule) bg-[#FFFDF8] font-medium transition-colors duration-150 hover:border-(--ink-soft) disabled:cursor-default disabled:opacity-55"
                >
                  {pending ? (
                    <span
                      aria-hidden
                      className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                  ) : (
                    <Icon size={14} />
                  )}
                  {account.role}
                </button>
              );
            })}
          </div>
        </div>
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
          <div className="space-y-4">
            {fieldDefinitions.map((fieldDef) => (
              <AuthField key={fieldDef.name} form={form} {...fieldDef} />
            ))}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="landing-focus type-caption rounded-sm font-medium underline-offset-4 hover:underline"
              style={{ color: "var(--ink-soft)" }}
            >
              Forgot your password?
            </Link>
          </div>

          <AuthSubmit pending={isSubmitting} pendingLabel="Signing in…">
            Sign in
          </AuthSubmit>
        </form>

        <div>
          <AuthDivider label="or" />
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
