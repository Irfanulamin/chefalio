import type { Metadata } from "next";
import {
  LegalItem,
  LegalLink,
  LegalList,
  LegalPage,
  type LegalSection,
} from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service governing your use of the Chefalio platform.",
};

/**
 * Wording is unchanged from the previous version — this is a legal document,
 * so the edit here is to its presentation only.
 */
const SECTIONS: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    heading: "Acceptance of Terms",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        By accessing or using Chefalio, you agree to be bound by these Terms of
        Service and all applicable laws and regulations. If you do not agree
        with any part of these terms, you may not use our platform. We reserve
        the right to update these terms at any time, and your continued use of
        Chefalio constitutes acceptance of those changes.
      </p>
    ),
  },
  {
    id: "use-of-the-service",
    heading: "Use of the Service",
    body: (
      <>
        <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
          You agree to use Chefalio only for lawful purposes and in a manner
          that does not infringe the rights of others. You must not:
        </p>
        <LegalList>
          <LegalItem>
            Use the platform to transmit spam, malicious code, or harmful
            content.
          </LegalItem>
          <LegalItem>
            Attempt to gain unauthorised access to any part of the platform or
            its systems.
          </LegalItem>
          <LegalItem>
            Impersonate any person or entity or misrepresent your affiliation
            with a person or entity.
          </LegalItem>
          <LegalItem>
            Scrape, crawl, or otherwise extract data from the platform without
            our written consent.
          </LegalItem>
          <LegalItem>
            Use the platform in any way that could damage, disable, or
            overburden our infrastructure.
          </LegalItem>
        </LegalList>
      </>
    ),
  },
  {
    id: "user-content",
    heading: "User Content",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        You retain ownership of any content you submit to Chefalio (recipes,
        cookbooks, images). By posting content, you grant Chefalio a
        non-exclusive, royalty-free, worldwide licence to display, reproduce,
        and distribute that content in connection with the platform. You are
        solely responsible for ensuring your content does not violate any
        third-party rights, including copyright, trademark, or privacy rights.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        The Chefalio name, logo, design, and all platform-level content created
        by Chefalio (excluding user-submitted content) are the exclusive
        property of Chefalio and are protected by applicable intellectual
        property laws. You may not reproduce, distribute, or create derivative
        works from platform content without our express written permission.
      </p>
    ),
  },
  {
    id: "disclaimer",
    heading: "Disclaimer",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        Chefalio is provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis without warranties of any kind, either express or
        implied, including but not limited to warranties of merchantability,
        fitness for a particular purpose, or non-infringement. We do not warrant
        that the platform will be uninterrupted, error-free, or free of viruses
        or other harmful components. Your use of the platform is at your sole
        risk.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing Law",
    body: (
      <p className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        These Terms of Service shall be governed by and construed in accordance
        with applicable laws, without regard to conflict of law provisions. Any
        disputes arising under these terms shall be subject to the exclusive
        jurisdiction of the competent courts. If you have any questions
        regarding these terms, please contact us at{" "}
        <LegalLink href="mailto:legal@chefalio.xyz">
          legal@chefalio.xyz
        </LegalLink>
        .
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="The rules for using Chefalio — what you can do, what you keep, and what we don't promise."
      updated="May 2025"
      sections={SECTIONS}
    />
  );
}
