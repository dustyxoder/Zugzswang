import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { LEAD_STATUSES } from "@/lib/validation";
import { toCsv } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = [
  "Date",
  "Full name",
  "Email",
  "WhatsApp",
  "Social platform",
  "Social handle",
  "Chess level",
  "Learning goal",
  "Preferred contact",
  "Source",
  "Status",
  "Consent given at",
  "ID",
];

export async function GET(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = new URL(req.url).searchParams.get("status");
  let query = getSupabaseAdmin().from("leads").select("*").order("created_at", { ascending: false });
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("CSV export failed", { code: error.code });
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }

  const rows = (data ?? []).map((l) => [
    l.created_at,
    l.full_name,
    l.email,
    l.whatsapp_number,
    l.social_platform,
    l.social_handle,
    l.chess_level,
    l.learning_goal,
    l.preferred_contact_method,
    l.source,
    l.status,
    l.consent_at,
    l.id,
  ]);

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(HEADERS, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zugzwang-contacts-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
