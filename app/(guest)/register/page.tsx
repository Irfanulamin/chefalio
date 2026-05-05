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
import { useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerSchema = z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .max(50, "Full name must be at most 50 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const form = useForm({
    defaultValues: { fullName: "", username: "", email: "", password: "" },
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await register(value);
        toast.success("Account created successfully!", {
          position: "bottom-right",
        });
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create account. Please try again.";
        toast.error(errorMessage, { position: "bottom-right" });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fieldDefinitions = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      name: "username",
      label: "Username",
      placeholder: "Enter your username",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
  ];

  return (
    <AuthLayout
      imageSrc="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530581/register_eu7mjh.png"
      imageAlt="Chefalio Register"
    >
      <div>
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-sm text-gray-500">
          Please enter your details to create an account.
        </p>
      </div>
      <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-6" />
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
        <Button
          type="submit"
          className="w-full rounded-lg py-5"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">
            or sign up with
          </span>
        </div>
      </div>

      <OAuthButtons />

      <p className="text-sm text-center text-gray-500 tracking-wide">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium cursor-pointer hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
