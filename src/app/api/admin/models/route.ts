import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";

// GET — List all models (including inactive)
export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId");

  let query = supabaseAdmin.from("models").select("*");
  if (brandId) query = query.eq("brand_id", brandId);

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, models: data });
}

// POST — Add a new model
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, brand_id, name, base_price, pricing_config, is_active } = body;

    let effectiveBasePrice = base_price !== undefined ? Number(base_price) : 0;
    if (!effectiveBasePrice && pricing_config?.variantPrices) {
      effectiveBasePrice = pricing_config.variantPrices["8_256"] || pricing_config.variantPrices["6_128"] || Object.values(pricing_config.variantPrices)[0] || 30000;
    }

    if (!id || !brand_id || !name || !effectiveBasePrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, brand_id, name, base_price/variantPrices" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("models")
      .insert({
        id: id.toLowerCase().trim(),
        brand_id: brand_id.toLowerCase().trim(),
        name: name.trim(),
        base_price: Number(effectiveBasePrice),
        pricing_config: pricing_config || null,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, model: data });
  } catch (err) {
    console.error("[/api/admin/models POST] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update a model
export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, brand_id, name, base_price, pricing_config, is_active } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing model id" }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {};
    if (brand_id !== undefined) updatePayload.brand_id = brand_id;
    if (name !== undefined) updatePayload.name = name;
    if (base_price !== undefined) updatePayload.base_price = Number(base_price);
    if (pricing_config !== undefined) updatePayload.pricing_config = pricing_config;
    if (is_active !== undefined) updatePayload.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from("models")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, model: data });
  } catch (err) {
    console.error("[/api/admin/models PUT] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Delete model
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

    const { error } = await supabaseAdmin.from("models").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Model deleted" });
  } catch (err) {
    console.error("[/api/admin/models DELETE] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
