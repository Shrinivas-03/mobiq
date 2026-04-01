import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

// ── POST /api/contact — public form submission ──
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as {
      name: string; email: string; subject: string; message: string;
    };

    // Validation
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await supabase.from("contact_queries").insert({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status:  "new",
    });

    if (error) {
      console.error("[/api/contact] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: "Failed to save query." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Your query has been received. We'll get back to you shortly!" });

  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}

// ── GET /api/contact — admin: list all queries ──
export async function GET(request: Request) {
  // Verify admin session
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("contact_queries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, queries: data });
}

// ── PATCH /api/contact — admin: update query status ──
export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  try {
    const { id, status } = await request.json() as { id: string; status: string };

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contact_queries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, query: data });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
