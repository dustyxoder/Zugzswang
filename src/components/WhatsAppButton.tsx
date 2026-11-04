"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppButton() {
  const [hint, setHint] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {hint && (
          <motion.span
            role="tooltip"
            id="wa-tooltip"
            initial={reduce ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="pointer-events-none hidden whitespace-nowrap rounded-full bg-midnight px-4 py-2 text-sm font-semibold text-ivory shadow-xl sm:block"
          >
            Let&apos;s talk chess!
          </motion.span>
        )}
      </AnimatePresence>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp — Let's talk chess!"
        aria-describedby={hint ? "wa-tooltip" : undefined}
        title="Let's talk chess!"
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        onFocus={() => setHint(true)}
        onBlur={() => setHint(false)}
        className="group relative grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-6px_rgba(18,140,74,0.8)] transition-transform duration-200 hover:scale-110 hover:-rotate-6 active:scale-95 sm:size-16"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-whatsapp/60" aria-hidden />
        <WhatsAppIcon className="relative size-8 sm:size-9" />
      </a>
    </div>
  );
}
