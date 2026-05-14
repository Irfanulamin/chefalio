"use client";

import { useCookbook, usePaymentCookbook } from "@/hooks/useCookbook";
import { SummaryCard } from "@/app/(user)/purchase-cookbook/[id]/_components/SummaryCard";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z, { email } from "zod";
import { CreditCardIcon } from "@phosphor-icons/react/dist/ssr";
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

export default function ChefExplorePurchaseCookbookPage({
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
          err instanceof Error ? err.message : "Payment failed. Please try again.",
          { position: "bottom-right" },
        );
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-between gap-6 py-5">
        <div className="flex-1 w-full lg:max-w-2xl space-y-5">
          <div className="space-y-1">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-11 w-full lg:w-32 rounded-lg ml-auto" />
        </div>
        <div className="w-full flex-1 lg:shrink-0">
          <div className="rounded-2xl border border-border/40 overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-24 mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cookbook) {
    return (
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <p className="text-base font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground mt-1">Unable to load this cookbook.</p>
        </div>
      </div>
    );
  }

  const fieldDefinitions = [
    { name: "email", label: "Email", placeholder: "Enter your email", type: "text" },
    { name: "name", label: "Name", placeholder: "Enter your name", type: "text" },
    { name: "address", label: "Address", placeholder: "Enter your address", type: "textarea" },
    { name: "city", label: "City", placeholder: "Enter your city", type: "text" },
    { name: "state", label: "State", placeholder: "Enter your state", type: "text" },
    { name: "postalCode", label: "Postal Code", placeholder: "Enter your postal code", type: "text" },
    { name: "country", label: "Country", placeholder: "Enter your country", type: "text" },
  ];

  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center lg:justify-between gap-6 py-5">
      <form
        className="flex-1 w-full lg:max-w-2xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Checkout <CreditCardIcon className="h-6 w-6 text-primary" weight="fill" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Please fill in your details to complete the purchase.
          </p>
        </div>

        <FieldGroup>
          {fieldDefinitions.map((fieldDef) => (
            <FormField key={fieldDef.name} form={form} {...fieldDef} />
          ))}
        </FieldGroup>

        <div className="flex justify-end">
          <Button type="submit" className="w-full lg:w-auto rounded-lg py-5" disabled={isPaying}>
            {isPaying ? "Paying..." : "Pay Now"}
          </Button>
        </div>
      </form>

      <div className="w-full flex-1 lg:shrink-0 mx-auto lg:mx-0">
        <SummaryCard cookbook={cookbook} />
      </div>
    </div>
  );
}
