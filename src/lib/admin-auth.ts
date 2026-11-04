import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { timingSafeEqual } from "node:crypto";

/** Supabase client bound to the visitor's auth cookies (publishable key only). */
export async function getSupabaseAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (items) => {
          try {
            items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — the proxy refreshes sessions instead.
          }
        },
      },
    },
  );
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a.toLowerCase());
  const bb = Buffer.from(b.toLowerCase());
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Returns the authenticated owner, or null.
 * The user is validated against Supabase Auth (getUser, not getSession) and
 * must match ADMIN_EMAIL. Every admin page and API route calls this.
 */
export async function getAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (
    !adminEmail ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = await getSupabaseAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email || !data.user.email_confirmed_at) return null;
  return safeEqual(data.user.email, adminEmail) ? data.user : null;
}
