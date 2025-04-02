import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import Business from "@/models/businessData";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processGeminiRequest(decodedToken) {
  try {
    await connectToDB();
    const businessData = await Business.findOne({
      userId: decodedToken.userId,
    });

    if (!businessData) {
      throw new Error("Business data not found");
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

    const validStages = ["beginner", "intermediate", "advance"];
    const stage = validStages.find((s) => text.includes(s));

    if (!stage) {
      throw new Error("Invalid stage classification received");
    }

    return { stage };
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await processGeminiRequest(decoded);
      return NextResponse.json(result);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return NextResponse.json(
          { error: `Invalid token: ${error.message}` },
          { status: 401 }
        );
      }
      if (error.message === "Business data not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
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
