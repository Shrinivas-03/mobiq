import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

// ── GET /api/admin/inventory — list all inventory items ──
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("device_inventory")
    .select("*")
    .order("acquired_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, items: data });
}

// ── POST /api/admin/inventory — update item status ──
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = { status };
    if (status === "sold") updatePayload.sold_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("device_inventory")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    console.error("[/api/admin/inventory] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
