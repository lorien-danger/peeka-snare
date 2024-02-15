import { supabase } from "./supabase.ts";
import { sendEmail } from "./resend.ts";
import type { CodeTriggerWithTrackingCode } from "./types/supabase.ts";

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
    // .eq("ip_address", remoteAddr.hostname)
    .select("*, tracking_code(*)")
    .returns<CodeTriggerWithTrackingCode[]>()
    .single();

  if (!data || !data.tracking_code || error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }

  console.log("Captured", data);
  await sendEmail(data);
  return new Response("Verified", { status: 200 });
});
