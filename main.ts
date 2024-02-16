import { supabase } from "./supabase.ts";
import { sendEmail } from "./resend.ts";
import { fetchIPQualityScore } from "./vpn.ts";
import type { CodeTriggerWithTrackingCode } from "./types/supabase.ts";

const handleAuth = async (
  url: URL,
  remoteHostname: string,
  remotePort: number
) => {
  const uuid = url.searchParams.get("uuid");
  const fingerprint = url.searchParams.get("key");

  if (!uuid || !fingerprint) {
    return new Response("Invalid request", { status: 400 });
  }

  console.log("Received", uuid, fingerprint, remoteHostname, remotePort);

  const { data, error } = await supabase
    .from("code_trigger")
    .update({
      browser_fingerprint: fingerprint,
      ephemeral_port: remotePort,
    })
    .eq("uuid", uuid)
    .eq("ip_address", remoteHostname)
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
};

const handleImage = async (
  request: Request,
  url: URL,
  remoteHostname: string,
  remotePort: number
) => {
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Invalid request", { status: 400 });
  }

  const userAgent = request.headers.get("User-Agent");
  const userLanguage = request.headers.get("Accept-Language");

  const userInfo = await fetchIPQualityScore(
    remoteHostname,
    userAgent,
    userLanguage
  );

  const { data: entry } = await supabase
    .from("code_trigger")
    .insert({
      ip_address: remoteHostname,
      tracking_code_id: code,
      country_code: userInfo.country_code,
      region: userInfo.region,
      city: userInfo.city,
      isp: userInfo.ISP,
      operating_system: userInfo.operating_system,
      browser: userInfo.browser,
      is_mobile: userInfo.mobile,
      proxy: userInfo.proxy,
      vpn: userInfo.vpn,
      tor: userInfo.tor,
      device_brand: userInfo.device_brand,
      device_model: userInfo.device_model,
      is_bot: userInfo.bot_status,
      latitude: userInfo.latitude,
      longitude: userInfo.longitude,
      user_agent: userAgent,
      ephemeral_port: remotePort,
    })
    .eq("tracking_code_id", code)
    .select("*, tracking_code(*)")
    .returns<CodeTriggerWithTrackingCode[]>()
    .single();

  if (!entry) {
    return new Response("Expired link", { status: 400 });
  }

  console.log("Captured", entry);
  await sendEmail(entry);
  return await fetch(
    "https://user-images.githubusercontent.com/47315479/81145216-7fbd8700-8f7e-11ea-9d49-bd5fb4a888f1.png"
  );
};

Deno.serve(async (request, info) => {
  const url = new URL(request.url);

  const { remoteAddr } = info;

  if (url.pathname === "/") {
    return await handleAuth(url, remoteAddr.hostname, remoteAddr.port);
  } else if (url.pathname === "/image") {
    return await handleImage(
      request,
      url,
      remoteAddr.hostname,
      remoteAddr.port
    );
  }

  return new Response("Not found", { status: 404 });
});
