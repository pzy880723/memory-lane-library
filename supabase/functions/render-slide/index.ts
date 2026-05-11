// Server-side slide screenshot via Browserless.io
// Renders /print/N at 1920x1080 @2x and returns JPEG bytes.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BROWSERLESS_TOKEN = Deno.env.get("BROWSERLESS_TOKEN");
const BROWSERLESS_BASE =
  Deno.env.get("BROWSERLESS_BASE_URL") ?? "https://production-sfo.browserless.io";

interface Body {
  url: string;
  width?: number;
  height?: number;
  pixelRatio?: number;
  quality?: number;
  waitMs?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!BROWSERLESS_TOKEN) {
    return new Response(
      JSON.stringify({ error: "BROWSERLESS_TOKEN not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = body.url;
  if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return new Response(JSON.stringify({ error: "Missing or invalid `url`" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const width = body.width ?? 1920;
  const height = body.height ?? 1080;
  const pixelRatio = body.pixelRatio ?? 2;
  const quality = body.quality ?? 92;
  const waitMs = body.waitMs ?? 300;

  const basePayload = {
    url,
    options: { type: "jpeg", quality, fullPage: false, omitBackground: false },
    viewport: { width, height, deviceScaleFactor: pixelRatio },
    gotoOptions: { waitUntil: "networkidle0", timeout: 90000 },
    waitForTimeout: waitMs,
  };
  // 首选:等 Print 页 data-ready=1
  const strictPayload = {
    ...basePayload,
    waitForSelector: { selector: "body[data-ready='1']", timeout: 90000 },
  };
  // 兜底:仅靠 networkidle0 + 多等 2.5s 让字体/图片落地
  const lenientPayload = { ...basePayload, waitForTimeout: 2500 };

  const endpoint = `${BROWSERLESS_BASE}/screenshot?token=${encodeURIComponent(BROWSERLESS_TOKEN)}`;
  const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];

  try {
    let lastStatus = 0;
    let lastText = "";
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      // 最后一次重试改用宽松模式,避免 data-ready 卡死
      const payload = attempt === RETRY_DELAYS_MS.length ? lenientPayload : strictPayload;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "image/jpeg",
            "Cache-Control": "no-store",
          },
        });
      }

      lastStatus = resp.status;
      lastText = await resp.text();
      const isTimeout = lastText.includes("TimeoutError");
      const retriable = resp.status === 429 || resp.status === 503 || resp.status === 500 || isTimeout;
      if (!retriable || attempt === RETRY_DELAYS_MS.length) break;
      const delay = RETRY_DELAYS_MS[attempt];
      console.warn(`Browserless ${resp.status}, retrying in ${delay}ms (attempt ${attempt + 1})`);
      await new Promise((r) => setTimeout(r, delay));
    }

    console.error("Browserless error", lastStatus, lastText);
    return new Response(
      JSON.stringify({ error: `Browserless ${lastStatus}: ${lastText.slice(0, 500)}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

    console.error("Browserless error", lastStatus, lastText);
    return new Response(
      JSON.stringify({ error: `Browserless ${lastStatus}: ${lastText.slice(0, 500)}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("render-slide failed", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
