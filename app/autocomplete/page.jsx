"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AutocompletePage() {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!term.trim()) return;
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch(`/api/autocomplete?query=${term}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🧠 Autocomplete Suggestions
      </h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <Input
          placeholder="Start typing a keyword..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? "Loading..." : "Get Suggestions"}
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-10 rounded" />
          <Skeleton className="h-10 rounded" />
        </div>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((item, i) => (
              <div key={i} className="text-muted-foreground border-b pb-2">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
