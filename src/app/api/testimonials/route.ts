import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/testimonials] Supabase error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, testimonials: data });
  } catch (err) {
    console.error("[/api/testimonials] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
