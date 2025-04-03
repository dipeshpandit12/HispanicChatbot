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

        // Save business data
        const business = await Business.findOneAndUpdate(
            { userId },
            {
                employeeSize: data.employeeSize,
                businessLocation: data.businessLocation,
                industry: data.industry,
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