"use client";

import { defaultPieces } from "react-chessboard";
import { motion, useReducedMotion } from "motion/react";
import { CalendarCheck, ChessKnight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/BookingProvider";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

function Piece({ code, className, style }: { code: string; className?: string; style?: React.CSSProperties }) {
  const Render = defaultPieces[code];
  return (
    <div className={className} style={style} aria-hidden>
      {Render({ svgStyle: { width: "100%", height: "100%", filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.45))" } })}
    </div>
  );
}

export function Hero() {
  const { openBooking } = useBooking();
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative isolate overflow-hidden bg-midnight pb-20 pt-32 text-ivory sm:pt-40 lg:pb-28">
      {/* Backdrop */}
      <div className="bg-grid-lines absolute inset-0 -z-10 opacity-80" aria-hidden />
      <div className="absolute -right-40 top-10 -z-10 h-[40rem] w-[40rem] rounded-full bg-emerald/30 blur-[130px]" aria-hidden />
      <div className="absolute -left-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" aria-hidden />
      <ChessKnight
        aria-hidden
        strokeWidth={0.6}
        className="absolute -left-24 bottom-[-6rem] -z-10 size-[28rem] text-white/[0.04] sm:size-[40rem]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-lime"
          >
            Your next move starts here
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="mt-6 text-[clamp(2.8rem,8.5vw,6rem)] font-bold leading-[0.98]"
          >
            Think deeper.
            <br />
            Play smarter.
            <br />
            <span className="text-lime">Enjoy every move.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/80"
          >
            Whether you&apos;re just discovering chess or trying to take your game to the next level, let&apos;s work on your
            strategy, understand your mistakes and make you a more confident player.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild variant="primary" size="lg">
              <a href="#challenge">
                <Play className="size-5 fill-current" aria-hidden /> Try the Chessboard
              </a>
            </Button>
            <Button variant="glass" size="lg" onClick={openBooking}>
              <CalendarCheck className="size-5" aria-hidden /> Book a FREE Intro Call
            </Button>
          </motion.div>

          <p className="mt-6 text-sm font-medium text-ivory/70">
            100% Free Introductory Call · No Commitment · Just Chess
          </p>
        </div>

        {/* RIGHT — composition */}
        <div className="relative mx-auto w-full max-w-[34rem]" aria-hidden>
          <div className="relative aspect-square [perspective:1400px]">
            {/* Tilted 3D board */}
            <motion.div
              initial={reduce ? false : { opacity: 0, rotateX: 70, rotateZ: -20 }}
              animate={{ opacity: 1, rotateX: 52, rotateZ: -28 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-[6%] [transform-style:preserve-3d]"
            >
              <div className="grid size-full grid-cols-8 overflow-hidden rounded-2xl shadow-[0_60px_80px_-20px_rgba(0,0,0,0.7)] ring-8 ring-charcoal">
                {Array.from({ length: 64 }, (_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  return <div key={i} className={(r + c) % 2 === 0 ? "bg-[#F2ECD9]" : "bg-[#4E8A6A]"} data-file={files[c]} />;
                })}
              </div>
              {/* Pieces standing on the board */}
              <Piece code="wP" className="absolute left-[25%] top-[62%] size-[12.5%] [transform:translateZ(1px)]" />
              <Piece code="wP" className="absolute left-[50%] top-[62%] size-[12.5%]" />
              <Piece code="bP" className="absolute left-[37.5%] top-[25%] size-[12.5%]" />
            </motion.div>

            {/* Emerald glow under the piece */}
            <div className="absolute left-1/2 top-[30%] h-48 w-48 -translate-x-1/2 rounded-full bg-lime/25 blur-[70px]" />

            {/* Floating queen / knight */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="absolute left-[24%] top-[-2%] w-[44%]"
            >
              <Piece code="wN" className="animate-float aspect-square w-full" />
            </motion.div>
            <Piece code="bQ" className="animate-float-slow absolute -right-2 top-[16%] size-[22%] opacity-95 [--r:8deg]" />
            <Piece code="wR" className="animate-float absolute bottom-[8%] left-[2%] size-[18%] [--r:-8deg]" />

            {/* Little animated chess-related elements */}
            <div className="glass animate-float-slow absolute bottom-[14%] right-[4%] rounded-2xl px-4 py-2.5 font-heading text-sm font-bold text-lime">
              1. e4 <span className="text-ivory/60">e5</span>
            </div>
            <div className="glass animate-float absolute left-0 top-[34%] rounded-full px-3 py-1.5 font-heading text-xs font-semibold tracking-widest text-ivory/80 [--r:-4deg]">
              Qh5+
            </div>
            <span className="animate-twinkle absolute right-[30%] top-[4%] text-2xl text-gold">✦</span>
            <span className="animate-twinkle absolute bottom-[4%] left-[40%] text-lg text-lime [animation-delay:1.2s]">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
