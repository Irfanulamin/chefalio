import { XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { OutcomePage } from "@/components/User/shared/OutcomePage";

export default function PaymentCancelPage() {
  return (
    <>
      <title>Checkout cancelled — Chefalio</title>
      <OutcomePage
        tone="warning"
        icon={<XCircleIcon size={38} weight="fill" />}
        eyebrow="Checkout cancelled"
        title="Nothing was charged"
        description="You backed out before paying, so your card was never touched. The cookbook is still there whenever you want it."
        facts={[
          { label: "Status", value: "Cancelled" },
          { label: "Charge", value: "None" },
          { label: "Cookbook", value: "Still available" },
        ]}
        primary={{ label: "Back to cookbooks", href: "/cookbooks" }}
        secondary={{ label: "Browse recipes instead", href: "/recipes" }}
      />
    </>
  );
}
