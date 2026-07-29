import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

// ── POST /api/admin/testimonials — create testimonial ──
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { client_name, model_name, instagram_url } = body as {
      client_name: string;
      model_name: string;
      instagram_url: string;
    };

    if (!client_name?.trim() || !model_name?.trim() || !instagram_url?.trim()) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert({
        client_name: client_name.trim(),
        model_name: model_name.trim(),
        instagram_url: instagram_url.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, testimonial: data });
  } catch (err) {
    console.error("[/api/admin/testimonials] POST error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE /api/admin/testimonials — delete testimonial ──
export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing testimonial ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("[/api/admin/testimonials] DELETE error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
