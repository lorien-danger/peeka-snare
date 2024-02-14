import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { Database } from "./types/supabase.ts";

const supabase = createClient<Database>(
  "https://chvktpewqvijkcpbiobr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodmt0cGV3cXZpamtjcGJpb2JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzI2MzUzMiwiZXhwIjoyMDIyODM5NTMyfQ.55dhiljE-2OFw7Bj049_9MDIt11GH-c2dWL4JsgS-Bk"
);

Deno.serve(async (request, info) => {
  const url = new URL(request.url);

  const uuid = url.searchParams.get("uuid");
  const fingerprint = url.searchParams.get("key");

  if (!uuid || !fingerprint) {
    return new Response("Invalid request", { status: 400 });
  }

  const { remoteAddr } = info;

  console.log("Received", uuid, fingerprint, remoteAddr);

  const { data, error } = await supabase
    .from("code_trigger")
    .update({
      browser_fingerprint: fingerprint,
      ephemeral_port: remoteAddr.port,
    })
    .eq("uuid", uuid)
    .eq("ip_address", remoteAddr.hostname)
    .select();

  if (!data || error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }

  console.log("Captured", data);
  return new Response("Verified", { status: 200 });
});
