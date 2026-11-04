"use server";

import { redirect } from "next/navigation";
import { getAdminUser, getSupabaseAuthClient } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(200) });

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Please wait a few minutes." };
  }

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const supabase = await getSupabaseAuthClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Sign-in failed. Check your details and try again." };

  // Signed in with Supabase, but only the configured owner may proceed.
  if (!(await getAdminUser())) {
    await supabase.auth.signOut();
    return { error: "This account is not authorised to access the dashboard." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await getSupabaseAuthClient();
  await supabase.auth.signOut();
  redirect("/admin");
}
