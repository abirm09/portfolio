import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    typeof window !== "undefined" && window.__ENV?.NEXT_PUBLIC_SUPABASE_URL
      ? window.__ENV.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    typeof window !== "undefined" && window.__ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? window.__ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
