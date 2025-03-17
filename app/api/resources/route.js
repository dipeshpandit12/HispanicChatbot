import { connectToDB } from '@/utils/database';
import IssuesAndResources from '@/models/issuesAndResources';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        // Get query from request body
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Problem title is required" }, { status: 400 });
        }

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

        // Find the specific problem and its solution for the user
        const userIssue = await IssuesAndResources.findOne(
            {
                userId: userId,
                'issuesList.problem.title': query
            },
            {
                'issuesList.$': 1
            }
        );

        if (!userIssue || !userIssue.issuesList.length) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        // Extract the solution from the matching problem
        const matchedIssue = userIssue.issuesList[0];
        const solution = matchedIssue.solution;

        return NextResponse.json({
            success: true,
            solution: solution,
            problemTitle: query
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching solution:', error);
        return NextResponse.json(
            { error: 'Failed to fetch solution' },
            { status: 500 }
        );
    }
}