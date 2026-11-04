import { NextResponse } from "next/server";
import { feedbackSchema, looksLikeSpam } from "@/lib/validation";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { clientIp, isSameOrigin, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  }

  if (!rateLimit(`feedback:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
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

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return NextResponse.json({ error: "Please check the form", fieldErrors }, { status: 400 });
  }

  const { company_website, elapsed_ms, ...feedback } = parsed.data;
  if (looksLikeSpam({ company_website, elapsed_ms })) {
    return NextResponse.json({ ok: true });
  }

  if (!isSupabaseConfigured()) {
    console.error("Feedback submission failed: Supabase is not configured");
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 503 });
  }

  // `approved` always starts false — feedback is only shown after manual approval.
  const { error } = await getSupabaseAdmin()
    .from("feedback")
    .insert({ ...feedback, approved: false });

  if (error) {
    console.error("Feedback insert failed", { code: error.code });
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
