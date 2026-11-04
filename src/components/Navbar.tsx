"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/BookingProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();
  const reduce = useReducedMotion();

  // Active-section indicator
  useEffect(() => {
    const els = siteConfig.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto relative w-full max-w-5xl rounded-[2rem] border border-white/15 bg-midnight/90 px-3 py-2 text-ivory backdrop-blur-xl transition-shadow duration-300",
          scrolled ? "shadow-[0_18px_50px_-18px_rgba(0,0,0,0.7)]" : "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)]",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <a href="#home" className="rounded-full py-1 pl-1 pr-2" aria-label="ZUGZWANG — back to top">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {siteConfig.nav.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors",
                      isActive ? "text-midnight" : "text-ivory/80 hover:bg-white/10 hover:text-ivory",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-lime"
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" className="hidden px-5 sm:inline-flex" onClick={openBooking}>
              <CalendarCheck className="size-4" aria-hidden /> Book a FREE Call
            </Button>
            <Button variant="primary" size="sm" className="px-4 sm:hidden" onClick={openBooking}>
              Book FREE
            </Button>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 cursor-pointer place-items-center rounded-full bg-white/10 transition hover:bg-white/20 lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <ul className="grid gap-1 pb-2 pt-3">
                {siteConfig.nav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        // Closing the menu unmounts the focused link, which cancels the browser's
                        // smooth anchor scroll on mobile — so scroll explicitly after closing.
                        e.preventDefault();
                        setOpen(false);
                        const target = document.getElementById(item.id);
                        window.setTimeout(() => {
                          target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                          window.history.replaceState(null, "", item.href);
                        }, reduce ? 0 : 350);
                      }}
                      aria-current={active === item.id ? "location" : undefined}
                      className={cn(
                        "flex h-12 items-center rounded-full px-5 font-medium transition-colors",
                        active === item.id ? "bg-lime text-midnight" : "hover:bg-white/10",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
