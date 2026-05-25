import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Chefalio collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: "var(--cs-surface-1)", color: "var(--cs-text-primary)" }}>
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-16">
        <h1
          className="text-4xl font-extrabold tracking-tight mb-2"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--cs-text-tertiary)" }}>
          Last updated: May 2025
        </p>

        <section className="space-y-10">
          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Introduction
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              Welcome to Chefalio. We are committed to protecting your personal information and
              your right to privacy. This Privacy Policy explains what information we collect,
              how we use it, and what rights you have in relation to it. By using Chefalio, you
              agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Data We Collect
            </h2>
            <p className="mb-3" style={{ color: "var(--cs-text-secondary)" }}>
              We collect information you provide directly to us, as well as data generated
              through your use of the platform:
            </p>
            <ul className="list-disc list-inside space-y-2" style={{ color: "var(--cs-text-secondary)" }}>
              <li><strong>Account information:</strong> name, email address, and password when you register.</li>
              <li><strong>Profile data:</strong> profile photo, bio, and role (user or chef).</li>
              <li><strong>Content:</strong> recipes, cookbooks, and other content you create or purchase.</li>
              <li><strong>Usage data:</strong> pages visited, interactions, search queries, and session duration.</li>
              <li><strong>Payment data:</strong> transaction identifiers processed via our payment provider (we do not store full card details).</li>
            </ul>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-2" style={{ color: "var(--cs-text-secondary)" }}>
              <li>To provide, operate, and maintain the Chefalio platform.</li>
              <li>To process transactions and send related information (receipts, order updates).</li>
              <li>To personalise your experience and surface relevant recipes and chefs.</li>
              <li>To send administrative emails (password resets, security alerts).</li>
              <li>To improve the platform through analytics and feedback.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Cookies
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              We use cookies and similar tracking technologies to maintain your session, remember
              your preferences, and analyse platform usage. You can instruct your browser to
              refuse all cookies or to indicate when a cookie is being sent. However, if you do
              not accept cookies, some parts of Chefalio may not function properly.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Third-Party Services
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              We may employ third-party companies and services to facilitate our platform,
              including payment processors, cloud hosting providers, and analytics services.
              These third parties have access to your personal data only to perform specific
              tasks on our behalf and are obligated not to disclose or use it for any other
              purpose.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Contact Us
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              If you have any questions about this Privacy Policy or how we handle your data,
              please contact us at{" "}
              <a
                href="mailto:privacy@chefalio.com"
                className="underline"
                style={{ color: "var(--cs-accent)" }}
              >
                privacy@chefalio.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
