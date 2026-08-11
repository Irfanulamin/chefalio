"use client";

import { useCookbook, usePaymentCookbook } from "@/hooks/useCookbook";
import { SummaryCard } from "./_components/SummaryCard";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z, { email } from "zod";
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/components/common/EmptyState";
import { cookbookPrice } from "@/lib/recipe-display";
import { use } from "react";

const paymentSchema = z.object({
  email: email().min(3, "Email must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(2, "Postal code must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export default function PurchaseCookbookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { cookbook, isLoading, error } = useCookbook(id);
  const { payCookbookAsync, isLoading: isPaying } = usePaymentCookbook();

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    validators: { onSubmit: paymentSchema },
    onSubmit: async ({ value }) => {
      try {
        await payCookbookAsync({
          cookbookId: id,
          receiptEmail: value.email,
          billingAddress: {
            name: value.name,
            address: value.address,
            city: value.city,
            state: value.state,
            postalCode: value.postalCode,
            country: value.country,
          },
        });
      } catch (err: unknown) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Payment failed. Please try again.",
          { position: "bottom-right" },
        );
      }
    },
  });

  if (isLoading) {
    return (
      <div className="app-root">
        <div className="page-content flex flex-col-reverse justify-center gap-8 lg:flex-row lg:justify-between">
          <div className="w-full flex-1 space-y-5 lg:max-w-2xl">
            <div className="space-y-2">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-64" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
            <Skeleton className="ml-auto h-11 w-full rounded-lg lg:w-32" />
          </div>
          <div className="w-full lg:max-w-sm lg:shrink-0">
            <div className="ui-card overflow-hidden">
              <Skeleton className="w-full rounded-none" style={{ aspectRatio: "3/4" }} />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cookbook) {
    return (
      <div className="app-root">
        <div className="page-content">
          <EmptyState
            icon={<CreditCardIcon size={24} />}
            title="Couldn't open checkout"
            description="We couldn't load this cookbook, so there's nothing to charge you for. Nothing has been taken from your card."
            action={{ label: "Back to cookbooks", href: "/cookbooks" }}
          />
        </div>
      </div>
    );
  }

  const price = cookbookPrice(cookbook.price, cookbook.discount ?? 0);

  const fieldDefinitions = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      type: "text",
    },
    {
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      type: "text",
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Enter your address",
      type: "textarea",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Enter your city",
      type: "text",
    },
    {
      name: "state",
      label: "State",
      placeholder: "Enter your state",
      type: "text",
    },
    {
      name: "postalCode",
      label: "Postal Code",
      placeholder: "Enter your postal code",
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      placeholder: "Enter your country",
      type: "text",
    },
  ];

  return (
    <>
      <title>{`Checkout — ${cookbook.title}`}</title>
      <div className="app-root">
        {/* Summary first in the DOM on mobile (`flex-col-reverse` puts the
            form on top visually) so the thing being bought is the first
            thing read, not seven address fields. */}
        <div className="page-content flex flex-col-reverse justify-center gap-8 lg:flex-row lg:justify-between lg:items-start">
          <form
            className="w-full flex-1 space-y-5 lg:max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <h1
                className="ui-title flex items-center gap-2"
                style={{ color: "var(--cs-text-primary)" }}
              >
                Checkout
                <CreditCardIcon
                  className="h-6 w-6"
                  weight="fill"
                  style={{ color: "var(--cs-accent-text)" }}
                  aria-hidden
                />
              </h1>
              <p className="ui-body mt-1" style={{ color: "var(--cs-text-secondary)" }}>
                Your billing details. Card details are entered on the next screen,
                on Stripe — we never see them.
              </p>
            </div>

            <FieldGroup>
              {fieldDefinitions.map((fieldDef) => (
                <FormField key={fieldDef.name} form={form} {...fieldDef} />
              ))}
            </FieldGroup>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full rounded-lg py-5 lg:w-auto"
                disabled={isPaying}
              >
                {isPaying ? "Redirecting…" : `Pay ${price.current}`}
              </Button>
            </div>
          </form>

          {/* Stays in view while the form is filled in, so the price never
              scrolls out of sight during checkout. */}
          <div className="w-full lg:sticky lg:top-24 lg:max-w-sm lg:shrink-0">
            <SummaryCard cookbook={cookbook} />
          </div>
        </div>
      </div>
    </>
  );
}
