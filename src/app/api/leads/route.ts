import { NextResponse } from "next/server";
import { leadSchema, looksLikeSpam } from "@/lib/validation";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  const ip = clientIp(req);
  if (!rateLimit(`leads:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Please check the form", fieldErrors }, { status: 400 });
  }

  const { company_website, elapsed_ms, consent, ...lead } = parsed.data;
  void consent;

  // Spam: pretend success so bots learn nothing.
  if (looksLikeSpam({ company_website, elapsed_ms })) {
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    console.error("Lead submission failed: Supabase is not configured");
    return NextResponse.json({ error: "Something went wrong. Please try WhatsApp instead." }, { status: 503 });
  }

  const { error } = await getSupabaseAdmin()
    .from("leads")
    .insert({ ...lead, consent_at: new Date().toISOString() });

  if (error) {
    console.error("Lead insert failed", { code: error.code });
    return NextResponse.json({ error: "Something went wrong. Please try again or use WhatsApp." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
