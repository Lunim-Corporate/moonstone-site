import { createClient } from "@supabase/supabase-js";

// Prefer a server-only service role key for server-side operations (keeps RLS working)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isServer = typeof window === "undefined";

const keyToUse = isServer && supabaseServiceRoleKey ? supabaseServiceRoleKey : supabaseAnonKey;

if (!supabaseUrl || !keyToUse) {
  throw new Error("Missing Supabase environment variables: set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY (client) or SUPABASE_SERVICE_ROLE_KEY (server)");
}

export const supabase = createClient(supabaseUrl, keyToUse, {
  auth: { persistSession: false },
});