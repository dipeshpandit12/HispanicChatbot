import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import SocialMedia from "@/models/socialMediaSchema";
import jwt from 'jsonwebtoken';
import { getFacebookPages, getInstagramBusinessAccount } from '@/lib/auth/facebook';

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
            const newSocialMedia = await SocialMedia.create({
                userId,
                socialAccounts: {
                    facebook: {
                        accessToken: null,
                        pageIds: [],
                        expiresAt: null
                    },
                    instagram: {
                        businessAccountId: null,
                        accessToken: null,
                        expiresAt: null
                    }
                },
                connections: {
                    facebook: false,
                    instagram: false
                }
            });
            return NextResponse.json(newSocialMedia);
        }

        // Check connections status
        const connections = {
            facebook: false,
            instagram: false
        };

        if (socialMedia.socialAccounts?.facebook?.accessToken) {
            try {
                const pages = await getFacebookPages(socialMedia.socialAccounts.facebook.accessToken);
                connections.facebook = pages.length > 0;

                if (connections.facebook) {
                    const instagramAccount = await getInstagramBusinessAccount(
                        socialMedia.socialAccounts.facebook.accessToken,
                        pages[0].id
                    );
                    connections.instagram = !!instagramAccount;
                }
            } catch (error) {
                console.error('Social connections check error:', error);
            }
        }

        return NextResponse.json({
            ...socialMedia.toObject(),
            connections
        });
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

        // Validate incoming data
        if (!data.socialAccounts) {
            return NextResponse.json(
                { error: "Invalid social media data" },
                { status: 400 }
            );
        }

        // Update social media data
        const updatedSocialMedia = await SocialMedia.findOneAndUpdate(
            { userId },
            {
                socialAccounts: {
                    facebook: {
                        accessToken: data.socialAccounts.facebook?.accessToken || null,
                        pageIds: data.socialAccounts.facebook?.pageIds || [],
                        expiresAt: data.socialAccounts.facebook?.expiresAt || null
                    },
                    instagram: {
                        businessAccountId: data.socialAccounts.instagram?.businessAccountId || null,
                        accessToken: data.socialAccounts.instagram?.accessToken || null,
                        expiresAt: data.socialAccounts.instagram?.expiresAt || null
                    }
                },
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        // Verify connections after update
        const connections = {
            facebook: !!updatedSocialMedia.socialAccounts?.facebook?.accessToken,
            instagram: !!updatedSocialMedia.socialAccounts?.instagram?.businessAccountId
        };

        return NextResponse.json({
            message: 'Social media data updated successfully',
            data: {
                ...updatedSocialMedia.toObject(),
                connections
            }
        });
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}