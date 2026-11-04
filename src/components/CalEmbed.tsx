"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { isBookingConfigured, siteConfig, whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";

/** Turns https://cal.com/user/event into "user/event" and returns the origin. */
function parseCalUrl(url: string) {
  try {
    const u = new URL(url);
    return { origin: u.origin, link: u.pathname.replace(/^\/|\/$/g, "") };
  } catch {
    return { origin: "https://cal.com", link: "" };
  }
}

export function CalEmbed({ namespace, className }: { namespace: string; className?: string }) {
  const [booked, setBooked] = useState(false);
  const { origin, link } = parseCalUrl(siteConfig.booking.calUrl);
  const configured = isBookingConfigured();

  useEffect(() => {
    if (!configured) return;
    let active = true;
    (async () => {
      const cal = await getCalApi({ namespace });
      if (!active) return;
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": "#2F765A" },
          dark: { "cal-brand": "#D7F36B" },
        },
      });
      cal("on", { action: "bookingSuccessful", callback: () => setBooked(true) });
    })();
    return () => {
      active = false;
    };
  }, [namespace, configured]);

  if (!configured) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-midnight/25 bg-white/60 p-8 text-center">
        <CalendarCheck className="size-10 text-emerald" aria-hidden />
        <p className="max-w-sm text-sm text-midnight/80">
          Online booking is being set up. In the meantime, message me on WhatsApp and we&apos;ll find a time together.
        </p>
        <Button asChild variant="whatsapp">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden /> Chat on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {booked && (
        <p
          role="status"
          className="mb-3 rounded-2xl bg-emerald px-4 py-3 text-center text-sm font-semibold text-white"
        >
          You&apos;re booked! A confirmation has been emailed to you by Cal.com. See you at the board.
        </p>
      )}
      <Cal
        namespace={namespace}
        calLink={link}
        calOrigin={origin}
        style={{ width: "100%", height: "100%", minHeight: 560, overflow: "auto" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
