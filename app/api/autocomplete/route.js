import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  const apiKey = process.env.SERP_API_KEY;

  if (!keyword || !apiKey) {
    return Response.json(
      { error: "Missing keyword or API key" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: keyword,
        engine: "google_autocomplete",
        api_key: apiKey,
      },
    });

    const suggestions = response.data.suggestions?.map((s) => s.value) || [];

    return Response.json({ suggestions });
  } catch (error) {
    console.error("Autocomplete API error:", error?.message);
    return Response.json(
      { error: "Failed to fetch autocomplete" },
      { status: 500 }
    );
  }
}
