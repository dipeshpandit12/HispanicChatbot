import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import SocialMedia from "@/models/socialMediaSchema";
import jwt from 'jsonwebtoken';

// Get user's social media connections
export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectToDB();

        const socialMedia = await SocialMedia.findOne({ userId });

        if (!socialMedia) {
            // Create default empty social media document
            const newSocialMedia = await SocialMedia.create({
                userId,
                socialAccounts: {
                    Instagram: '',
                    Facebook: '',
                    Twitter: '',
                    LinkedIn: ''
                }
            });
            return NextResponse.json(newSocialMedia);
        }

        return NextResponse.json(socialMedia);
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update social media connections
export async function POST(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectToDB();
        const data = await req.json();

        const updatedSocialMedia = await SocialMedia.findOneAndUpdate(
            { userId },
            {
                socialAccounts: data.socialAccounts,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            message: 'Social media data updated successfully',
            data: updatedSocialMedia
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}