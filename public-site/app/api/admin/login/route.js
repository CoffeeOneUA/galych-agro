import { NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  sessionCookieOptions,
  getClientIp
} from "../../../../lib/auth";
import { recordLoginAttempt, isRateLimited } from "../../../../lib/db";
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
      { error: "Заборонено: невідоме джерело запиту." },
      { status: 403, headers }
    );
  }

  const ip = getClientIp(request);

  try {
    if (await isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Забагато невдалих спроб входу. Спробуйте ще раз через 15 хвилин."
        },
        { status: 429, headers }
      );
    }

    const body = await request.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json(
        { error: "Введіть пароль." },
        { status: 400, headers }
      );
    }

    const valid = await verifyPassword(password);
    await recordLoginAttempt(ip, valid);

    if (!valid) {
      return NextResponse.json(
        { error: "Невірний пароль." },
        { status: 401, headers }
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true }, { headers });
    response.cookies.set(sessionCookieOptions().name, token, sessionCookieOptions());
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Сталася помилка сервера. Спробуйте пізніше." },
      { status: 500, headers }
    );
  }
}
