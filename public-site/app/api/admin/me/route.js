import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "../../../../lib/auth";
import { corsHeaders, handlePreflight, isAllowedAdminOrigin } from "../../../../lib/cors";

export const runtime = "nodejs";

export async function OPTIONS(request) {
  return handlePreflight(request);
}

export async function GET(request) {
  const origin = request.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  if (!isAllowedAdminOrigin(origin)) {
    return NextResponse.json({ authenticated: false }, { status: 403, headers });
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = token ? await verifySessionToken(token) : false;

  return NextResponse.json(
    { authenticated: valid },
    { status: valid ? 200 : 401, headers }
  );
}
