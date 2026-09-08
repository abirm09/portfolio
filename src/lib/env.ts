const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export type PublicEnv = Record<(typeof PUBLIC_ENV_KEYS)[number], string | undefined>;

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __ENV?: PublicEnv;
  }
}

function getRuntimeEnv(): PublicEnv {
  if (typeof window !== "undefined" && window.__ENV) {
    return window.__ENV;
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
