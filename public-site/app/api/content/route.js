import { NextResponse } from "next/server";
import { getContent } from "../../../lib/db";
import { corsHeaders, handlePreflight } from "../../../lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(request) {
  return handlePreflight(request);
}

export async function GET(request) {
  const origin = request.headers.get("origin") || "";
  const headers = {
    ...corsHeaders(origin),
    "Cache-Control": "public, max-age=0, must-revalidate"
  };
  try {
    const content = await getContent();
    return NextResponse.json({ content }, { headers });
  } catch (err) {
    console.error("Failed to load content:", err);
    return NextResponse.json(
      { error: "Не вдалося завантажити вміст сайту." },
      { status: 500, headers }
    );
  }
}
