import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using the Zugzwang website and booking a free introductory chess call.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="1 January 2026">
      <p>
        By using the {siteConfig.brand.name} website you agree to these terms. This is a plain-language template; please
        have it reviewed to make sure it fits your local legal requirements.
      </p>
      <h2>The free introductory call</h2>
      <p>
        The introductory call is free, has no obligation and is intended to discuss your chess goals. Availability depends
        on the calendar and may change.
      </p>
      <h2>Coaching</h2>
      <p>Any paid coaching will be agreed separately and in advance. Chess improvement depends on practice and no specific result is guaranteed.</p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Please provide accurate information and do not submit spam or abusive content.</li>
        <li>Automated submissions and attempts to disrupt the site are not permitted.</li>
      </ul>
      <h2>Third-party services</h2>
      <p>Bookings (Cal.com), messaging (WhatsApp) and donations (Buy Me a Coffee) are provided by third parties under their own terms.</p>
      <h2>Changes</h2>
      <p>These terms may be updated from time to time. Continued use of the site means you accept the updated terms.</p>
    </LegalPage>
  );
}
