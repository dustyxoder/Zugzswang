import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InteractiveChessboard } from "@/components/InteractiveChessboard";
import { BookingSection } from "@/components/BookingSection";
import { LearningPathways } from "@/components/LearningPathways";
import { AwardsSection } from "@/components/AwardsSection";
import { AboutSection } from "@/components/AboutSection";
import { IndiaClock } from "@/components/IndiaClock";
import { FeedbackSection } from "@/components/FeedbackSection";
import { ContactSection } from "@/components/ContactSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";

export const revalidate = 300;

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: siteConfig.brand.url,
    description: siteConfig.brand.seoDescription,
  };

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <InteractiveChessboard />
        <BookingSection />
        <LearningPathways />
        <AwardsSection />
        <AboutSection />
        <IndiaClock />
        <FeedbackSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

