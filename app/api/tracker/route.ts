import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Otteniamo i dati dalla richiesta del client
    const trackingData = await request.json();

    // Otteniamo l'IP reale dell'utente
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Otteniamo lo user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Arricchiamo i dati di tracciamento con IP e User Agent
    const enrichedData = {
      ...trackingData,
      ip_address: ip,
      user_agent: userAgent,
      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "none",
      utm_term: "none",
      utm_content: "none",
      element_id: "",
      custom_get_params: "",
      custom_post_params: "",
      url: trackingData.path || "",
      referer: trackingData.referrer || "direct_traffic",
    };

    return NextResponse.json({ success: true, enrichedData }, { status: 200 });
  } catch (error) {
    console.error("Error processing tracking data", error);
    return NextResponse.json({ success: false, error: error }, { status: 502 });
  }
}
