import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service governing your use of the Chefalio platform.",
};

export default function TermsOfServicePage() {
  return (
    <div
      style={{
        backgroundColor: "var(--cs-surface-1)",
        color: "var(--cs-text-primary)",
      }}
    >
      <Header />
      <main className="container max-w-3xl mx-auto px-4 py-16">
        <h1
          className="text-4xl font-extrabold tracking-tight mb-2"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Terms of Service
        </h1>
        <p
          className="text-sm mb-10"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          Last updated: May 2025
        </p>

        <section className="space-y-10">
          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Acceptance of Terms
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              By accessing or using Chefalio, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any part of these terms, you may not use our
              platform. We reserve the right to update these terms at any time,
              and your continued use of Chefalio constitutes acceptance of those
              changes.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Use of the Service
            </h2>
            <p className="mb-3" style={{ color: "var(--cs-text-secondary)" }}>
              You agree to use Chefalio only for lawful purposes and in a manner
              that does not infringe the rights of others. You must not:
            </p>
            <ul
              className="list-disc list-inside space-y-2"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              <li>
                Use the platform to transmit spam, malicious code, or harmful
                content.
              </li>
              <li>
                Attempt to gain unauthorised access to any part of the platform
                or its systems.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation with a person or entity.
              </li>
              <li>
                Scrape, crawl, or otherwise extract data from the platform
                without our written consent.
              </li>
              <li>
                Use the platform in any way that could damage, disable, or
                overburden our infrastructure.
              </li>
            </ul>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              User Content
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              You retain ownership of any content you submit to Chefalio
              (recipes, cookbooks, images). By posting content, you grant
              Chefalio a non-exclusive, royalty-free, worldwide licence to
              display, reproduce, and distribute that content in connection with
              the platform. You are solely responsible for ensuring your content
              does not violate any third-party rights, including copyright,
              trademark, or privacy rights.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Intellectual Property
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              The Chefalio name, logo, design, and all platform-level content
              created by Chefalio (excluding user-submitted content) are the
              exclusive property of Chefalio and are protected by applicable
              intellectual property laws. You may not reproduce, distribute, or
              create derivative works from platform content without our express
              written permission.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Disclaimer
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              Chefalio is provided on an "as is" and "as available" basis
              without warranties of any kind, either express or implied,
              including but not limited to warranties of merchantability,
              fitness for a particular purpose, or non-infringement. We do not
              warrant that the platform will be uninterrupted, error-free, or
              free of viruses or other harmful components. Your use of the
              platform is at your sole risk.
            </p>
          </div>

          <div>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Governing Law
            </h2>
            <p style={{ color: "var(--cs-text-secondary)" }}>
              These Terms of Service shall be governed by and construed in
              accordance with applicable laws, without regard to conflict of law
              provisions. Any disputes arising under these terms shall be
              subject to the exclusive jurisdiction of the competent courts. If
              you have any questions regarding these terms, please contact us at{" "}
              <a
                href="mailto:legal@chefalio.xyz"
                className="underline"
                style={{ color: "var(--cs-accent)" }}
              >
                legal@chefalio.xyz
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
