import { load } from "https://deno.land/std@0.215.0/dotenv/mod.ts";

const env = await load();

const IPQS_API_KEY = Deno.env.get("IPQS_API_KEY") || env.IPQS_API_KEY;

interface IPQualityScoreData {
  success: boolean;
  message: string;
  fraud_score: number;
  country_code: string;
  region: string;
  city: string;
  ISP: string;
  ASN: number;
  operating_system: string;
  browser: string;
  organization: string;
  is_crawler: boolean;
  timezone: string;
  mobile: boolean;
  host: string;
  proxy: boolean;
  vpn: boolean;
  tor: boolean;
  active_vpn: boolean;
  active_tor: boolean;
  device_brand: string;
  device_model: string;
  recent_abuse: boolean;
  bot_status: boolean;
  connection_type: string;
  abuse_velocity: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  request_id: string;
}

interface IPQualityScoreRequest {
  requestTime: number;
  data: IPQualityScoreData;
}

const recentQueries = new Map<string, IPQualityScoreRequest>();

const fetchIPQualityScore = async (
  ipAddress: string,
  userAgent: string | null,
  userLang: string | null
): Promise<IPQualityScoreData> => {
  // Check if the data has been fetched recently
  const recentQuery = recentQueries.get(ipAddress);

  // If the data has been queried in the last 24 hours, return it
  if (recentQuery) {
    const currentTime = new Date().getTime();
    const requestTime = recentQuery.requestTime;
    const timeDifference = currentTime - requestTime;
    const oneDay = 86400000;

    if (timeDifference < oneDay) {
      return recentQuery.data;
    }
  }

  const BASE_URL = `https://www.ipqualityscore.com/api/json/ip/${IPQS_API_KEY}/${ipAddress}`;
  const QUERY_PARAMS = `?strictness=0&allow_public_access_points=true&user_agent=${
    userAgent || ""
  }&user_language=${userLang || ""};`;

  const request = await fetch(BASE_URL + QUERY_PARAMS);
  const data = await request.json();

  // Store the data in the map
  recentQueries.set(ipAddress, {
    requestTime: new Date().getTime(),
    data,
  });

  return data;
};

export { fetchIPQualityScore };
export type { IPQualityScoreData };
