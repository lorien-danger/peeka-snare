import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { load } from "https://deno.land/std@0.215.0/dotenv/mod.ts";
import type { Database } from "./types/supabase.ts";

const env = await load();

const SUPABASE_SERVICE_KEY =
  Deno.env.get("SUPABASE_SERVICE_KEY") || env.SUPABASE_SERVICE_KEY;

export const supabase = createClient<Database>(
  "https://chvktpewqvijkcpbiobr.supabase.co",
  SUPABASE_SERVICE_KEY
);
