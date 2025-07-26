"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function TableOfContentsPage() {
  const [topic, setTopic] = useState("");
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setHeadings([]);

    try {
      const res = await fetch("/api/table-of-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setHeadings(data.headings || []);
    } catch (err) {
      toast.error("Failed to generate table of contents");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    const text = headings.join("\n");
    navigator.clipboard.writeText(text);
    toast.success("All headings copied!");
  };

  const handleDownload = () => {
    const text = headings.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic}-toc.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        🧭 Table of Contents Generator
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
        <Input
          placeholder="Enter your blog topic or intro paragraph..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full max-w-xl"
        />
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {headings.length > 0 && (
        <Card className="border-l-4 border-green-500">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">
              📚 Suggested Table of Contents
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyAll}>
                Copy All
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              {headings.map((heading, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{heading}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(heading);
                      toast.success("Copied");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
