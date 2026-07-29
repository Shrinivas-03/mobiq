import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    // Sanitize and generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
    const fileName = `brand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket 'brand-logos'
    const { data, error } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (error) {
      console.error("[/api/admin/brands/upload] Supabase storage upload error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("brand-logos").getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (err) {
    console.error("[/api/admin/brands/upload] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
