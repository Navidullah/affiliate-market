"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DomainCheckerPage() {
  const [domain, setDomain] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`/api/domains?domain=${domain}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching domain info", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🌐 Domain Info Checker
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <Input
          type="text"
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Check"}
        </Button>
      </div>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>📄 Domain Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Title:</strong> {data.title}
            </p>
            <p>
              <strong>Description:</strong> {data.description}
            </p>
            <p className="flex items-center gap-2">
              <strong>Favicon:</strong>
              <img
                src={data.favicon}
                alt="Favicon"
                className="w-6 h-6 inline-block"
              />
            </p>
            <p>
              <strong>URL:</strong>{" "}
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {data.url}
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
