import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — safe for both server and client components
export const supabase = createClient(url, key);

// ── SQL to run once in Supabase SQL editor ──────────────────────────────────
//
// create table audits (
//   id          uuid primary key default gen_random_uuid(),
//   created_at  timestamptz default now(),
//   email       text not null,
//   company     text,
//   tools       jsonb not null,
//   result      jsonb not null,
//   savings     integer not null,
//   public_id   text unique not null default encode(gen_random_bytes(8), 'hex')
// );
//
// create index on audits (public_id);
// alter table audits enable row level security;
// -- allow anonymous inserts (lead capture) + reads by public_id
// create policy "insert audits" on audits for insert with check (true);
// create policy "read by public_id" on audits for select using (true);
// ────────────────────────────────────────────────────────────────────────────
