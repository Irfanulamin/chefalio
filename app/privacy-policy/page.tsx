import type { Metadata } from "next";
import {
  LegalItem,
  LegalLink,
  LegalList,
  LegalPage,
  type LegalSection,
} from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Chefalio collects, uses, and protects your personal information.",
};

/**
 * Wording is unchanged from the previous version — this is a legal document,
 * so the edit here is to its presentation only.
 */
const SECTIONS: LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        Welcome to Chefalio. We are committed to protecting your personal
        information and your right to privacy. This Privacy Policy explains what
        information we collect, how we use it, and what rights you have in
        relation to it. By using Chefalio, you agree to the collection and use
        of information in accordance with this policy.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    heading: "Data We Collect",
    body: (
      <>
        <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
          We collect information you provide directly to us, as well as data
          generated through your use of the platform:
        </p>
        <LegalList>
          <LegalItem>
            <strong style={{ color: "var(--cs-text-primary)" }}>
              Account information:
            </strong>{" "}
            name, email address, and password when you register.
          </LegalItem>
          <LegalItem>
            <strong style={{ color: "var(--cs-text-primary)" }}>
              Profile data:
            </strong>{" "}
            profile photo, bio, and role (user or chef).
          </LegalItem>
          <LegalItem>
            <strong style={{ color: "var(--cs-text-primary)" }}>Content:</strong>{" "}
            recipes, cookbooks, and other content you create or purchase.
          </LegalItem>
          <LegalItem>
            <strong style={{ color: "var(--cs-text-primary)" }}>
              Usage data:
            </strong>{" "}
            pages visited, interactions, search queries, and session duration.
          </LegalItem>
          <LegalItem>
            <strong style={{ color: "var(--cs-text-primary)" }}>
              Payment data:
            </strong>{" "}
            transaction identifiers processed via our payment provider (we do
            not store full card details).
          </LegalItem>
        </LegalList>
      </>
    ),
  },
  {
    id: "how-we-use-your-data",
    heading: "How We Use Your Data",
    body: (
      <LegalList>
        <LegalItem>
          To provide, operate, and maintain the Chefalio platform.
        </LegalItem>
        <LegalItem>
          To process transactions and send related information (receipts, order
          updates).
        </LegalItem>
        <LegalItem>
          To personalise your experience and surface relevant recipes and chefs.
        </LegalItem>
        <LegalItem>
          To send administrative emails (password resets, security alerts).
        </LegalItem>
        <LegalItem>
          To improve the platform through analytics and feedback.
        </LegalItem>
        <LegalItem>To comply with legal obligations.</LegalItem>
      </LegalList>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        We use cookies and similar tracking technologies to maintain your
        session, remember your preferences, and analyse platform usage. You can
        instruct your browser to refuse all cookies or to indicate when a cookie
        is being sent. However, if you do not accept cookies, some parts of
        Chefalio may not function properly.
      </p>
    ),
  },
  {
    id: "third-party-services",
    heading: "Third-Party Services",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        We may employ third-party companies and services to facilitate our
        platform, including payment processors, cloud hosting providers, and
        analytics services. These third parties have access to your personal
        data only to perform specific tasks on our behalf and are obligated not
        to disclose or use it for any other purpose.
      </p>
    ),
  },
  {
    id: "contact-us",
    heading: "Contact Us",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        If you have any questions about this Privacy Policy or how we handle
        your data, please contact us at{" "}
        <LegalLink href="mailto:privacy@chefalio.xyz">
          privacy@chefalio.xyz
        </LegalLink>
        .
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="What we collect, why we collect it, and what you can ask us to do with it."
      updated="May 2025"
      sections={SECTIONS}
    />
  );
}
