import { NextResponse } from "next/server";

/**
 * Debug endpoint — hit this to test Supabase + SMTP independently.
 * URL: GET /api/sell/debug
 * Remove this file before deploying to production!
 */
export async function GET() {
  const results: Record<string, string | boolean | number> = {};

  // ── 1. Check env vars are loaded ──
  results.env_supabase_url   = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  results.env_supabase_key   = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  results.env_smtp_host      = process.env.SMTP_HOST ?? "MISSING";
  results.env_smtp_user      = process.env.SMTP_USER ?? "MISSING";
  results.env_smtp_pass_set  = !!process.env.SMTP_PASS;

  // ── 2. Test Supabase connection + table existence ──
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    // Try selecting from sell_leads — this will error if table doesn't exist
    const { error: selectErr } = await sb.from("sell_leads").select("id").limit(1);
    results.supabase_connected   = !selectErr;
    results.supabase_table_error = selectErr ? selectErr.message : "none";

    if (!selectErr) {
      // Try a dummy insert with a test record (then delete it)
      const testRow = {
        customer_name: "__debug_test__",
        customer_phone: "0000000000",
        customer_email: "debug@test.com",
        customer_address: "test",
        brand_id: "test", brand_name: "Test",
        model_id: "test", model_name: "Test",
        variant_id: "test", variant_name: "Test",
        city: "Test", device_age: "0_3",
        mobile_turns_on: true,
        has_original_box: false, has_original_charger: false,
        has_original_invoice: false, under_warranty: false,
        hardware_defects: [], software_defects: [],
        quoted_price: 0, status: "pending",
      };
      const { data: insertData, error: insertErr } = await sb
        .from("sell_leads").insert(testRow).select("id").single();
      results.supabase_insert_ok = !insertErr;
      results.supabase_insert_error = insertErr ? insertErr.message : "none";
      // Clean up
      if (insertData?.id) {
        await sb.from("sell_leads").delete().eq("id", insertData.id);
        results.supabase_test_row_cleaned = true;
      }
    }
  } catch (e: unknown) {
    results.supabase_connected = false;
    results.supabase_error     = e instanceof Error ? e.message : String(e);
  }

  // ── 3. Test SMTP connection ──
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   parseInt(process.env.SMTP_PORT ?? "465"),
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    results.smtp_connected = true;
    results.smtp_error     = "none";
  } catch (e: unknown) {
    results.smtp_connected = false;
    results.smtp_error     = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results, { status: 200 });
}
