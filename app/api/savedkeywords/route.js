import { NextResponse } from "next/server";
import mongoose from "mongoose";
import savedkeywords from "@/lib/models/savedkeywords";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      keyword,
      userEmail,
      related_questions,
      related_searches,
      organic_results,
    } = body;

    if (!keyword || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEntry = await savedkeywords.create({
      keyword,
      userEmail,
      related_questions,
      related_searches,
      organic_results,
    });

    return NextResponse.json({ message: "Saved successfully", data: newEntry });
  } catch (err) {
    console.error("Save API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
