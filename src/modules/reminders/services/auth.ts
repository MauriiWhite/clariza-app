// Cliente browser-side para magic link auth con Supabase.
// Lo consume ReminderForm cuando el ciudadano activa recordatorios por email.

"use client";

import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createBrowserClient(url, anonKey);
}

/**
 * Envia un magic link al email del usuario para activar recordatorios.
 * El callback aterriza en /auth/callback?next=/console.
 */
export async function sendMagicLink(
  email: string,
  redirectTo: string,
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
