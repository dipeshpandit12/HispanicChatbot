import { NextResponse } from "next/server";
import GrowthStrategy from '@/models/growthStrategies';
import BusinessStage from '@/models/BusinessStage';
import { connectToDB } from "@/utils/database";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const initialData = [
    {
      "stage": "beginner",
      "problem": {
        "id": "reviews",
        "title": "Reward Customer Feedback",
        "description": "Encourage and reward customer reviews to build credibility.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' /></svg>",
        "colorClasses": "bg-yellow-100 text-yellow-600"
      },
      "solution": {
        "id": "rm1",
        "title": "Review Management Guide",
        "description": "Learn how to manage and encourage customer reviews.",
        "link": "/resources/reviews",
        "type": "guide",
        "thumbnail": "reviews.jpg",
        "colorClasses": "bg-yellow-50"
      }
    },
    {
      "stage": "beginner",
      "problem": {
        "id": "website",
        "title": "Get Website",
        "description": "Build your online presence with a professional website.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 12a9 9 0 01-9 9M21 12a9 9 0 00-9-9M21 12H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9' /></svg>",
        "colorClasses": "bg-blue-100 text-blue-600"
      },
      "solution": {
        "id": "sw1",
        "title": "Website Development Guide",
        "description": "Step-by-step guide to creating your business website.",
        "link": "/resources/website",
        "type": "guide",
        "thumbnail": "website.jpg",
        "colorClasses": "bg-blue-50"
      }
    },
    {
      "stage": "beginner",
      "problem": {
        "id": "content",
        "title": "Create Content",
        "description": "Develop engaging social media content that connects with your audience.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' /></svg>",
        "colorClasses": "bg-green-100 text-green-600"
      },
      "solution": {
        "id": "cc1",
        "title": "Content Creation Guide",
        "description": "Learn to create engaging content for your business.",
        "link": "/resources/content",
        "type": "guide",
        "thumbnail": "content.jpg",
        "colorClasses": "bg-green-50"
      }
    },
    {
      "stage": "beginner",
      "problem": {
        "id": "brand_awareness",
        "title": "Low Brand Awareness",
        "description": "Struggling to get visibility and reach a wider audience.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h11M9 21V3M9 3l-7 7 7 7' /></svg>",
        "colorClasses": "bg-blue-100 text-blue-600"
      },
      "solution": {
        "id": "smb1",
        "title": "Branding Starter Kit",
        "description": "A guide to help new businesses increase brand visibility.",
        "link": "/resources/branding",
        "type": "guide",
        "thumbnail": "branding.jpg",
        "colorClasses": "bg-blue-50"
      }
    },
    {
      "stage": "beginner",
      "problem": {
        "id": "social_media_knowledge",
        "title": "Lack of Social Media Knowledge",
        "description": "Uncertainty on what to post and how to engage followers.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m-6-3l3 3' /></svg>",
        "colorClasses": "bg-yellow-100 text-yellow-600"
      },
      "solution": {
        "id": "smb2",
        "title": "Social Media Basics",
        "description": "Learn how to create engaging content and grow your audience.",
        "link": "/resources/social-media-basics",
        "type": "guide",
        "thumbnail": "social_media_basics.jpg",
        "colorClasses": "bg-yellow-50"
      }
    },
  
    {
      "stage": "intermediate",
      "problem": {
        "id": "trust_credibility",
        "title": "Gaining Trust and Credibility",
        "description": "Struggling to build trust with new audiences.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' /></svg>",
        "colorClasses": "bg-green-100 text-green-600"
      },
      "solution": {
        "id": "tc1",
        "title": "Trust-Building Checklist",
        "description": "Build your credibility with new and existing customers.",
        "link": "/resources/trust-guide",
        "type": "checklist",
        "thumbnail": "trust.jpg",
        "colorClasses": "bg-green-50"
      }
    },
    {
      "stage": "intermediate",
      "problem": {
        "id": "low_engagement",
        "title": "Low Engagement & Conversions",
        "description": "Followers are not interacting or converting into customers.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 10l4.553-4.553a2 2 0 00-2.828-2.828L12 7.172 7.275 2.447a2 2 0 00-2.828 2.828L10 10v7a2 2 0 002 2h3a2 2 0 002-2v-7z' /></svg>",
        "colorClasses": "bg-orange-100 text-orange-600"
      },
      "solution": {
        "id": "ccg1",
        "title": "Content That Converts Guide",
        "description": "Learn to create content that drives conversions.",
        "link": "/resources/conversion-content",
        "type": "guide",
        "thumbnail": "conversion.jpg",
        "colorClasses": "bg-orange-50"
      }
    },

    {
      "stage": "intermediate",
      "problem": {
        "id": "paid_ads",
        "title": "Limited Understanding of Paid Ads",
        "description": "Not sure how to use social media ads effectively.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m-6-3l3 3' /></svg>",
        "colorClasses": "bg-purple-100 text-purple-600"
      },
      "solution": {
        "id": "pad1",
        "title": "Paid Advertising 101",
        "description": "Learn how to run effective social media ads.",
        "link": "/resources/paid-ads",
        "type": "guide",
        "thumbnail": "paid_ads.jpg",
        "colorClasses": "bg-purple-50"
      }
    },
    {
      "stage": "advanced",
      "problem": {
        "id": "customer_service",
        "title": "Managing Customer Service at Scale",
        "description": "Keeping up with increasing customer inquiries.",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg' class='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m2-4h-2m-6 8a9 9 0 1018 0 9 9 0 00-18 0z' /></svg>",
        "colorClasses": "bg-red-100 text-red-600"
      },
      "solution": {
        "id": "cs1",
        "title": "Customer Service Automation Playbook",
        "description": "Automate FAQs and scale support with tools.",
        "link": "/resources/customer-service",
        "type": "guide",
        "thumbnail": "customer_service.jpg",
        "colorClasses": "bg-red-50"
      }
    }
  ];

  export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = new mongoose.Types.ObjectId(decoded.userId);

        await connectToDB();

        // First, check if we need to initialize data
        const count = await GrowthStrategy.countDocuments();
        if (count === 0) {
            try {
                await GrowthStrategy.insertMany(initialData);
            } catch (err) {
                return NextResponse.json({ error: `Error initializing data: ${err}` }, { status: 500 });
            }
        }

        // Get user's business stage from BusinessStage collection
        const userBusinessStage = await BusinessStage.findOne({ userId })
            .select('stage')
            .lean();

        if (!userBusinessStage) {
            return NextResponse.json({
                error: "Business stage not found for user"
            }, { status: 404 });
        }

        const strategies = await GrowthStrategy.find({
            stage: userBusinessStage.stage
        }).lean();

        return NextResponse.json({
            stage: userBusinessStage.stage,
            strategies: strategies.map(strategy => ({
                _id: strategy._id.toString(),
                problem: {
                    id: strategy.problem.id,
                    title: strategy.problem.title,
                    description: strategy.problem.description,
                    icon: strategy.problem.icon,
                    colorClasses: strategy.problem.colorClasses
                }
            }))
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            error: error.message || "Internal server error"
        }, { status: error.name === 'JsonWebTokenError' ? 401 : 500 });
    }
}