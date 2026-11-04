import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Zugzwang collects, uses and protects the information you share.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="1 January 2026">
      <p>
        This policy explains what information {siteConfig.brand.name} collects when you use this website and how it is
        used. It is a plain-language template; please have it reviewed to make sure it fits your local legal requirements.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Enquiry details</strong> you choose to submit: your name, email, WhatsApp number, chess or social handle, chess level and what you want to improve.</li>
        <li><strong>Feedback</strong> you submit, plus your optional name and chess experience.</li>
        <li><strong>Bookings</strong> made through Cal.com are handled by Cal.com under its own privacy policy.</li>
        <li><strong>WhatsApp</strong> chats happen on WhatsApp, governed by its terms and privacy policy.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        Your details are used only to respond to your enquiry and to arrange or run a coaching conversation. We do not
        sell your information or use it for unrelated marketing.
      </p>
      <h2>Feedback &amp; testimonials</h2>
      <p>
        Feedback is never published automatically. It is shown publicly only if you tick the permission box and it is
        manually approved.
      </p>
      <h2>Storage &amp; security</h2>
      <p>
        Submissions are stored in a protected database. Access is restricted to the website owner and personal
        information is never exposed to other visitors.
      </p>
      <h2>The interactive chessboard</h2>
      <p>The move you make on the board is processed in your browser. It is not stored unless you choose to contact us afterwards.</p>
      <h2>Your rights</h2>
      <p>You can ask to see, correct or delete your information at any time by messaging us on WhatsApp ({siteConfig.contact.whatsappDisplay}).</p>
    </LegalPage>
  );
}
