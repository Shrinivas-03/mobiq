import { NextResponse } from "next/server";
import { getActiveBrands } from "@/lib/brands";

export async function GET() {
  try {
    const brands = await getActiveBrands();
    return NextResponse.json({ success: true, brands });
  } catch (err) {
    console.error("[/api/brands] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
