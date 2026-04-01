# Admin Users — Supabase Table Setup

## Step 1: Run This SQL in Supabase SQL Editor

```sql
-- ──────────────────────────────────────────────
-- admin_users: Stores MobiQ admin credentials
-- ──────────────────────────────────────────────
create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Credentials
  email         text not null unique,
  password_hash text not null,   -- bcrypt hash (cost 12) — NEVER store plain text

  -- Profile
  name          text not null,
  role          text not null default 'staff'
    check (role in ('super_admin', 'admin', 'staff')),

  -- Status
  is_active     boolean not null default true,
  last_login    timestamptz
);

-- Indexes
create unique index idx_admin_users_email on public.admin_users (lower(email));
create index        idx_admin_users_role  on public.admin_users (role);

-- Row Level Security
alter table public.admin_users enable row level security;

-- Only service_role (server-side API) can read/write
create policy "Service role full access"
  on public.admin_users for all
  to service_role
  using (true) with check (true);
```

---

## Step 2: Create Your First Admin User

You cannot insert a bcrypt password directly in SQL, so use this **Node.js script** to generate the hash, then insert it.

### Option A: Run in terminal (quick)

```bash
# In d:\mobiq directory
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('YourPassword123!', 12);
console.log('Password hash:', hash);
"
```

Copy the printed hash. Then run this in Supabase SQL Editor (replace the placeholders):

```sql
insert into public.admin_users (email, password_hash, name, role)
values (
  'admin@themobbiq.com',
  '$2a$12$PASTE_YOUR_HASH_HERE',
  'Admin User',
  'super_admin'
);
```

### Option B: Create a one-time seed endpoint (easier)

Hit this URL once to create the admin, then delete the file:

```
GET /api/admin/seed?name=Admin&email=admin@themobbiq.com&password=YourPassword123!&secret=SEED_SECRET
```

Create `src/app/api/admin/seed/route.ts`:

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Protect with a secret to prevent unauthorized use
  if (searchParams.get("secret") !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const name     = searchParams.get("name")     ?? "Admin";
  const email    = searchParams.get("email")    ?? "";
  const password = searchParams.get("password") ?? "";
  const role     = searchParams.get("role")     ?? "super_admin";

  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ email: email.toLowerCase(), password_hash: hash, name, role })
    .select("id, email, name, role")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, admin: data });
}
```

Add to `.env.local`:
```
SEED_SECRET=some-random-string-only-you-know
```

> [!CAUTION]
> **Delete `src/app/api/admin/seed/route.ts` immediately after creating your admin user!** This endpoint is intentionally unprotected by full auth.

---

## API Endpoints Reference

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/admin/login` | Login with `{ email, password }` → sets httpOnly JWT cookie |
| `POST` | `/api/admin/logout` | Clears the session cookie |
| `GET`  | `/api/admin/me` | Returns current session if logged in |

### Login Request
```json
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@themobbiq.com",
  "password": "YourPassword123!"
}
```

### Login Response (success)
```json
{
  "success": true,
  "admin": {
    "id": "uuid...",
    "email": "admin@themobbiq.com",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```

---

## Add JWT_SECRET to `.env.local`

Already done! But for production, replace with a long random string:
```env
JWT_SECRET=<generate a 64-char random string>
```

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Table Column Reference

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Auto-generated primary key |
| `created_at` | `timestamptz` | Account creation timestamp |
| `email` | `text` | Admin email (unique, lowercase) |
| `password_hash` | `text` | bcrypt hash (cost=12) |
| `name` | `text` | Display name |
| `role` | `text` | `super_admin`, `admin`, or `staff` |
| `is_active` | `boolean` | Deactivate without deleting |
| `last_login` | `timestamptz` | Auto-updated on each login |
