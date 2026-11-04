"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Loader2, MessageSquareHeart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import { Reveal } from "@/components/Reveal";
import { CHESS_EXPERIENCE } from "@/lib/validation";

const experienceLabels = {
  new: "Brand new to chess",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export function FeedbackSection() {
  const reduce = useReducedMotion();
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = (k: string) => String(data.get(k) ?? "").trim();

    setStatus("sending");
    setErrors({});
    setServerError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: text("name"),
          message: text("message"),
          chess_experience: text("chess_experience") || undefined,
          allow_public: data.get("allow_public") === "on",
          company_website: text("company_website"),
          elapsed_ms: Date.now() - openedAt.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok) {
        setErrors(json.fieldErrors ?? {});
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      form.reset();
      setStatus("done");
    } catch {
      setServerError("Network problem. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  return (
    <section id="feedback" className="on-light relative overflow-hidden bg-sage/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">Feedback</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">Your Thoughts Make the Next Move Better.</h2>
          <p className="mt-6 max-w-md text-lg text-midnight/80">
            Tried the board? Had a call? Tell me what worked and what could be better. Every message is read personally.
          </p>
          <p className="mt-4 max-w-md text-sm text-midnight/70">
            Feedback is only ever shown publicly if you give permission <em>and</em> I approve it manually. No fabricated
            reviews, ever.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(16,26,36,0.4)] sm:p-9">
            <AnimatePresence mode="wait" initial={false}>
              {status === "done" ? (
                <motion.div
                  key="done"
                  role="status"
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <motion.div
                    initial={reduce ? false : { scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                    className="mx-auto grid size-20 place-items-center rounded-full bg-lime text-midnight"
                  >
                    <MessageSquareHeart className="size-10" aria-hidden />
                  </motion.div>
                  <h3 className="mt-6 text-3xl font-bold">Thank you! ♟</h3>
                  <p className="mx-auto mt-2 max-w-xs text-midnight/75">Your feedback has been received. It genuinely helps make the next move better.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
                    Send more feedback
                  </Button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
                  <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="fb-company_website">Company website</label>
                    <input id="fb-company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div>
                    <Label htmlFor="fb-name">Name (optional)</Label>
                    <Input id="fb-name" name="name" autoComplete="name" maxLength={100} placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="fb-message">Your feedback</Label>
                    <Textarea
                      id="fb-message"
                      name="message"
                      required
                      maxLength={2000}
                      className="min-h-36"
                      placeholder="What did you think?"
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "fb-message-err" : undefined}
                    />
                    <FieldError id="fb-message-err" message={errors.message} />
                  </div>
                  <div>
                    <Label htmlFor="fb-experience">Chess experience (optional)</Label>
                    <Select id="fb-experience" name="chess_experience" defaultValue="">
                      <option value="">Prefer not to say</option>
                      {CHESS_EXPERIENCE.map((x) => (
                        <option key={x} value={x}>{experienceLabels[x]}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex items-start gap-3">
                    <input id="fb-public" name="allow_public" type="checkbox" className="mt-1 size-5 shrink-0 cursor-pointer accent-emerald" />
                    <label htmlFor="fb-public" className="text-sm leading-relaxed text-midnight/80">
                      You may display my feedback publicly as a testimonial (after your approval).
                    </label>
                  </div>

                  {serverError && (
                    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{serverError}</p>
                  )}

                  <Button type="submit" variant="emerald" size="lg" className="w-full" disabled={status === "sending"}>
                    {status === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
                    {status === "sending" ? "Sending…" : "Share Feedback"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

