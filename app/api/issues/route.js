import { connectToDB } from '@/utils/database';
import IssuesAndResources from '@/models/issuesAndResources';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
    try {
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

        // Find documents for the user and select only the problems
        const userIssues = await IssuesAndResources.findOne(
            { userId: userId },
            { 'issuesList.problem': 1, _id: 0 }
        );

        if (!userIssues || !userIssues.issuesList.length) {
            console.log('No data exists for this user');
            return NextResponse.json(
                { message: 'No data exists for this user' },
                { status: 404 }
            );
        }

        // Extract just the problems from the issues list
        const problems = userIssues.issuesList.map(issue => issue.problem);
        console.log('Problems found:', problems);

        return NextResponse.json({ problems }, { status: 200 });

    } catch (error) {
        console.error('Error fetching problems:', error);
        return NextResponse.json(
            { error: 'Failed to fetch problems' },
            { status: 500 }
        );
    }
}