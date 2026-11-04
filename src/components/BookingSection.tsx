"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Clock, Globe2, MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";
import { CalEmbed } from "@/components/CalEmbed";
import { Reveal } from "@/components/Reveal";

export function BookingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Lazy-load the heavy booking iframe only when the section approaches the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="book" className="relative overflow-hidden bg-sage/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">Free introductory call</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
            Let&apos;s Talk Chess. Completely Free.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-midnight/80">
            Tell me where you are in your chess journey, what you&apos;re struggling with and what you want to
            achieve. We can figure out the next steps together.
          </p>
          <ul className="mt-8 space-y-4 text-[15px] font-medium">
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-emerald text-white">
                <Clock className="size-5" aria-hidden />
              </span>
              {siteConfig.booking.callDurationMinutes} minutes · no commitment
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-emerald text-white">
                <Globe2 className="size-5" aria-hidden />
              </span>
              Slots appear in your own timezone
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-emerald text-white">
                <CalendarCheck className="size-5" aria-hidden />
              </span>
              Instant confirmation by email
            </li>
          </ul>
          <div className="mt-10 rounded-3xl bg-midnight p-6 text-ivory">
            <p className="font-heading text-lg font-semibold">Prefer to chat first?</p>
            <p className="mt-1 text-sm text-ivory/75">Continue the conversation on WhatsApp if booking is inconvenient.</p>
            <Button asChild variant="whatsapp" className="mt-4">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-5" aria-hidden /> Continue on WhatsApp
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={ref} className="min-h-[600px] rounded-[2rem] bg-white p-3 shadow-[0_30px_80px_-30px_rgba(16,26,36,0.4)] sm:p-4">
            {visible ? (
              <CalEmbed namespace="zugzwang-inline" />
            ) : (
              <div className="grid h-[560px] place-items-center text-sm text-midnight/60">Loading calendar…</div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
