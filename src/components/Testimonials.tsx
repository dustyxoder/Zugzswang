import { Quote } from "lucide-react";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string | null;
  message: string;
  chess_experience: string | null;
}

async function loadApproved(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("feedback")
      .select("id, name, message, chess_experience")
      .eq("approved", true)
      .eq("allow_public", true)
      .order("created_at", { ascending: false })
      .limit(6);
    return error ? [] : (data as Testimonial[]);
  } catch {
    return [];
  }
}

/** Renders ONLY manually approved, public-permitted feedback. Renders nothing otherwise. */
export async function Testimonials() {
  const items = await loadApproved();
  if (items.length === 0) return null;

  return (
    <section aria-label="Testimonials" className="on-light bg-sage/40 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h3 className="mb-8 text-center text-2xl font-bold">Kind words</h3>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <Quote className="size-6 text-emerald" aria-hidden />
              <p className="mt-3 text-midnight/85">{t.message}</p>
              <p className="mt-4 text-sm font-semibold">{t.name || "A Zugzwang visitor"}</p>
              {t.chess_experience && <p className="text-xs capitalize text-midnight/60">{t.chess_experience}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
