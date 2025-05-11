import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GrowthStrategy from '@/models/growthStrategies';
import Business from "@/models/businessData";
import BusinessStage from "@/models/BusinessStage";

// Handle GET requests to fetch chat data
export async function GET(req) {
  try {
    console.log("GET Chat data request received");

    // Extract URL parameters
    const url = new URL(req.url);
    const source = url.searchParams.get('source');
    const courseId = url.searchParams.get('courseId');
    const problemId = url.searchParams.get('problemId');

    console.log("URL parameters:", { source, courseId, problemId });

    // Get authentication token
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      console.log("Authentication error: No token provided");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify and decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;
    console.log("Authenticated user ID:", userId);

    // Connect to database
    await connectToDB();
    console.log("Connected to database");

    // Get user's business stage
    const userStageData = await BusinessStage.findOne({ userId });
    if (!userStageData) {
      console.log("Business stage not found for user ID:", userId);
      return NextResponse.json({ error: "Business stage not found for user" }, { status: 404 });
    }

    const userStage = userStageData.stage; // 'beginner', 'intermediate', or 'advanced'
    console.log("User stage:", userStage);

    // Get growth strategies for the user's stage
    const stageStrategies = await GrowthStrategy.find({ stage: userStage });
    if (!stageStrategies || stageStrategies.length === 0) {
      console.log("No growth strategies found for stage:", userStage);
      return NextResponse.json({ error: "No strategies found for user's stage" }, { status: 404 });
    }

    // Return specific problem if problemId is provided
    if (problemId) {
      const matchingStrategy = stageStrategies.find(
        strategy => strategy.problem.id === problemId
      );

      if (!matchingStrategy) {
        console.log("Problem not found with ID:", problemId);
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
      }
      
      console.log("Found matching strategy:", matchingStrategy.problem.title);
      
      return NextResponse.json({
        problem: matchingStrategy.problem,
        solution: matchingStrategy.solution,
        sourceInfo: { source, courseId }
      });
    }
    
    // Return all strategies if no problemId
    // Map to maintain the same response format as before
    const formattedStrategies = stageStrategies.map(strategy => ({
      problem: strategy.problem,
      solution: strategy.solution
    }));
    
    return NextResponse.json({
      issues: formattedStrategies,
      sourceInfo: { source, courseId }
    });
    
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch chat data" },
      { status: 500 }
    );
  }
}

// Handle POST requests for chat messages
export async function POST(req) {
  try {
    console.log("POST Chat message request received");
    
    // Get authentication token
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      console.log("Authentication error: No token provided");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify and decode JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = decoded.userId;
    console.log("Authenticated user ID:", userId);

    // Parse request data
    const body = await req.json();
    const { message, problemId, chatHistory = [] } = body;
    console.log("Request data:", { problemId, messageLength: message?.length, historyLength: chatHistory?.length });
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    
    if (!problemId) {
      return NextResponse.json({ error: "Problem ID is required" }, { status: 400 });
    }
    
    // Connect to database
    await connectToDB();
    console.log("Connected to database");
    
    // Get user's business stage
    const userStageData = await BusinessStage.findOne({ userId });
    if (!userStageData) {
      console.log("Business stage not found for user ID:", userId);
      return NextResponse.json({ error: "Business stage not found for user" }, { status: 404 });
    }
    
    const userStage = userStageData.stage; // 'beginner', 'intermediate', or 'advanced'
    console.log("User stage:", userStage);
    
    // Get growth strategies for the user's stage
    const stageStrategies = await GrowthStrategy.find({ stage: userStage });
    if (!stageStrategies || stageStrategies.length === 0) {
      console.log("No growth strategies found for stage:", userStage);
      return NextResponse.json({ error: "No strategies found for user's stage" }, { status: 404 });
    }

    // Find the specific problem
    const matchingStrategy = stageStrategies.find(
      strategy => strategy.problem.id === problemId
    );

    if (!matchingStrategy) {
      console.log("Problem not found with ID:", problemId);
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    
    console.log("Found matching strategy:", matchingStrategy.problem.title);

    // Get business data for the user
    const businessData = await Business.findOne({ userId });
    if (!businessData) {
      console.log("Business data not found for user ID:", userId);
      // Continue without business data, but log the issue
    } else {
      console.log("Found business data for user");
    }

    // Format business data for the prompt
    let businessContext = "";
    if (businessData) {
      businessContext = `
      Business Information:
      - Growth Stage: ${userStage} (important context for tailoring advice)
      - Industry: ${businessData.industry || "Not specified"}
      - Employee Size: ${businessData.employeeSize || "Not specified"}
      - Location: ${businessData.businessLocation || "Not specified"}
      - Uses Social Media: ${businessData.usesSocialMedia ? "Yes" : "No"}
      ${businessData.usesSocialMedia ? `- Social Media Platforms: ${businessData.socialMediaPlatforms?.join(", ") || "None specified"}` : ""}
      ${businessData.usesSocialMedia && businessData.postingFrequency ? `- Posting Frequency: ${businessData.postingFrequency}` : ""}
      ${businessData.usesSocialMedia ? `- Has Documented Strategy: ${businessData.hasDocumentedStrategy ? "Yes" : "No"}` : ""}
      
      Business Needs:
      ${businessData.supportNeeded?.length > 0 ? `- Support Needed: ${businessData.supportNeeded.join(", ")}` : ""}
      ${businessData.holdingBackReason ? `- Holding Back Reason: ${businessData.holdingBackReason}` : ""}
      ${businessData.strategyChallenges?.length > 0 ? `- Strategy Challenges: ${businessData.strategyChallenges.join(", ")}` : ""}
      ${businessData.interestedInGuidance ? `- Interested in Guidance: Yes` + (businessData.guidanceAreas?.length > 0 ? `\n- Guidance Areas: ${businessData.guidanceAreas.join(", ")}` : "") : "- Interested in Guidance: No"}
      ${businessData.hasSetGoals ? `- Has Set Goals: Yes` + (businessData.setGoalsDetails ? `\n- Goals Details: ${businessData.setGoalsDetails}` : "") : "- Has Set Goals: No"}
      ${businessData.wantsHelpWithGoals ? "- Wants Help With Goals: Yes" : ""}
      ${businessData.successMetrics?.length > 0 ? `- Success Metrics: ${businessData.successMetrics.join(", ")}` : ""}
      `;
    }

    // Initialize Gemini API
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured in environment variables");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }
    
    console.log("Initializing Gemini API");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
      // Create contextual prompt with all necessary information
      const fullPrompt = `
      You are a helpful AI assistant for Hispanic business owners. 
      You are providing guidance about "${matchingStrategy.problem.title}" for a ${userStage}-level business.
      
      Problem description: ${matchingStrategy.problem.description}
      
      Recommended solution: ${matchingStrategy.solution.title} - ${matchingStrategy.solution.description}
      
      ${businessContext}
      
      Previous conversation:
      ${chatHistory.map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}
      
      User's current message: ${message}
      
      Before responding, follow these pre-checking criteria:
      1. Verify that your response directly addresses the specific business problem identified in "matchingStrategy.problem.title" and "matchingStrategy.problem.description"
      2. Ensure your advice incorporates elements from the "matchingStrategy.solution.title" and "matchingStrategy.solution.description"
      3. Check that your response builds logically on any previous conversation context
      4. Confirm your advice is culturally relevant and practical for Hispanic business owners
      5. Make sure your response addresses the user's current message specifically
      6. Use the specific business data provided (industry, size, location, social media usage, etc.) to tailor your advice
      7. Focus on providing personalized recommendations that take into account the business's unique situation
      8. Consider the specific needs, challenges, and goals expressed in the business data
      9. Ensure your guidance is appropriate for their business growth stage: ${userStage}
      
      Please respond in a helpful, concise, and practical way. Focus on providing actionable advice relevant to this specific Hispanic business owner's needs based on their business data. If you don't know something, admit it rather than making up information.`;
      console.log("Sending message to Gemini with prompt length:", fullPrompt.length);
      
      // Use the simplest Gemini model call instead of chat
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const responseText = response.text();

      console.log("Response text length:", responseText.length);
      console.log("Response preview:", responseText.substring(0, 100) + "...");

      return NextResponse.json({
        success: true,
        response: responseText
      });
    } catch (genAIError) {
      console.error("Gemini API Error:", genAIError);

      return NextResponse.json(
        {
          success: false,
          error: "AI model error",
          message: genAIError.message || "Failed to generate AI response",
        },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error("POST API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message || "Failed to process chat message",
      },
      { status: 500 }
    );
  }
}