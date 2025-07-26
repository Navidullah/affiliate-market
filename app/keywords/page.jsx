"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Papa from "papaparse";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SearchPage() {
  const { data: session } = useSession();
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setData(null);
    setTrendData([]);

    try {
      const res = await fetch(
        `/api/keywords?keyword=${encodeURIComponent(keyword)}`
      );
      const result = await res.json();
      setData(result);

      const trendRes = await fetch(
        `/api/popularity?keyword=${encodeURIComponent(keyword)}`
      );
      const trendResult = await trendRes.json();
      const formatted =
        trendResult?.trends?.map((item) => ({
          date: item.date,
          value: item[keyword] ?? 0,
        })) || [];
      setTrendData(formatted);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    const combined = {
      keyword,
      relatedQuestions: data.related_questions?.map((q) => q.question),
      relatedSearches: data.related_searches?.map((r) => r.query),
      topResults: data.organic_results?.map((r) => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
      })),
    };
    const csv = Papa.unparse(combined, { quotes: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${keyword}_seo_report.csv`;
    link.click();
  };

  const saveKeyword = async () => {
    if (!session || !data) return;
    try {
      const res = await fetch("/api/savedkeywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          userEmail: session.user.email,
          related_questions: data.related_questions,
          related_searches: data.related_searches,
          organic_results: data.organic_results,
        }),
      });
      const result = await res.json();
      if (res.ok) alert("Keyword result saved successfully");
      else alert(result.error || "Failed to save");
    } catch (err) {
      console.error("Save failed", err);
      alert("Error saving result");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          🔍 SEO Keyword Research Tool
        </h1>
        {session ? (
          <div className="text-sm flex items-center gap-3">
            <span>Hi, {session.user.name}</span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        ) : (
          <Button onClick={() => signIn("google")}>Sign in</Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
        <Input
          placeholder="Enter a keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full max-w-md"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
        {data && (
          <>
            <Button variant="outline" onClick={exportToCSV}>
              Export CSV
            </Button>
            {session && (
              <Button variant="secondary" onClick={saveKeyword}>
                💾 Save Result
              </Button>
            )}
          </>
        )}
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {data.search_information && (
              <Card>
                <CardHeader>
                  <CardTitle>📊 Keyword Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Keyword:</strong>{" "}
                    {data.search_information.query_displayed}
                  </p>
                  <p>
                    <strong>Total Results:</strong>{" "}
                    {data.search_information.total_results?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Search Time:</strong>{" "}
                    {data.search_information.time_taken_displayed}
                  </p>
                </CardContent>
              </Card>
            )}

            {data.related_questions?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>💬 Related Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4">
                    {data.related_questions.map((q, i) => (
                      <li key={i}>{q.question}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {data.organic_results?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>🔗 Organic Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.organic_results.slice(0, 5).map((r, i) => (
                    <div key={i}>
                      <a
                        href={r.link}
                        target="_blank"
                        className="text-blue-600 underline font-medium"
                      >
                        {r.title}
                      </a>
                      <p className="text-muted-foreground text-sm">
                        {r.snippet}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {trendData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>📈 Google Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {data.related_searches?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>🔍 Related Searches</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {data.related_searches.map((r, i) => (
                      <li key={i}>
                        <a
                          href={r.link}
                          className="text-blue-600 underline"
                          target="_blank"
                        >
                          {r.query}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
