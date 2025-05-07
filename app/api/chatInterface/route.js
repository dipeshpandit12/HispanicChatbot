import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import IssuesAndResources from '@/models/issuesAndResources';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');
    const sourceParam = searchParams.get('source');
    const courseId = searchParams.get('courseId');

    // Get the token from cookies
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;

    // Connect to the database
    await connectToDB();

    // Find the user's issues and resources
    const userIssues = await IssuesAndResources.findOne({ userId });

    if (!userIssues) {
      return NextResponse.json({ error: "Issues not found for user" }, { status: 404 });
    }

    // If problemId is provided, find the specific problem
    if (problemId) {
      const matchingIssue = userIssues.issuesList.find(
        issue => issue.problem.id === problemId
      );

      if (!matchingIssue) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        problem: matchingIssue.problem,
        solution: matchingIssue.solution,
        sourceInfo: {
          source: sourceParam,
          courseId: courseId
        }
      });
    } 
    
    // If no problemId, return all issues
    return NextResponse.json({
      success: true,
      issues: userIssues.issuesList.map(issue => ({
        problem: issue.problem,
        solution: issue.solution
      })),
      sourceInfo: {
        source: sourceParam,
        courseId: courseId
      }
    });

  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}