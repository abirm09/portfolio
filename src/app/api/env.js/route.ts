import { getPublicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const publicEnv = getPublicEnv();
  const serialized = JSON.stringify(publicEnv).replace(/</g, "\\u003c");
  const scriptContent = `window.__ENV=Object.freeze(${serialized});`;

  return new Response(scriptContent, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
