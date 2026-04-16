"use client";

import AuthLayout from "@/components/common/AuthLayout";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();

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
      try {
        await login(value);
        toast.success("Signed in successfully!", { position: "bottom-right" });
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Login failed. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
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

  const justReset = searchParams.get("reset") === "success";

  return (
    <AuthLayout imageSrc="/login.png" imageAlt="Chefalio Login">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Sign In</h1>

        {justReset ? (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm text-[#7A9A20] dark:text-primary">
            Password reset successfully. Sign in with your new password.
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Welcome back! Please enter your details to sign in.
          </p>
        )}
      </div>
      <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-6" />
      <form
        className="space-y-4"
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
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-sm text-center text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium cursor-pointer hover:underline"
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
