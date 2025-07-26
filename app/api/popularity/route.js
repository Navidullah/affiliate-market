import { NextResponse } from "next/server";
import googleTrends from "google-trends-api";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keywordParam = searchParams.get("keyword");

  if (!keywordParam) {
    return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
  }

  // Split keywords by comma, trim whitespace
  const keywords = keywordParam
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (keywords.length === 0) {
    return NextResponse.json(
      { error: "No valid keywords provided" },
      { status: 400 }
    );
  }

  try {
    const results = await googleTrends.interestOverTime({
      keyword: keywords,
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
      geo: "US",
    });

    const data = JSON.parse(results);

    const chartData =
      data?.default?.timelineData?.map((entry) => {
        const row = {
          date: new Date(entry.time * 1000).toLocaleDateString(),
        };
        entry.value.forEach((val, index) => {
          row[keywords[index]] = val;
        });
        return row;
      }) || [];

    return NextResponse.json({ trends: chartData, keywords });
  } catch (error) {
    console.error("Google Trends Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
