import { NextResponse } from "next/server";
import { sessionCookieOptions } from "../../../../lib/auth";
import { corsHeaders, handlePreflight, isAllowedAdminOrigin } from "../../../../lib/cors";

export const runtime = "nodejs";

export async function OPTIONS(request) {
  return handlePreflight(request);
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  if (!isAllowedAdminOrigin(origin)) {
    return NextResponse.json(
      { error: "Заборонено." },
      { status: 403, headers }
    );
  }

  const response = NextResponse.json({ ok: true }, { headers });
  const opts = sessionCookieOptions();
  response.cookies.set(opts.name, "", { ...opts, maxAge: 0 });
  return response;
}
