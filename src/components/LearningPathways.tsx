"use client";

import { motion, useReducedMotion } from "motion/react";
import { CalendarCheck, ChessBishop, ChessKnight, ChessPawn, ChessQueen, Check } from "lucide-react";
import { siteConfig, type Pathway } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { useBooking } from "@/components/BookingProvider";

const icons: Record<Pathway["id"], typeof ChessPawn> = {
  fundamentals: ChessPawn,
  tactics: ChessKnight,
  positional: ChessBishop,
  analysis: ChessQueen,
};

const accents: Record<Pathway["id"], string> = {
  fundamentals: "bg-sage text-emerald",
  tactics: "bg-lime text-midnight",
  positional: "bg-gold/30 text-[#7a5f2c]",
  analysis: "bg-emerald text-ivory",
};

export function LearningPathways() {
  const { openBooking } = useBooking();
  const reduce = useReducedMotion();

  return (
    <section id="pathways" className="on-light relative overflow-hidden bg-ivory py-24 sm:py-32">
      <ChessPawn aria-hidden strokeWidth={0.5} className="absolute -right-16 top-10 size-[26rem] text-midnight/[0.04]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">What we can work on</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">Four pathways. One goal: better chess.</h2>
          <p className="mt-5 text-lg text-midnight/75">
            No giant course catalogue. Just personal coaching shaped around the part of your game that needs attention most.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {siteConfig.pathways.map((p, i) => {
            const Icon = icons[p.id];
            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <motion.article
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative h-full overflow-hidden rounded-[2rem] border border-midnight/10 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(16,26,36,0.35)] transition-shadow hover:shadow-[0_30px_60px_-25px_rgba(47,118,90,0.5)] sm:p-9"
                >
                  <span className="absolute right-6 top-4 font-heading text-7xl font-bold text-midnight/[0.05]" aria-hidden>
                    0{i + 1}
                  </span>
                  <span className={`grid size-16 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${accents[p.id]}`}>
                    <Icon className="size-8" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-midnight/75">{p.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.topics.map((t) => (
                      <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-sm font-medium ring-1 ring-midnight/10">
                        <Check className="size-3.5 text-emerald" aria-hidden /> {t}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-5 rounded-[2rem] bg-midnight px-6 py-10 text-center text-ivory sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <p className="font-heading text-2xl font-bold sm:text-3xl">Not sure what you need? Let&apos;s figure it out together.</p>
          <Button variant="primary" size="lg" onClick={openBooking} className="shrink-0">
            <CalendarCheck className="size-5" aria-hidden /> Book a Free Call
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
