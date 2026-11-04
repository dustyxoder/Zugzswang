"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  CHESS_LEVELS,
  CONTACT_METHODS,
  SOCIAL_PLATFORMS,
  levelLabels,
  platformLabels,
  type LeadInput,
} from "@/lib/validation";

type Source = LeadInput["source"];
type Errors = Record<string, string>;

const contactLabels = { email: "Email", whatsapp: "WhatsApp", social: "Chess / social handle" } as const;

export function ContactForm({
  source = "website_form",
  compact = false,
  onSuccess,
  idPrefix = "lead",
}: {
  source?: Source;
  /** Compact mode hides the optional goal/level fields to keep modals short. */
  compact?: boolean;
  onSuccess?: () => void;
  idPrefix?: string;
}) {
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (k: string) => String(form.get(k) ?? "").trim();

    const payload = {
      full_name: text("full_name"),
      email: text("email"),
      whatsapp_number: text("whatsapp_number"),
      social_platform: text("social_platform") || undefined,
      social_handle: text("social_handle"),
      chess_level: text("chess_level") || undefined,
      learning_goal: text("learning_goal"),
      preferred_contact_method: text("preferred_contact_method") || undefined,
      source,
      consent: form.get("consent") === "on",
      company_website: text("company_website"),
      elapsed_ms: Date.now() - openedAt.current,
    };

    setStatus("sending");
    setErrors({});
    setServerError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: Errors };
      if (!res.ok) {
        setErrors(data.fieldErrors ?? {});
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
      onSuccess?.();
    } catch {
      setServerError("Network problem. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="py-8 text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold">Thank you — got it!</h3>
        <p className="mx-auto mt-2 max-w-sm text-midnight/75">
          I&apos;ll get back to you soon using the way you chose. Looking forward to talking chess.
        </p>
      </div>
    );
  }

  const id = (n: string) => `${idPrefix}-${n}`;
  const err = (n: string) => ({
    "aria-invalid": errors[n] ? true : undefined,
    "aria-describedby": errors[n] ? id(`${n}-err`) : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      {/* Honeypot — hidden from people, irresistible to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("company_website")}>Company website</label>
        <input id={id("company_website")} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor={id("full_name")}>Your name</Label>
        <Input id={id("full_name")} name="full_name" autoComplete="name" required maxLength={100} placeholder="e.g. Aarav" {...err("full_name")} />
        <FieldError id={id("full_name-err")} message={errors.full_name} />
      </div>

      <fieldset className="space-y-4 rounded-2xl bg-sage/30 p-4">
        <legend className="px-1 text-sm font-semibold">How can I reach you? (at least one)</legend>
        <div>
          <Label htmlFor={id("email")}>Email</Label>
          <Input id={id("email")} name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" {...err("email")} />
          <FieldError id={id("email-err")} message={errors.email} />
        </div>
        <div>
          <Label htmlFor={id("whatsapp_number")}>WhatsApp number</Label>
          <Input id={id("whatsapp_number")} name="whatsapp_number" type="tel" autoComplete="tel" maxLength={20} placeholder="+91 98765 43210" {...err("whatsapp_number")} />
          <FieldError id={id("whatsapp_number-err")} message={errors.whatsapp_number} />
        </div>
        <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
          <div>
            <Label htmlFor={id("social_platform")}>Platform</Label>
            <Select id={id("social_platform")} name="social_platform" defaultValue="chesscom">
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>{platformLabels[p]}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={id("social_handle")}>Handle</Label>
            <Input id={id("social_handle")} name="social_handle" maxLength={60} placeholder="your_username" autoCapitalize="none" {...err("social_handle")} />
            <FieldError id={id("social_handle-err")} message={errors.social_handle} />
          </div>
        </div>
      </fieldset>

      <div>
        <Label htmlFor={id("preferred_contact_method")}>Preferred way to be contacted</Label>
        <Select id={id("preferred_contact_method")} name="preferred_contact_method" defaultValue="">
          <option value="">No preference</option>
          {CONTACT_METHODS.map((m) => (
            <option key={m} value={m}>{contactLabels[m]}</option>
          ))}
        </Select>
      </div>

      {!compact && (
        <>
          <div>
            <Label htmlFor={id("chess_level")}>Current chess level</Label>
            <Select id={id("chess_level")} name="chess_level" defaultValue="">
              <option value="">Select your level</option>
              {CHESS_LEVELS.map((l) => (
                <option key={l} value={l}>{levelLabels[l]}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={id("learning_goal")}>What would you like to improve?</Label>
            <Textarea id={id("learning_goal")} name="learning_goal" maxLength={1000} placeholder="Openings, tactics, beating a friend, getting to 1200…" />
          </div>
        </>
      )}

      <div className="flex items-start gap-3">
        <input
          id={id("consent")}
          name="consent"
          type="checkbox"
          className="mt-1 size-5 shrink-0 cursor-pointer accent-emerald"
          {...err("consent")}
        />
        <label htmlFor={id("consent")} className="text-sm leading-relaxed text-midnight/80">
          I agree that my details will be used only to respond to my chess coaching enquiry. See the{" "}
          <a href="/privacy" className="font-semibold text-emerald underline underline-offset-2">Privacy Policy</a>.
        </label>
      </div>
      <FieldError id={id("consent-err")} message={errors.consent} />

      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{serverError}</p>
      )}

      <Button type="submit" variant="emerald" size="lg" className="w-full" disabled={status === "sending"}>
        {status === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send my details"}
      </Button>
    </form>
  );
}

