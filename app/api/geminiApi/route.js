import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import Business from "@/models/businessData";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await connectToDB();

    const businessData = await Business.findOne({ userId });

    if (!businessData) {
      return NextResponse.json(
        { error: "Business data not found" },
        { status: 404 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 100,
      },
    });
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `Given this business profile, classify it as exactly one of these stages: "beginner", "intermediate", or "advance". Reply with only one word. Verify 10 times before giving final response.

    Business Profile:
    - Employee Size: ${businessData.employeeSize}
    - Business Location: ${businessData.businessLocation}
    - Industry: ${businessData.industry}`,
                },
            ],
            },
        ],
        };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    console.log("Raw Gemini response:", text);

    // Validate the response
    const validStages = ["beginner", "intermediate", "advance"];
    const stage = validStages.find((s) => text.includes(s));

    if (!stage) {
      console.error("Invalid response received:", text);
      throw new Error("Invalid stage classification received");
    }

    return NextResponse.json({ stage });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to classify business stage",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
