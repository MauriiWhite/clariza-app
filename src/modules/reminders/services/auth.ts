import { createClient } from "@/utils/supabase/client";

/**
 * Servicio de autenticación para enviar el Magic Link
 * Se usa para activar los recordatorios de email (Hito de Mauricio)
 */
export async function sendMagicLink(email: string, redirectTo: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    console.error("Error sending magic link:", error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function getCurrentSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    throw error;
  }
  return data.session;
}
