import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "../../../../lib/auth";
import { saveContent } from "../../../../lib/db";
import { corsHeaders, handlePreflight, isAllowedAdminOrigin } from "../../../../lib/cors";
import { contentSchema } from "../../../../lib/contentSchema";

export const runtime = "nodejs";

export async function OPTIONS(request) {
  return handlePreflight(request);
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  if (!isAllowedAdminOrigin(origin)) {
    return NextResponse.json({ error: "Заборонено." }, { status: 403, headers });
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authed = token ? await verifySessionToken(token) : false;
  if (!authed) {
    return NextResponse.json(
      { error: "Сесія недійсна. Увійдіть ще раз." },
      { status: 401, headers }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Дані не пройшли перевірку.", details: parsed.error.flatten() },
      { status: 422, headers }
    );
  }

  try {
    await saveContent(parsed.data);
    return NextResponse.json({ ok: true }, { headers });
  } catch (err) {
    console.error("Save content error:", err);
    return NextResponse.json(
      { error: "Не вдалося зберегти зміни." },
      { status: 500, headers }
    );
  }
}
