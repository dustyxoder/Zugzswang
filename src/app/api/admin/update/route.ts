import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { feedbackModerationSchema, statusUpdateSchema } from "@/lib/validation";
import { isSameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Owner-only: update a lead's status, or approve/hide a piece of feedback. */
export async function PATCH(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Invalid request" }, { status: 403 });
  if (!(await getAdminUser())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const kind = new URL(req.url).searchParams.get("type");
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  if (kind === "lead") {
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { error } = await db.from("leads").update({ status: parsed.data.status }).eq("id", parsed.data.id);
    if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (kind === "feedback") {
    const parsed = feedbackModerationSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const { error } = await db.from("feedback").update({ approved: parsed.data.approved }).eq("id", parsed.data.id);
    if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
