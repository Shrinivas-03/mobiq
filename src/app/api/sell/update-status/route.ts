import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";
import { sendPickupEmail, sendCompletedEmail } from "@/lib/email";

// ── Build a human-readable condition summary from a sell_leads row ──
function buildConditionSummary(lead: Record<string, unknown>): string {
  const parts: string[] = [];
  if (!lead.mobile_turns_on) parts.push("Does not power on");
  const hw = (lead.hardware_defects as string[]) ?? [];
  const sw = (lead.software_defects as string[]) ?? [];
  if (hw.length > 0) parts.push(`HW: ${hw.join(", ")}`);
  if (sw.length > 0) parts.push(`SW: ${sw.join(", ")}`);
  if (lead.battery_health) parts.push(`Battery ${lead.battery_health}%`);
  if (lead.battery_quality) parts.push(`Battery: ${lead.battery_quality}`);
  return parts.length ? parts.join(" | ") : "No defects reported";
}

export async function POST(request: Request) {
  try {
    // 1. Verify admin
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // 2. Parse body
    const body = await request.json();
    const { id, status, actualAmount } = body as { id: string; status: string; actualAmount?: number };

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }

    // 3. Build update payload
    const updatePayload: Record<string, unknown> = { status };
    if (actualAmount !== undefined) updatePayload.actual_amount = actualAmount;

    // 4. Update status in DB and fetch the full lead row in one query
    const { data: lead, error } = await supabase
      .from("sell_leads")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !lead) {
      console.error("[/api/sell/update-status] Supabase error:", error?.message);
      return NextResponse.json({ success: false, error: error?.message ?? "Not found" }, { status: 500 });
    }

    // 4. Send status-specific emails (non-blocking)
    const leadRef = `MOBIQ-${lead.id}`;

    if (status === "picked_up") {
      sendPickupEmail({
        leadId:          leadRef,
        customerName:    lead.customer_name,
        customerEmail:   lead.customer_email,
        customerPhone:   lead.customer_phone,
        customerAddress: lead.customer_address,
        modelName:       lead.model_name,
        variantName:     lead.variant_name,
        quotedPrice:     lead.quoted_price,
        city:            lead.city,
      }).catch((err) => {
        console.error("[update-status] Pickup email failed:", err);
      });
    }

    if (status === "completed") {
      // Use the actual_amount if saved, otherwise fall back to quoted_price
      const paidAmount = actualAmount ?? lead.quoted_price;
      sendCompletedEmail({
        leadId:        leadRef,
        customerName:  lead.customer_name,
        customerEmail: lead.customer_email,
        modelName:     lead.model_name,
        variantName:   lead.variant_name,
        quotedPrice:   paidAmount,
      }).catch((err) => {
        console.error("[update-status] Completion email failed:", err);
      });

      // ── Auto-add to device inventory (upsert to avoid duplicates if re-saved) ──
      supabase.from("device_inventory").upsert(
        {
          sell_lead_id:   lead.id,
          brand_id:       lead.brand_id,
          brand_name:     lead.brand_name,
          model_id:       lead.model_id,
          model_name:     lead.model_name,
          variant_name:   lead.variant_name,
          acquired_price: paidAmount,
          condition_summary: buildConditionSummary(lead),
          status:         "in_stock",
          acquired_at:    new Date().toISOString(),
        },
        { onConflict: "sell_lead_id", ignoreDuplicates: false }
      ).then(({ error: invErr }) => {
        if (invErr) console.error("[update-status] Inventory insert failed:", invErr.message);
        else console.log(`[update-status] Inventory updated for lead ${lead.id}`);
      });
    }

    return NextResponse.json({ success: true, lead });

  } catch (err) {
    console.error("[/api/sell/update-status] Error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
