import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");

    const apiKey = process.env.SERP_API_KEY;

    if (!keyword || !apiKey) {
      return Response.json(
        { error: "Missing keyword or API key" },
        { status: 400 }
      );
    }

    const serpRes = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: keyword,
        engine: "google",
        api_key: apiKey,
      },
    });

    const result = serpRes.data;

    return Response.json({
      search_information: result.search_information || null,
      knowledge_graph: result.knowledge_graph || null,
      related_questions: result.related_questions || [],
      related_searches: result.related_searches || [],
      organic_results: result.organic_results || [],
    });
  } catch (error) {
    console.error(
      "API ERROR:",
      error?.response?.data || error.message || error
    );
    return Response.json(
      { error: "Failed to fetch keyword data", details: error?.message },
      { status: 500 }
    );
  }
}
