import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { signAdminToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    // ── Basic validation ──
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // ── Fetch the admin user ──
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, name, role, is_active")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !admin) {
      // Generic message — don't reveal if email exists or not
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Check if account is active ──
    if (!admin.is_active) {
      return NextResponse.json(
        { success: false, error: "Your account has been deactivated. Contact support." },
        { status: 403 }
      );
    }

    // ── Verify password ──
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ── Update last_login timestamp ──
    await supabase
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    // ── Sign JWT and set httpOnly cookie ──
    const token = await signAdminToken({
      id:    admin.id,
      email: admin.email,
      name:  admin.name,
      role:  admin.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      admin: {
        id:    admin.id,
        email: admin.email,
        name:  admin.name,
        role:  admin.role,
      },
    });

  } catch (err) {
    console.error("[/api/admin/login] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
