import { createClient } from "@supabase/supabase-js";

// Ensure URL does not contain trailing slash or /rest/v1 suffix which causes PGRST125 in supabase-js
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseUrl = rawUrl ? rawUrl.replace(/\/+$/, "").replace(/\/rest\/v1\/?$/, "") : "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !anonKey || !serviceKey) {
  throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY");
}

// Public client — respects Row Level Security
export const supabase = createClient(supabaseUrl, anonKey);

// Admin client — bypasses Row Level Security
export const supabaseAdmin = createClient(supabaseUrl, serviceKey);
