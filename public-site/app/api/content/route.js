import { NextResponse } from "next/server";
import { getContent } from "../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(
      { content },
      { headers: { "Cache-Control": "public, max-age=0, must-revalidate" } }
    );
  } catch (err) {
    console.error("Failed to load content:", err);
    return NextResponse.json(
      { error: "Не вдалося завантажити вміст сайту." },
      { status: 500 }
    );
  }
}
