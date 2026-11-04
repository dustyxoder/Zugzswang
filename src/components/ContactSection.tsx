import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";

export function ContactSection() {
  return (
    <section id="contact" className="on-light relative overflow-hidden bg-ivory py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">Stay in touch</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl">Prefer to leave your details?</h2>
          <p className="mt-6 max-w-md text-lg text-midnight/80">
            Share how to reach you and what you&apos;d like to improve. I&apos;ll get back to you personally — no account,
            no spam, no pressure.
          </p>
          <Button asChild variant="whatsapp" size="lg" className="mt-8">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" aria-hidden /> Or message me on WhatsApp
            </a>
          </Button>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(16,26,36,0.4)] sm:p-9">
            <ContactForm source="website_form" idPrefix="contact" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
