// app/api/blog-titles/route.js

import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const prompt = `Generate 10 SEO-optimized, eye-catching blog post titles for the topic: "${topic}".`;
    console.log("Tokens used:", completion.usage.total_tokens);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    console.log("Tokens used:", completion.usage.total_tokens);

    const text = completion.choices[0].message.content;
    const titles = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.?\s*/, "").trim())
      .filter(Boolean);

    return NextResponse.json({ titles });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Failed to generate titles" },
      { status: 500 }
    );
  }
}
