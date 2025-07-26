"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//import "./styles.css"; // scoped fallback styles

export default function PopularityPage() {
  const [keyword, setKeyword] = useState("");
  const [trendData, setTrendData] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTrendData([]);

    try {
      const res = await fetch(
        `/api/popularity?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      setTrendData(data.trends || []);
      setKeywords(data.keywords || []);
    } catch (err) {
      console.error("Failed to fetch trend data", err);
    } finally {
      setLoading(false);
    }
  };

  const exportChartAsImage = async () => {
    const chartElement = document.getElementById("trend-chart");

    // Clone the chart element
    const clone = chartElement.cloneNode(true);

    // Create a wrapper to isolate it from the DOM
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "-10000px"; // Hide off-screen
    wrapper.style.left = "-10000px";
    wrapper.style.backgroundColor = "#ffffff";

    // Apply fallback RGB CSS variables inline to clone
    const fallbackStyles = {
      "--background": "rgb(255, 255, 255)",
      "--foreground": "rgb(38, 38, 38)",
      "--card": "rgb(255, 255, 255)",
      "--card-foreground": "rgb(38, 38, 38)",
      "--border": "rgb(235, 235, 235)",
      "--ring": "rgb(180, 180, 180)",
      "--chart-1": "rgb(250, 180, 80)",
      "--chart-2": "rgb(100, 170, 255)",
      "--chart-3": "rgb(70, 110, 255)",
      "--chart-4": "rgb(255, 170, 70)",
      "--chart-5": "rgb(255, 140, 50)",
    };

    for (const [key, value] of Object.entries(fallbackStyles)) {
      clone.style.setProperty(key, value);
    }

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Wait a tick for rendering
    await new Promise((res) => setTimeout(res, 50));

    // Capture screenshot
    const canvas = await html2canvas(clone, {
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    // Remove cloned element
    document.body.removeChild(wrapper);

    // Create PDF from canvas
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("trend-chart.pdf");
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📈 Keyword Popularity Trends
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <Input
          placeholder="Enter keywords (comma-separated)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Get Trends"}
        </Button>
        {trendData.length > 0 && (
          <Button variant="outline" onClick={exportChartAsImage}>
            Export Chart
          </Button>
        )}
      </div>

      {!loading && trendData.length === 0 && (
        <p className="text-center text-muted-foreground">
          No trend data available. Try different keywords.
        </p>
      )}

      {trendData.length > 0 && (
        <Card id="trend-chart">
          <CardHeader>
            <CardTitle>📊 Interest Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {keywords.map((kw, idx) => (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={
                      [
                        "#fab450", // chart-1
                        "#64aaff", // chart-2
                        "#466eff", // chart-3
                        "#ffaa46", // chart-4
                        "#ff8c32", // chart-5
                      ][idx % 5]
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
