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

export default function RegisterPage() {
  const { register, isLoading } = useAuth();

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
    <AuthLayout imageSrc="/register.png" imageAlt="Chefalio Register">
      <div>
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <p className="text-sm text-gray-500">
          Please enter your details to create an account.
        </p>
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
        <Button
          type="submit"
          className="w-full rounded-lg py-5"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

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
