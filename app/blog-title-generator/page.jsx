"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function BlogTitleGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTitles([]);

    try {
      const res = await fetch("/api/blog-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setTitles(data.titles || []);
    } catch (err) {
      toast.error("Failed to generate titles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        ✍️ Blog Title Generator
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
        <Input
          placeholder="Enter your blog topic or keywords..."
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

      {titles.length > 0 && (
        <div className="grid gap-4">
          {titles.map((title, i) => (
            <Card key={i} className="border-l-4 border-blue-500">
              <CardHeader className="flex-row justify-between items-center">
                <CardTitle className="text-base font-medium text-wrap max-w-[90%]">
                  {title}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(title);
                    toast.success("Title copied!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
