"use client";

import { useState } from "react";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `/api/keywords?keyword=${encodeURIComponent(keyword)}`
      );
      const result = await res.json();
      console.log("API response:", result);
      setData(result);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🔍 SEO Keyword Research Tool</h1>

      <div className="flex gap-4 mb-6">
        <input
          className="px-4 py-2 rounded text-black w-64"
          placeholder="Enter a keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Display Results */}
      {data && (
        <div className="space-y-6">
          {/* Knowledge Graph */}
          {data.knowledge_graph && (
            <div className="bg-white text-black p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">📘 Knowledge Graph</h2>
              <p>
                <strong>Name:</strong> {data.knowledge_graph.title}
              </p>
              <p>
                <strong>Type:</strong> {data.knowledge_graph.type}
              </p>
              <p>
                <strong>Description:</strong> {data.knowledge_graph.description}
              </p>
              <a
                className="text-blue-600 underline"
                href={data.knowledge_graph.source?.link}
                target="_blank"
              >
                Source: {data.knowledge_graph.source?.name}
              </a>
            </div>
          )}

          {/* Related Questions */}
          {data.related_questions && data.related_questions.length > 0 && (
            <div className="bg-white text-black p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">💬 Related Questions</h2>
              <ul className="list-disc list-inside space-y-1">
                {data.related_questions.map((q, i) => (
                  <li key={i}>{q.question}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Organic Results */}
          {data.organic_results && data.organic_results.length > 0 && (
            <div className="bg-white text-black p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-2">🔗 Organic Results</h2>
              <ul className="space-y-3">
                {data.organic_results.slice(0, 5).map((item, i) => (
                  <li key={i}>
                    <a
                      className="text-blue-600 underline"
                      href={item.link}
                      target="_blank"
                    >
                      {item.title}
                    </a>
                    <p className="text-sm">{item.snippet}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
