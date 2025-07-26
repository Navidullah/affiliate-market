// app/api/table-of-contents/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    // Generate general-purpose SEO-friendly headings based on the topic
    const base = topic.trim().replace(/\.$/, "");

    const headings = [
      `1. Introduction to ${base}`,
      `2. Why ${base} Matters in Today’s World`,
      `3. Key Concepts and Definitions Related to ${base}`,
      `4. Practical Applications of ${base}`,
      `5. Common Challenges with ${base}`,
      `6. Tips for Mastering ${base}`,
      `7. Case Studies or Real-Life Examples of ${base}`,
      `8. SEO Strategies to Promote Blogs on ${base}`,
      `9. Summary & Final Thoughts on ${base}`,
      `10. FAQs About ${base}`,
    ];

    return NextResponse.json({ headings });
  } catch (err) {
    console.error("ToC Generator error:", err);
    return NextResponse.json(
      { error: "Failed to generate headings" },
      { status: 500 }
    );
  }
}
