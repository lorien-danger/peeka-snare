import { load } from "https://deno.land/std@0.215.0/dotenv/mod.ts";
import type { CodeTriggerWithTrackingCode } from "./types/supabase.ts";

const { RESEND_API_KEY } = await load();

const generateEmail = (data: CodeTriggerWithTrackingCode) => {
  return `
            <h1>New Trigger: (${data.tracking_code.service})</h1>
            <div>
                <h2>Identity Information</h2>
                <p><strong>UUID:</strong> ${data.uuid}</p>
                <p><strong>Triggered At:</strong> ${data.triggered_at}</p>
                <p><strong>Tracking Code:</strong> ${data.tracking_code}</p>
                <p><strong>IP Address:</strong> ${data.ip_address}</p>
                <p><strong>Ephemeral Port:</strong> ${data.ephemeral_port}</p>
                <p><strong>Browser Fingerprint:</strong> ${
                  data.browser_fingerprint
                }</p>
            </div>
            <div>
                <h2>Location Details</h2>
                <p><strong>Country Code:</strong> ${data.country_code}</p>
                <p><strong>Region:</strong> ${data.region}</p>
                <p><strong>City:</strong> ${data.city}</p>
                <p><strong>Latitude:</strong> ${data.latitude}</p>
                <p><strong>Longitude:</strong> ${data.longitude}</p>
            </div>
            <div>
                <h2>Device and Browser Information</h2>
                <p><strong>Operating System:</strong> ${
                  data.operating_system
                }</p>
                <p><strong>Browser:</strong> ${data.browser}</p>
                <p><strong>Device Brand:</strong> ${data.device_brand}</p>
                <p><strong>Device Model:</strong> ${data.device_model}</p>
                <p><strong>User Agent:</strong> ${data.user_agent}</p>
            </div>
            <div>
                <h2>Security Information</h2>
                <p><strong>Is Mobile:</strong> ${
                  data.is_mobile ? "Yes" : "No"
                }</p>
                <p><strong>Proxy:</strong> ${data.proxy ? "Yes" : "No"}</p>
                <p><strong>VPN:</strong> ${data.vpn ? "Yes" : "No"}</p>
                <p><strong>Tor:</strong> ${data.tor ? "Yes" : "No"}</p>
                <p><strong>Is Bot:</strong> ${data.is_bot ? "Yes" : "No"}</p>
            </div>
        `;
};

export const sendEmail = async (data: CodeTriggerWithTrackingCode) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${data.tracking_code.service} <${data.tracking_code.service}@send.cybertrace.com.au>`,
      to: ["lorien@cybertrace.com.au"],
      subject: `New Trigger: (${data.tracking_code.service})`,
      html: generateEmail(data),
    }),
  });

  if (!response.ok) {
    console.error("Failed to send email", response);
  }

  console.log("Email sent successfully");
};
