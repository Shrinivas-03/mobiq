import { NextResponse } from "next/server";
import { getActiveModels } from "@/lib/brands";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId") || undefined;

    const models = await getActiveModels(brandId);
    return NextResponse.json({ success: true, models });
  } catch (err) {
    console.error("[/api/models] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
