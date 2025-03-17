import { connectToDB } from '@/utils/database';
import IssuesAndResources from '@/models/issuesAndResources';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const demoData = {
    issuesList: [
        {
            problem: {
                id: 'reviews',
                title: 'Reward Customer Feedback',
                description: 'Encourage and reward customer reviews to build credibility.',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
                colorClasses: 'bg-yellow-100 text-yellow-600'
            },
            solution: {
                id: 'sr1',
                title: 'Review Management Guide',
                description: 'Learn how to effectively manage and encourage customer reviews',
                link: '/resources/reviews',
                type: 'guide',
                thumbnail: 'reviews.jpg',
                colorClasses: 'bg-yellow-50'
            },
            additionalResources: []
        },
        {
            problem: {
                id: 'website',
                title: 'Get Website',
                description: 'Build your online presence with a professional website.',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" /></svg>',
                colorClasses: 'bg-blue-100 text-blue-600'
            },
            solution: {
                id: 'sw1',
                title: 'Website Development Guide',
                description: 'Step-by-step guide to creating your business website',
                link: '/resources/website',
                type: 'guide',
                thumbnail: 'website.jpg',
                colorClasses: 'bg-blue-50'
            },
            additionalResources: []
        },
        {
            problem: {
                id: 'content',
                title: 'Create Content',
                description: 'Develop engaging social media content that connects with your audience.',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>',
                colorClasses: 'bg-green-100 text-green-600'
            },
            solution: {
                id: 'sc1',
                title: 'Content Creation Guide',
                description: 'Learn to create engaging content for your business',
                link: '/resources/content',
                type: 'guide',
                thumbnail: 'content.jpg',
                colorClasses: 'bg-green-50'
            },
            additionalResources: []
        },
        {
            problem: {
                id: 'story',
                title: 'Share Your Story',
                description: 'Connect with your audience by sharing your business journey.',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>',
                colorClasses: 'bg-purple-100 text-purple-600'
            },
            solution: {
                id: 'ss1',
                title: 'Storytelling Guide',
                description: 'Learn how to effectively share your business story',
                link: '/resources/story',
                type: 'guide',
                thumbnail: 'story.jpg',
                colorClasses: 'bg-purple-50'
            },
            additionalResources: []
        }
    ]
};

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
        let userIssues = await IssuesAndResources.findOne(
            { userId: userId },
            { 'issuesList.problem': 1, _id: 0 }
        );

        // If no data exists, create demo data for the user
        if (!userIssues || !userIssues.issuesList.length) {
            console.log('Creating demo data for user:', userId);
            await IssuesAndResources.create({
                userId: userId,
                ...demoData
            });
            userIssues = await IssuesAndResources.findOne(
                { userId: userId },
                { 'issuesList.problem': 1, _id: 0 }
            );
            console.log('Demo data created successfully');
        }

        // Extract just the problems from the issues list
        const problems = userIssues.issuesList.map(issue => issue.problem);

        return NextResponse.json({ problems }, { status: 200 });

    } catch (error) {
        console.error('Error fetching problems:', error);
        return NextResponse.json(
            { error: 'Failed to fetch problems' },
            { status: 500 }
        );
    }
}