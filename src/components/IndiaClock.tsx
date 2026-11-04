"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getTimes } from "suncalc";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const { timezone, label, offsetLabel, coordinates, fallbackSunrise, fallbackSunset } = siteConfig.time;

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: timezone,
  weekday: "long",
  day: "numeric",
  month: "long",
});

interface IndiaNow {
  h: string;
  m: string;
  s: string;
  hourNumber: number;
  minutesOfDay: number;
  dateLabel: string;
  isDay: boolean;
}

/** Reads the current time in India — never the visitor's local timezone. */
function readIndiaNow(now: Date): IndiaNow {
  const parts = Object.fromEntries(clockFormat.formatToParts(now).map((p) => [p.type, p.value]));
  const h = parts.hour ?? "00";
  const m = parts.minute ?? "00";
  const s = parts.second ?? "00";
  const hourNumber = Number(h);
  const minutesOfDay = hourNumber * 60 + Number(m);

  let isDay = hourNumber >= fallbackSunrise && hourNumber < fallbackSunset;
  if (coordinates) {
    // IST has a fixed +05:30 offset (no daylight saving), so pass 330 minutes.
    const times = getTimes(now, coordinates.latitude, coordinates.longitude, 0, 330);
    if (times.sunrise && times.sunset) {
      isDay = now >= times.sunrise && now < times.sunset;
    }
  }
  return { h, m, s, hourNumber, minutesOfDay, dateLabel: dateFormat.format(now), isDay };
}

/* ----------------------------- Flip digits ----------------------------- */

function FlipDigit({ value, dark }: { value: string; dark: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "flip-card relative h-[4.25rem] w-[2.9rem] overflow-hidden rounded-xl font-heading text-[2.9rem] font-bold leading-none shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)] ring-1 sm:h-28 sm:w-20 sm:rounded-2xl sm:text-7xl md:h-36 md:w-24 md:text-8xl lg:h-44 lg:w-32 lg:text-9xl",
        dark ? "bg-[#1b2a37] text-ivory ring-white/10" : "bg-midnight text-ivory ring-black/20",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" aria-hidden />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={reduce ? false : { rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={reduce ? undefined : { rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50% 50%" }}
          className="absolute inset-0 grid place-items-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Colon({ light }: { light: boolean }) {
  return (
    <div className="flex flex-col gap-2.5 px-0.5 sm:gap-4 sm:px-1" aria-hidden>
      <span className={cn("size-1.5 rounded-full sm:size-3", light ? "bg-midnight/70" : "bg-lime")} />
      <span className={cn("size-1.5 rounded-full sm:size-3", light ? "bg-midnight/70" : "bg-lime")} />
    </div>
  );
}

/* ------------------------------- Scenes -------------------------------- */

const stars = [
  [8, 14, 3], [18, 38, 2], [27, 10, 2.5], [36, 26, 2], [47, 8, 3], [58, 30, 2], [66, 14, 2.5],
  [74, 40, 2], [84, 12, 3], [92, 28, 2], [12, 60, 2], [40, 52, 2], [88, 56, 2.5], [60, 62, 2],
] as const;

function DayScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff2c9] via-[#f7f4ec] to-[#f7f4ec]" />
      {/* Sun */}
      <div className="absolute right-[8%] top-[8%]">
        <div className="relative size-28 sm:size-44">
          <svg viewBox="0 0 200 200" className="animate-sun-spin absolute inset-0 size-full">
            {Array.from({ length: 16 }, (_, i) => (
              <rect key={i} x="96" y="2" width="8" height={i % 2 ? 22 : 34} rx="4" fill="#E6B54A" opacity={i % 2 ? 0.6 : 0.9} transform={`rotate(${i * 22.5} 100 100)`} />
            ))}
          </svg>
          <div className="absolute inset-[22%] rounded-full bg-gradient-to-br from-[#ffe58a] to-[#f2b134] shadow-[0_0_80px_20px_rgba(246,189,58,0.55)]" />
        </div>
      </div>
      {/* Clouds */}
      {[
        { top: "14%", w: 150, d: "0s", o: 0.95 },
        { top: "42%", w: 110, d: "-14s", o: 0.8 },
        { top: "66%", w: 190, d: "-26s", o: 0.7 },
      ].map((c, i) => (
        <div key={i} className="animate-cloud absolute" style={{ top: c.top, animationDelay: c.d, opacity: c.o }}>
          <svg width={c.w} viewBox="0 0 120 50"><path d="M25 44a16 16 0 0 1 2-32 22 22 0 0 1 42-4 19 19 0 0 1 24 18 13 13 0 0 1 2 18z" fill="#fff" /></svg>
        </div>
      ))}
    </div>
  );
}

function Owl() {
  return (
    <svg viewBox="0 0 220 190" className="w-full" role="img" aria-label="A sleepy owl resting on a branch">
      {/* branch */}
      <path d="M2 150 Q70 138 130 148 T218 140" stroke="#5b4636" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M170 143 q18 -16 36 -10" stroke="#5b4636" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="207" cy="130" rx="9" ry="5" transform="rotate(-30 207 130)" fill="#3f8f6a" />
      <ellipse cx="190" cy="152" rx="8" ry="4.500" transform="rotate(25 190 152)" fill="#2F765A" />
      {/* body */}
      <g className="origin-bottom animate-breathe" style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <ellipse cx="102" cy="108" rx="46" ry="46" fill="#a98b6c" />
        <ellipse cx="102" cy="118" rx="29" ry="30" fill="#e9dcc6" />
        {/* chest feathers */}
        <path d="M90 108q4 5 8 0M106 108q4 5 8 0M98 124q4 5 8 0M82 122q4 5 8 0M114 122q4 5 8 0" stroke="#c4ad8a" strokeWidth="2.500" fill="none" strokeLinecap="round" />
        {/* wings */}
        <path d="M58 92q-12 28 12 52 6-24 4-48z" fill="#8c7050" />
        <path d="M146 92q12 28-12 52-6-24-4-48z" fill="#8c7050" />
        {/* head */}
        <ellipse cx="102" cy="64" rx="38" ry="33" fill="#b89a79" />
        <path d="M70 44l-6-18 20 10zM134 44l6-18-20 10z" fill="#a98b6c" />
        {/* face disc */}
        <ellipse cx="86" cy="66" rx="16" ry="15" fill="#f2e8d5" />
        <ellipse cx="118" cy="66" rx="16" ry="15" fill="#f2e8d5" />
        {/* sleeping eyes */}
        <path d="M76 66q10 8 20 0M108 66q10 8 20 0" stroke="#3a2c20" strokeWidth="3.500" fill="none" strokeLinecap="round" />
        {/* cheeks */}
        <ellipse cx="72" cy="76" rx="5" ry="3" fill="#e9a58f" opacity=".7" />
        <ellipse cx="132" cy="76" rx="5" ry="3" fill="#e9a58f" opacity=".7" />
        {/* beak */}
        <path d="M97 72h10l-5 11z" fill="#e2a23b" />
        {/* feet */}
        <path d="M84 150v-6M92 150v-6M112 150v-6M120 150v-6" stroke="#e2a23b" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function NightScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#070d14] via-[#101a24] to-[#17232d]" />
      {stars.map(([x, y, s], i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-ivory"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${(i % 7) * 0.45}s` }}
        />
      ))}
      {/* Crescent moon */}
      <div className="absolute right-[9%] top-[8%]">
        <svg viewBox="0 0 120 120" className="size-24 drop-shadow-[0_0_30px_rgba(247,244,236,0.55)] sm:size-36">
          <defs>
            <mask id="crescent">
              <rect width="120" height="120" fill="#fff" />
              <circle cx="78" cy="46" r="44" fill="#000" />
            </mask>
          </defs>
          <circle cx="52" cy="62" r="46" fill="#F7F4EC" mask="url(#crescent)" />
        </svg>
      </div>
      {/* Owl + Zzz */}
      <div className="absolute bottom-0 left-[4%] w-40 sm:left-[8%] sm:w-60">
        <div className="relative">
          <Owl />
          <span className="animate-zzz absolute left-[62%] top-[14%] font-heading text-xl font-bold text-lime sm:text-3xl">z</span>
          <span className="animate-zzz absolute left-[70%] top-[6%] font-heading text-base font-bold text-lime/80 [animation-delay:1.1s] sm:text-2xl">Z</span>
          <span className="animate-zzz absolute left-[78%] top-[-4%] font-heading text-sm font-bold text-lime/60 [animation-delay:2.2s] sm:text-xl">z</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Section ------------------------------- */

export function IndiaClock() {
  const [now, setNow] = useState<IndiaNow | null>(null);

  useEffect(() => {
    const tick = () => setNow(readIndiaNow(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const isDay = now?.isDay ?? true;
  const digits = useMemo(() => (now ? [...now.h, ...now.m, ...now.s] : Array.from({ length: 6 }, () => "–")), [now]);
  const spoken = now ? `${now.h}:${now.m}:${now.s}` : "loading";

  return (
    <section
      id="india-time"
      className={cn("relative isolate overflow-hidden py-24 transition-colors duration-1000 sm:py-32", isDay ? "on-light text-midnight" : "text-ivory")}
    >
      <div className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", isDay ? "opacity-100" : "opacity-0")}>
        <DayScene />
      </div>
      <div className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", isDay ? "opacity-0" : "opacity-100")}>
        <NightScene />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
            While You&apos;re Here, Here&apos;s the Time in India.
          </h2>
          <p className={cn("mt-8 text-sm font-bold uppercase tracking-[0.3em]", isDay ? "text-emerald" : "text-lime")}>{label}</p>
          <p className={cn("mt-1 font-heading text-lg font-semibold", isDay ? "text-midnight/70" : "text-ivory/70")}>{offsetLabel}</p>
        </Reveal>

        <div className="mt-10 flex flex-col items-center gap-6">
          {/* Accessible, non-animated time for assistive tech (updates are not announced every second) */}
          <p className="sr-only">Current time in India: {spoken}</p>
          <div className="flex items-center justify-center gap-1.5 sm:gap-3" aria-hidden>
            <FlipDigit value={digits[0]} dark={!isDay} />
            <FlipDigit value={digits[1]} dark={!isDay} />
            <Colon light={isDay} />
            <FlipDigit value={digits[2]} dark={!isDay} />
            <FlipDigit value={digits[3]} dark={!isDay} />
            <Colon light={isDay} />
            <FlipDigit value={digits[4]} dark={!isDay} />
            <FlipDigit value={digits[5]} dark={!isDay} />
          </div>
          <div className="flex h-5 items-center justify-center gap-6 text-xs font-bold uppercase tracking-[0.3em] opacity-60" aria-hidden>
            <span>Hours</span><span>Minutes</span><span>Seconds</span>
          </div>

          <div className={cn("mt-2 inline-flex items-center gap-3 rounded-full px-6 py-3 font-heading text-lg font-semibold", isDay ? "bg-white/80 shadow-lg" : "glass")} role="status">
            <span aria-hidden className="text-2xl">{isDay ? "☀" : "☾"}</span>
            {now ? (isDay ? "It's daytime in India." : "It's nighttime in India.") : "Checking the time in India…"}
          </div>
          {now && <p className={cn("text-sm", isDay ? "text-midnight/70" : "text-ivory/70")}>{now.dateLabel}</p>}
        </div>

        <p className={cn("mx-auto mt-10 max-w-xl text-sm", isDay ? "text-midnight/70" : "text-ivory/70")}>
          Time shown is based on my location in India. Scheduling times will automatically adjust to your timezone.
        </p>
      </div>
    </section>
  );
}
