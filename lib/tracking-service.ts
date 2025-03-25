import { v4 as uuidv4 } from "uuid";

// URL dell'API locale di tracciamento
const LOCAL_TRACKING_API = "/api/tracker";

// URL del tuo server di tracciamento esterno
const TRACKING_SERVER_URL = "https://tracking.ifortech.com/webhook/endpoint";

const getSessionId = (): string => {
  if (typeof window !== "undefined") {
    let sessionId = window.localStorage.getItem("integys_session_id");

    if (!sessionId) {
      sessionId = uuidv4();
      window.localStorage.setItem("integys_session_id", sessionId);
    }

    return sessionId;
  }

  return "";
};

interface TrackingData {
  path: string;
  referrer?: string;
  timestamp: number;
  session_id?: string;
  // Aggiungi altri dati di tracciamento che desideri raccogliere
}

export const trackPageView = async (path: string): Promise<void> => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get("referrer") || "direct_traffic";

    const data: TrackingData = {
      path,
      referrer,
      timestamp: Date.now(),
      session_id: sessionId,
    };

    // Facciamo la richiesta alla nostra API locale invece che direttamente
    // al server di tracciamento esterno
    const response = await fetch(LOCAL_TRACKING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to send tracking data", response.statusText);
    }

    const fd = new FormData();

    // Aggiungi i dati di tracciamento al FormData

    let dt = await response.json();
    Object.entries(dt.enrichedData).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    const response_remote = await fetch(TRACKING_SERVER_URL, {
      method: "POST",
      headers: {
        "X-Tracker-Webhook-Event": "PAGE_VIEW",
      },
      body: fd,
    });

    if (!response_remote.ok) {
      console.error(
        "Failed to send tracking data to external server",
        response_remote.statusText
      );
      return;
    }
  } catch (error) {
    console.error("Failed to send tracking data", error);
  }
};

interface ButtonClickData {
  id?: string;
  text: string;
  trackId?: string | null;
  className?: string;
  path: string;
  timestamp: string;
  session_id?: string;
}

export const trackButtonClick = async (
  buttonData: ButtonClickData
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    const data = {
      ...buttonData,
      session_id: sessionId,
      event_type: "button_click",
    };

    // Facciamo la richiesta alla nostra API locale invece che direttamente
    // al server di tracciamento esterno
    const response = await fetch(LOCAL_TRACKING_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("Failed to send tracking data", response.statusText);
    }

    const fd = new FormData();

    // Aggiungi i dati di tracciamento al FormData

    let dt = await response.json();
    Object.entries(dt.enrichedData).forEach(([key, value]) => {
      fd.append(key, value as string);
    });

    // Inviamo i dati tramite la nostra API locale
    const response_remote = await fetch(LOCAL_TRACKING_API, {
      method: "POST",
      headers: {
        "X-Tracking-Event-Type": "DID_PRESS_BUTTON",
      },
      body: fd,
      keepalive: true,
    });

    if (!response_remote.ok) {
      console.error(
        "Failed to send button tracking data",
        response_remote.statusText
      );
    }
  } catch (error) {
    console.error("Failed to send button tracking data", error);
  }
};
