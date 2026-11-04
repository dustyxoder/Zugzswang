import { z } from "zod";

export const LEAD_SOURCES = ["chessboard", "whatsapp", "booking", "website_form"] as const;
export const LEAD_STATUSES = ["new", "contacted", "booked", "completed"] as const;
export const SOCIAL_PLATFORMS = ["chesscom", "lichess", "instagram", "other"] as const;
export const CHESS_LEVELS = ["beginner", "improving", "intermediate", "advanced", "not_sure"] as const;
export const CONTACT_METHODS = ["email", "whatsapp", "social"] as const;
export const CHESS_EXPERIENCE = ["new", "beginner", "intermediate", "advanced"] as const;

export const platformLabels: Record<(typeof SOCIAL_PLATFORMS)[number], string> = {
  chesscom: "Chess.com",
  lichess: "Lichess",
  instagram: "Instagram",
  other: "Other",
};

export const levelLabels: Record<(typeof CHESS_LEVELS)[number], string> = {
  beginner: "Just starting out",
  improving: "Know the basics, want to improve",
  intermediate: "Intermediate",
  advanced: "Advanced",
  not_sure: "Not sure yet",
};

/** Trim, collapse to undefined when empty. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Common spam signals shared by public forms. */
const antiSpam = {
  /** Honeypot: real people never see/fill this field. Checked by looksLikeSpam(), not rejected here, so bots get no signal. */
  company_website: z.string().max(500).optional(),
  /** Milliseconds the form was open — bots submit instantly. */
  elapsed_ms: z.number().int().min(0).optional(),
};

export const leadSchema = z
  .object({
    full_name: z.string().trim().min(2, "Please enter your name").max(100),
    email: z
      .string()
      .trim()
      .max(254)
      .optional()
      .transform((v) => (v ? v : undefined))
      .pipe(z.email("Please enter a valid email").optional()),
    whatsapp_number: optionalText(20).refine(
      (v) => !v || /^\+?[0-9 ()-]{7,20}$/.test(v),
      "Please enter a valid WhatsApp number",
    ),
    social_platform: z.enum(SOCIAL_PLATFORMS).optional(),
    social_handle: optionalText(60).refine(
      (v) => !v || /^[A-Za-z0-9._@\-/:]+$/.test(v),
      "Handles can only contain letters, numbers and . _ - @",
    ),
    chess_level: z.enum(CHESS_LEVELS).optional(),
    learning_goal: optionalText(1000),
    preferred_contact_method: z.enum(CONTACT_METHODS).optional(),
    source: z.enum(LEAD_SOURCES).default("website_form"),
    consent: z.literal(true, { error: "Please agree so I can respond to you" }),
    ...antiSpam,
  })
  .refine((d) => Boolean(d.email || d.whatsapp_number || d.social_handle), {
    message: "Please share at least one way to reach you: email, WhatsApp or a social handle",
    path: ["email"],
  });

export type LeadInput = z.infer<typeof leadSchema>;

export const feedbackSchema = z.object({
  name: optionalText(100),
  message: z.string().trim().min(5, "Please write a little more").max(2000),
  chess_experience: z.enum(CHESS_EXPERIENCE).optional(),
  allow_public: z.boolean().default(false),
  ...antiSpam,
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const statusUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum(LEAD_STATUSES),
});

export const feedbackModerationSchema = z.object({
  id: z.uuid(),
  approved: z.boolean(),
});

/** Spam check shared by API routes. Returns true if the request looks automated. */
export function looksLikeSpam(data: { company_website?: string; elapsed_ms?: number }): boolean {
  if (data.company_website) return true;
  if (data.elapsed_ms !== undefined && data.elapsed_ms < 1500) return true;
  return false;
}
