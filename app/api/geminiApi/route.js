import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import Business from "@/models/businessData";
import BusinessStage from "@/models/BusinessStage";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies.get("authToken")?.value;

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

    // Enhanced prompt with all business data
    const prompt = {
      contents: [{
      parts: [{
        text: `Analyze this business profile and classify it as exactly one of these stages: "beginner", "intermediate", or "advanced". Consider all factors. Reply with only one word.

  Business Profile:
  ${businessData.employeeSize ? `- Employee Size: ${businessData.employeeSize}` : ''}
  ${businessData.businessLocation ? `- Business Location: ${businessData.businessLocation}` : ''}
  ${businessData.industry ? `- Industry: ${businessData.industry}` : ''}
  ${businessData.usesSocialMedia ? `- Social Media Usage: ${businessData.usesSocialMedia}` : ''}
  ${businessData.usesSocialMedia === 'yes' && businessData.socialMediaPlatforms?.length ? `- Social Media Platforms: ${businessData.socialMediaPlatforms.join(', ')}` : ''}
  ${businessData.usesSocialMedia === 'yes' && businessData.postingFrequency ? `- Posting Frequency: ${businessData.postingFrequency}` : ''}
  ${businessData.usesSocialMedia === 'yes' && businessData.hasDocumentedStrategy ? `- Has Documented Strategy: ${businessData.hasDocumentedStrategy}` : ''}
  ${businessData.supportNeeded?.length ? `- Support Needed: ${businessData.supportNeeded.join(', ')}` : ''}
  ${businessData.strategyChallenges?.length ? `- Main Challenges: ${businessData.strategyChallenges.join(', ')}` : ''}
  ${businessData.hasSetGoals ? `- Has Set Goals: ${businessData.hasSetGoals}` : ''}
  ${businessData.socialMediaTools?.length ? `- Uses Social Media Tools: ${businessData.socialMediaTools.join(', ')}` : ''}
  ${businessData.successMetrics?.length ? `- Measures Success Through: ${businessData.successMetrics.join(', ')}` : ''}

  Please analyze the business's digital maturity level based on:
  1. Team size and resources
  2. Social media presence and strategy
  3. Tools and measurement sophistication
  4. Goal setting and planning`
      }]
      }]
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    console.log("Raw Gemini response:", text);

    // Validate the response
    const validStages = ["beginner", "intermediate", "advanced"];
    const stage = validStages.find((s) => text.includes(s));

    if (!stage) {
      throw new Error("Invalid stage classification received");
    }

    // Save or update the business stage
    const businessStage = await BusinessStage.findOneAndUpdate(
      { userId },
      {
        userId,
        stage,
        businessId: businessData._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true,
      stage: businessStage.stage
    });

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