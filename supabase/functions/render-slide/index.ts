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

  const payload = {
    url,
    options: { type: "jpeg", quality, fullPage: false, omitBackground: false },
    viewport: { width, height, deviceScaleFactor: pixelRatio },
    gotoOptions: { waitUntil: "networkidle0", timeout: 60000 },
    // Print 路由就绪后会把 body[data-ready] 置 1
    waitForSelector: { selector: "body[data-ready='1']", timeout: 45000 },
    waitForTimeout: waitMs,
  };

  try {
    const resp = await fetch(
      `${BROWSERLESS_BASE}/screenshot?token=${encodeURIComponent(BROWSERLESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Browserless error", resp.status, text);
      return new Response(
        JSON.stringify({ error: `Browserless ${resp.status}: ${text.slice(0, 500)}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const buf = await resp.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("render-slide failed", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
