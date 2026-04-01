import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

// ── GET /api/admin/me — returns current admin if session is valid ──
export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Not authenticated." },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, admin });
}
