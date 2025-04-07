import { NextResponse } from "next/server";
import Business from "@/models/businessData";
import User from "@/models/user";
import GoogleUser from "@/models/google";
import { connectToDB } from "@/utils/database";
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const email = decoded.email;

        await connectToDB();
        const data = await req.json();

        // Validate required fields
        const requiredFields = ['employeeSize', 'businessLocation', 'industry', 'usesSocialMedia'];
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Save all business data
        const business = await Business.findOneAndUpdate(
            { userId },
            {
                userId,
                employeeSize: data.employeeSize,
                businessLocation: data.businessLocation,
                industry: data.industry,
                usesSocialMedia: data.usesSocialMedia,
                socialMediaPlatforms: data.socialMediaPlatforms || [],
                otherSocialMediaPlatform: data.otherSocialMediaPlatform || "",
                postingFrequency: data.postingFrequency,
                hasDocumentedStrategy: data.hasDocumentedStrategy,
                supportNeeded: data.supportNeeded || [],
                otherSupport: data.otherSupport || "",
                holdingBackReason: data.holdingBackReason,
                otherHoldingBackReason: data.otherHoldingBackReason || "",
                helpfulServices: data.helpfulServices || [],
                otherHelpfulService: data.otherHelpfulService || "",
                strategyChallenges: data.strategyChallenges || [],
                otherStrategyChallenge: data.otherStrategyChallenge || "",
                interestedInGuidance: data.interestedInGuidance,
                guidanceAreas: data.guidanceAreas || [],
                otherGuidanceArea: data.otherGuidanceArea || "",
                hasSetGoals: data.hasSetGoals,
                setGoalsDetails: data.setGoalsDetails || "",
                wantsHelpWithGoals: data.wantsHelpWithGoals,
                socialMediaIdeas: data.socialMediaIdeas || "",
                socialMediaTools: data.socialMediaTools || [],
                successMetrics: data.successMetrics || []
            },
            { upsert: true, new: true }
        );

        // Update both User and GoogleUser hasBusinessData field
        await Promise.all([
            User.findByIdAndUpdate(userId, { hasBusinessData: true }),
            GoogleUser.findOneAndUpdate(
                { email: email },
                { hasBusinessData: true }
            )
        ]);

        // Call GeminiAPI endpoint to classify business stage
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const geminiResponse = await fetch(`${baseUrl}/api/geminiApi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ businessId: business._id }),
            cache: 'no-store'
        });

        if (!geminiResponse.ok) {
            console.error('Error calling GeminiAPI:', await geminiResponse.text());
        }

        return NextResponse.json({
            message: 'Business data saved successfully',
            business,
            hasBusinessData: true
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectToDB();

        const business = await Business.findOne({ userId });
        
        if (!business) {
            return NextResponse.json({ error: "Business data not found" }, { status: 404 });
        }

        return NextResponse.json(business);

    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}