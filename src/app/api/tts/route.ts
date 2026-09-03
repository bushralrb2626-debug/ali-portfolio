import { NextRequest, NextResponse } from "next/server";

const ALLOWED = new Set(["en", "it", "ur", "pa", "hi"]);

export async function GET(request: NextRequest) {
  const q = String(request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 160);
  const tlRaw = String(request.nextUrl.searchParams.get("tl") ?? "en").toLowerCase();
  const tl = ALLOWED.has(tlRaw) ? tlRaw : "en";
  if (!q) return new NextResponse("Missing text", { status: 400 });

  const urls = [
    "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" +
      encodeURIComponent(tl) +
      "&q=" +
      encodeURIComponent(q),
    "https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=" +
      encodeURIComponent(tl) +
      "&q=" +
      encodeURIComponent(q),
  ];
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.8",
    Referer: "https://translate.google.com/",
  };

  try {
    for (const url of urls) {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": res.headers.get("content-type") || "audio/mpeg",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
    return new NextResponse("TTS unavailable", { status: 502 });
  } catch {
    return new NextResponse("TTS failed", { status: 502 });
  }
}
