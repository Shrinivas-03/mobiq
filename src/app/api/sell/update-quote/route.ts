import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentAdmin } from "@/lib/auth";
import { sendQuoteUpdatedEmail } from "@/lib/email";

// ──────────────────────────────────────────────
// POST — Update the quotation for a custom / "other mobile" lead
// and email the customer about the new quote.
// ──────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // 1. Verify admin
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { id, quotedPrice } = body as { id?: string; quotedPrice?: number | string };
    const price = Math.round(Number(quotedPrice));

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing lead id" }, { status: 400 });
    }
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid quotation amount greater than 0" },
        { status: 400 }
      );
    }

    // 3. Save quotation on the lead
    const { data: lead, error } = await supabaseAdmin
      .from("sell_leads")
      .update({ quoted_price: price })
      .eq("id", id)
      .select()
      .single();

    if (error || !lead) {
      console.error("[/api/sell/update-quote] Supabase error:", error?.message);
      return NextResponse.json(
        { success: false, error: error?.message ?? "Lead not found" },
        { status: 500 }
      );
    }

    // 4. Email the customer about the updated quotation.
    // A failed email must not undo the saved quotation.
    let emailSent = false;
    try {
      await sendQuoteUpdatedEmail({
        leadId:       `QMOBILES-${lead.id}`,
        customerName: lead.customer_name,
        customerEmail: lead.customer_email,
        brandName:    lead.brand_name,
        modelName:    lead.model_name,
        variantName:  lead.variant_name,
        quotedPrice:  lead.quoted_price,
      });
      emailSent = true;
    } catch (emailErr) {
      console.error("[/api/sell/update-quote] Email sending failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      lead,
      emailSent,
      message: emailSent
        ? "Quotation saved and emailed to the customer."
        : "Quotation saved, but the email could not be sent.",
    });
  } catch (err) {
    console.error("[/api/sell/update-quote] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
