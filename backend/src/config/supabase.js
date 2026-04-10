import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const PRIMARY_DB = String(process.env.PRIMARY_DB || "mongo").trim().toLowerCase();

function isPlaceholder(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return true;

  const placeholderMarkers = [
    "your-project-ref",
    "your_supabase",
    "your service role",
    "replace_me",
    "changeme",
    "example",
    "placeholder"
  ];

  return placeholderMarkers.some(marker => normalized.includes(marker));
}

export function getMissingSupabaseConfig() {
  const missing = [];
  if (isPlaceholder(SUPABASE_URL)) missing.push("SUPABASE_URL");
  if (isPlaceholder(SUPABASE_SERVICE_ROLE_KEY)) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}

export function hasSupabaseConfig() {
  return PRIMARY_DB !== "mongo" && getMissingSupabaseConfig().length === 0;
}

export function getDatabaseMode() {
  return hasSupabaseConfig() ? "supabase" : "local";
}

export const supabase = hasSupabaseConfig()
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;
