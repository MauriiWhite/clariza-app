// Cliente Supabase server-side con manejo de cookies para Next.js App Router.
// Usado por:
//   - src/app/auth/callback/route.ts (magic link callback)
//   - src/app/api/cron/reminders/route.ts (cron de recordatorios)
//
// Requiere env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//   o SUPABASE_SERVICE_ROLE_KEY para operaciones admin (cron)

import { createServerClient } from "@supabase/ssr";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type CookieStore =
  | ReadonlyRequestCookies
  | { get(name: string): { value: string } | undefined; set?: unknown };

/** Cliente Supabase server-side enlazado al cookie store del request. */
export function createClient(cookieStore: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        if ("getAll" in cookieStore && typeof cookieStore.getAll === "function") {
          return cookieStore.getAll();
        }
        return [];
      },
      setAll(cookiesToSet) {
        try {
          if (
            "set" in cookieStore &&
            typeof (cookieStore as { set?: unknown }).set === "function"
          ) {
            for (const { name, value, options } of cookiesToSet) {
              (
                cookieStore as {
                  set: (n: string, v: string, o?: unknown) => void;
                }
              ).set(name, value, options);
            }
          }
        } catch {
          // setAll falla en route handlers GET — los magic link callbacks
          // sobrescriben con NextResponse.redirect manualmente.
        }
      },
    },
  });
}
