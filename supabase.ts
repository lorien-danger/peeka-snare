import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { load } from "https://deno.land/std@0.215.0/dotenv/mod.ts";
import type { Database } from "./types/supabase.ts";

const { SUPABASE_SERVICE_KEY } = await load();

export const supabase = createClient<Database>(
  "https://chvktpewqvijkcpbiobr.supabase.co",
  SUPABASE_SERVICE_KEY
);
