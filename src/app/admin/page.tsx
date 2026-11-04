import type { Metadata } from "next";
import Link from "next/link";
import { Download, LogOut } from "lucide-react";
import { getAdminUser } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { LEAD_STATUSES, levelLabels, platformLabels } from "@/lib/validation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./LoginForm";
import { logoutAction } from "./actions";
import { FeedbackApproveButton, LeadStatusSelect } from "./controls";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  whatsapp_number: string | null;
  social_platform: keyof typeof platformLabels | null;
  social_handle: string | null;
  chess_level: keyof typeof levelLabels | null;
  learning_goal: string | null;
  preferred_contact_method: string | null;
  source: string;
  status: string;
  created_at: string;
}

interface FeedbackRow {
  id: string;
  name: string | null;
  message: string;
  chess_experience: string | null;
  allow_public: boolean;
  approved: boolean;
  created_at: string;
}

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await getAdminUser();

  if (!admin) {
    return (
      <main className="on-light grid min-h-dvh place-items-center bg-ivory px-5">
        <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-xl">
          <Logo className="text-midnight" />
          <h1 className="mt-6 text-3xl font-bold">Owner sign-in</h1>
          <p className="mb-6 mt-1 text-sm text-midnight/70">This area is private.</p>
          <LoginForm />
        </div>
      </main>
    );
  }

  const { status } = await searchParams;
  const filter = (LEAD_STATUSES as readonly string[]).includes(status ?? "") ? status : undefined;
  const db = getSupabaseAdmin();

  const [allRes, feedbackRes] = await Promise.all([
    db.from("leads").select("*").order("created_at", { ascending: false }).limit(1000),
    db.from("feedback").select("*").order("created_at", { ascending: false }).limit(50),
  ]);

  const all = (allRes.data ?? []) as Lead[];
  const feedback = (feedbackRes.data ?? []) as FeedbackRow[];
  const leads = filter ? all.filter((l) => l.status === filter) : all;
  const count = (s: string) => all.filter((l) => l.status === s).length;

  const stats = [
    ["Total enquiries", all.length],
    ["New", count("new")],
    ["Contacted", count("contacted")],
    ["Booked calls", count("booked")],
  ] as const;

  return (
    <div className="on-light min-h-dvh bg-ivory pb-20">
      <header className="bg-midnight py-5 text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ivory/70 sm:inline">{admin.email}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="glass" size="sm"><LogOut className="size-4" aria-hidden /> Sign out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
        {(allRes.error || feedbackRes.error) && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            Could not load some data. Check that supabase/schema.sql has been run.
          </p>
        )}

        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(([label, n]) => (
            <div key={label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-midnight/5">
              <dt className="text-sm font-medium text-midnight/70">{label}</dt>
              <dd className="mt-1 font-heading text-4xl font-bold">{n}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12" aria-labelledby="leads-h">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="leads-h" className="text-2xl font-bold">Leads</h2>
            <Button asChild variant="emerald">
              <a href={`/api/admin/export${filter ? `?status=${filter}` : ""}`} download>
                <Download className="size-4" aria-hidden /> Export Contacts to CSV
              </a>
            </Button>
          </div>

          <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
            {[undefined, ...LEAD_STATUSES].map((s) => (
              <Link
                key={s ?? "all"}
                href={s ? `/admin?status=${s}` : "/admin"}
                aria-current={filter === s ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold capitalize ring-1 ring-midnight/15 transition",
                  filter === s ? "bg-midnight text-lime" : "bg-white hover:bg-sage/50",
                )}
              >
                {s ?? "All"}
              </Link>
            ))}
          </nav>

          <div className="mt-5 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-midnight/5">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="bg-midnight/[0.04] text-xs uppercase tracking-wider text-midnight/70">
                <tr>
                  {["Submitted (IST)", "Name", "Contact", "Level & goal", "Source", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5 align-top">
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-midnight/60">No leads yet.</td></tr>
                )}
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-midnight/70">{fmt.format(new Date(l.created_at))}</td>
                    <td className="px-4 py-4 font-semibold">{l.full_name}</td>
                    <td className="space-y-0.5 px-4 py-4">
                      {l.email && <div><a className="text-emerald underline" href={`mailto:${l.email}`}>{l.email}</a></div>}
                      {l.whatsapp_number && <div>{l.whatsapp_number}</div>}
                      {l.social_handle && (
                        <div>{l.social_platform ? platformLabels[l.social_platform] : "Handle"}: {l.social_handle}</div>
                      )}
                      {l.preferred_contact_method && (
                        <div className="text-xs text-midnight/60">Prefers: {l.preferred_contact_method}</div>
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-4">
                      <div className="font-medium">{l.chess_level ? levelLabels[l.chess_level] : "—"}</div>
                      {l.learning_goal && <div className="mt-1 text-midnight/70">{l.learning_goal}</div>}
                    </td>
                    <td className="px-4 py-4 capitalize">{l.source.replace("_", " ")}</td>
                    <td className="px-4 py-4"><LeadStatusSelect id={l.id} status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="fb-h">
          <h2 id="fb-h" className="text-2xl font-bold">Recent feedback</h2>
          <p className="mt-1 text-sm text-midnight/70">Only feedback marked public <em>and</em> approved appears on the website.</p>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {feedback.length === 0 && <li className="text-midnight/60">No feedback yet.</li>}
            {feedback.map((f) => (
              <li key={f.id} className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-midnight/5">
                <div>
                  <p className="whitespace-pre-wrap">{f.message}</p>
                  <p className="mt-3 text-sm font-semibold">
                    {f.name || "Anonymous"}
                    {f.chess_experience && <span className="font-normal capitalize text-midnight/60"> · {f.chess_experience}</span>}
                  </p>
                  <p className="text-xs text-midnight/60">
                    {fmt.format(new Date(f.created_at))} · {f.allow_public ? "Public permission given" : "Private only"}
                    {f.approved && " · Approved"}
                  </p>
                </div>
                {f.allow_public ? (
                  <FeedbackApproveButton id={f.id} approved={f.approved} />
                ) : (
                  <p className="text-xs text-midnight/50">Cannot be published (no permission).</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
