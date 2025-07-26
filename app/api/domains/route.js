import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing domain" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://${domain}`);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $("title").text() || "No title found";
    const description =
      $('meta[name="description"]').attr("content") || "No description found";
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    return NextResponse.json({
      title,
      description,
      favicon: favicon.startsWith("http")
        ? favicon
        : `https://${domain}${favicon}`,
      url: `https://${domain}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch domain info" },
      { status: 500 }
    );
  }
}
