import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import IssuesAndResources from '@/models/issuesAndResources';

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
    
    // Get issues and resources for the user
    const userIssues = await IssuesAndResources.findOne({ userId });
    if (!userIssues) {
      console.log("User issues not found for user ID:", userId);
      return NextResponse.json({ error: "Issues not found for user" }, { status: 404 });
    }

    // Return specific problem if problemId is provided
    if (problemId) {
      const matchingIssue = userIssues.issuesList.find(
        issue => issue.problem.id === problemId
      );

      if (!matchingIssue) {
        console.log("Problem not found with ID:", problemId);
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
      }
      
      console.log("Found matching issue:", matchingIssue.problem.title);
      
      return NextResponse.json({
        problem: matchingIssue.problem,
        solution: matchingIssue.solution,
        sourceInfo: { source, courseId }
      });
    }
    
    // Return all issues if no problemId
    return NextResponse.json({
      issues: userIssues.issuesList,
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
    
    // Get problem context for better AI responses
    const userIssues = await IssuesAndResources.findOne({ userId });
    if (!userIssues) {
      console.log("User issues not found for user ID:", userId);
      return NextResponse.json({ error: "Issues not found for user" }, { status: 404 });
    }

    const matchingIssue = userIssues.issuesList.find(
      issue => issue.problem.id === problemId
    );

    if (!matchingIssue) {
      console.log("Problem not found with ID:", problemId);
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    
    console.log("Found matching issue:", matchingIssue.problem.title);

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
You are providing guidance about "${matchingIssue.problem.title}".

Problem description: ${matchingIssue.problem.description}

Recommended solution: ${matchingIssue.solution.title} - ${matchingIssue.solution.description}

Previous conversation:
${chatHistory.map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

User's current message: ${message}

Please respond in a helpful, concise, and practical way. Focus on providing actionable advice relevant to Hispanic business owners' needs. If you don't know something, admit it rather than making up information.`;

      console.log("Sending message to Gemini with prompt length:", fullPrompt.length);
      
      // Use the simplest Gemini model call instead of chat
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 100,
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
      
      // Better error response
      return NextResponse.json(
        {
          success: false,
          error: "AI model error",
          message: genAIError.message || "Failed to generate AI response",
        },
        { status: 502 } // Bad Gateway for external service failure
      );
    }

  } catch (error) {
    console.error("POST API Error:", error);

    // Return a valid JSON response even for errors
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