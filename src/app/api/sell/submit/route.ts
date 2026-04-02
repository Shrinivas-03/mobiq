import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSellConfirmationEmail } from "@/lib/email";
import { calculatePrice } from "@/lib/pricing";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

export interface SellLeadRequest {
  // Device info
  brandId:   string;
  brandName: string;
  modelId:   string;
  modelName: string;
  variantId:   string;
  variantName: string;
  city: string;

  // Device condition
  mobileTurnsOn: boolean;
  accessories: {
    box:      boolean;
    charger:  boolean;
    invoice:  boolean;
    warranty: boolean;
  };
  hardwareDefects: string[];
  softwareDefects: string[];
  batteryHealth?:  number | null;
  batteryQuality?: string | null;
  deviceAge: string;

  // Quote
  quotedPrice: number;

  // Customer
  customerName:     string;
  customerPhone:    string;
  customerAltPhone?: string;
  customerEmail:    string;
  customerAddress:  string;
}

// ──────────────────────────────────────────────
// POST — Submit Lead → Supabase
// ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body: SellLeadRequest = await request.json();

    // ── Server-side validation ──
    const required: (keyof SellLeadRequest)[] = [
      "brandId", "modelId", "variantId", "city",
      "customerName", "customerPhone", "customerEmail", "customerAddress",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(body.customerPhone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number (must be 10 digits)" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customerEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // ── Server-side price validation ──
    // Recompute the price independently — never trust the client-submitted quotedPrice.
    const priceResult = calculatePrice({
      modelId:        body.modelId,
      brandId:        body.brandId,
      variantId:      body.variantId,
      mobileTurnsOn:  body.mobileTurnsOn,
      accessories:    body.accessories,
      hardwareDefects: body.hardwareDefects,
      softwareDefects: body.softwareDefects,
      batteryHealth:  body.batteryHealth,
      batteryQuality: body.batteryQuality,
      deviceAge:      body.deviceAge,
    });

    if (!priceResult.success) {
      return NextResponse.json(
        { success: false, error: `Price validation failed: ${priceResult.error}` },
        { status: 422 }
      );
    }

    const serverPrice = priceResult.finalPrice;

    // Allow a ±1 rupee tolerance (integer rounding edge cases), reject anything beyond that.
    if (Math.abs(body.quotedPrice - serverPrice) > 1) {
      console.warn(
        `[/api/sell/submit] Price tamper detected — client sent ₹${body.quotedPrice}, server computed ₹${serverPrice}`
      );
      return NextResponse.json(
        { success: false, error: "Quoted price mismatch. Please restart the sell flow and try again." },
        { status: 422 }
      );
    }

    // ── Build the row for Supabase ──
    const leadRow = {
      // Customer
      customer_name:      body.customerName,
      customer_phone:     body.customerPhone,
      customer_alt_phone: body.customerAltPhone || null,
      customer_email:     body.customerEmail,
      customer_address:   body.customerAddress,

      // Device
      brand_id:    body.brandId,
      brand_name:  body.brandName,
      model_id:    body.modelId,
      model_name:  body.modelName,
      variant_id:  body.variantId,
      variant_name: body.variantName,
      city:        body.city,

      // Condition
      mobile_turns_on:    body.mobileTurnsOn,
      has_original_box:   body.accessories.box,
      has_original_charger: body.accessories.charger,
      has_original_invoice: body.accessories.invoice,
      under_warranty:     body.accessories.warranty,
      hardware_defects:   body.hardwareDefects,   // stored as text[]
      software_defects:   body.softwareDefects,   // stored as text[]
      battery_health:     body.batteryHealth ?? null,
      battery_quality:    body.batteryQuality ?? null,
      device_age:         body.deviceAge,

      // Quote — always use the server-computed price, never the client value
      quoted_price: serverPrice,

      // Status (for admin tracking)
      status: "pending",
    };

    const { data, error } = await supabase
      .from("sell_leads")
      .insert(leadRow)
      .select("id, quoted_price")
      .single();

    if (error) {
      console.error("[/api/sell/submit] Supabase error:", error.message);
      return NextResponse.json(
        { success: false, error: "Database error: " + error.message },
        { status: 500 }
      );
    }

    const leadId = `MOBIQ-${data.id}`;
    console.log(`[/api/sell/submit] Lead saved: ${leadId}`);

    // ── Send confirmation email (non-blocking — failure won't break the response) ──
    sendSellConfirmationEmail({
      leadId,
      customerName:    body.customerName,
      customerEmail:   body.customerEmail,
      customerPhone:   body.customerPhone,
      customerAltPhone: body.customerAltPhone,
      customerAddress: body.customerAddress,
      brandName:   body.brandName,
      modelName:   body.modelName,
      variantName: body.variantName,
      city:        body.city,
      deviceAge:   body.deviceAge,
      mobileTurnsOn: body.mobileTurnsOn,
      accessories: body.accessories,
      hardwareDefects: body.hardwareDefects,
      softwareDefects: body.softwareDefects,
      batteryHealth:  body.batteryHealth,
      batteryQuality: body.batteryQuality,
      isApple:     body.brandId === "apple",
      quotedPrice: serverPrice,
    }).catch((emailErr) => {
      // Log email failures but don't surface them to the customer
      console.error("[/api/sell/submit] Email sending failed:", emailErr);
    });

    return NextResponse.json({
      success: true,
      leadId,
      quotedPrice: data.quoted_price,
      message: "Your sell request has been received. Our team will contact you shortly!",
    });

  } catch (err) {
    console.error("[/api/sell/submit] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// GET — List Leads (Admin)
// Protect this route with auth middleware in production!
// ──────────────────────────────────────────────

export async function GET() {
  const { data, error } = await supabase
    .from("sell_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, count: data?.length ?? 0, leads: data });
}
