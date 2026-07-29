import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

// GET — List all brands (including inactive)
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase.from("brands").select("*").order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, brands: data });
}

// POST — Create a new brand
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, logo_url, is_active } = body;

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields: id, name" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("brands")
      .insert({
        id: id.toLowerCase().trim(),
        name: name.trim(),
        logo_url: logo_url || "/apple.png",
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, brand: data });
  } catch (err) {
    console.error("[/api/admin/brands POST] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update brand
export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, logo_url, is_active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing brand id" }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (name !== undefined) updatePayload.name = name;
    if (logo_url !== undefined) updatePayload.logo_url = logo_url;
    if (is_active !== undefined) updatePayload.is_active = is_active;

    const { data, error } = await supabase
      .from("brands")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, brand: data });
  } catch (err) {
    console.error("[/api/admin/brands PUT] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete brand
export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
    }

    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Brand deleted" });
  } catch (err) {
    console.error("[/api/admin/brands DELETE] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
