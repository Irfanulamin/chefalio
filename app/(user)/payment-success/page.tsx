import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { OutcomePage } from "@/components/User/shared/OutcomePage";

export default function PaymentSuccessPage() {
  return (
    <>
      <title>Payment confirmed — Chefalio</title>
      <OutcomePage
        tone="success"
        icon={<CheckCircleIcon size={38} weight="fill" />}
        eyebrow="Payment confirmed"
        title="Your cookbook is ready"
        description="A receipt is on its way to your email. The cookbook is already in your orders — you don't need to wait for it."
        facts={[
          { label: "Status", value: "Paid" },
          { label: "Receipt", value: "Sent to your email" },
          { label: "Access", value: "Available now" },
        ]}
        primary={{ label: "Open my orders", href: "/activity?tab=orders" }}
        secondary={{ label: "Browse more cookbooks", href: "/cookbooks" }}
      />
    </>
  );
}
