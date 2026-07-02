import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser client — safe to import in client components.
 * Uses the public anon key and respects RLS.
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Server client for use inside Route Handlers / Server Components where
 * cookies are readable via `next/headers`. Pass the cookie store from the
 * caller so this file has no direct dependency on `next/headers`.
 */
export function createServerSupabaseClient(cookieStore: {
  get(name: string): { value: string } | undefined;
  set?(name: string, value: string, options: CookieOptions): void;
}) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set?.(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set?.(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}

/**
 * Service-role client — server only. Bypasses RLS. Never import this from
 * a file that ships to the browser bundle.
 */
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createSupabaseClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Default browser-safe singleton for convenience in client components.
 * Lazily initialised so build-time static analysis doesn't throw when
 * env vars are absent during `next build`.
 */
let _supabase: ReturnType<typeof createSupabaseClient> | null = null;
export function getSupabase() {
  if (!_supabase) {
    _supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
  }
  return _supabase;
}
// Keep named export for backward compat — resolved lazily via getter
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getSupabase() as any)[prop];
  },
});
