import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySessionToken, SESSION_COOKIE_NAME } from "../../../../lib/auth";
import { corsHeaders, handlePreflight, isAllowedAdminOrigin } from "../../../../lib/cors";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"]);

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

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Файл не знайдено." }, { status: 400, headers });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Непідтримуваний тип файлу. Дозволено: PNG, JPEG, WEBP, SVG, ICO." },
      { status: 415, headers }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Файл завеликий. Максимум 4 МБ." },
      { status: 413, headers }
    );
  }

  try {
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const blob = await put(`galych-agro/${safeName}`, file, {
      access: "public",
      addRandomSuffix: true
    });
    return NextResponse.json({ url: blob.url }, { headers });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Не вдалося завантажити файл." },
      { status: 500, headers }
    );
  }
}
