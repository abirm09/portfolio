const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type PublicEnv = Record<(typeof PUBLIC_ENV_KEYS)[number], string | undefined>;

function getRuntimeEnv(): PublicEnv {
  if (typeof window !== "undefined" && (window as WindowWithEnv).__ENV) {
    return (window as WindowWithEnv).__ENV;
  }

  const env: Record<string, string | undefined> = {};
  for (const key of PUBLIC_ENV_KEYS) {
    env[key] = process.env[key];
  }
  return env as PublicEnv;
}

export function getPublicEnv(): PublicEnv {
  return getRuntimeEnv();
}

type WindowWithEnv = Window & {
  __ENV: PublicEnv;
};
