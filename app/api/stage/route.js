import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDB } from "@/utils/database";
import BusinessStage from "@/models/BusinessStage";

export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        await connectToDB();

        const businessStage = await BusinessStage.findOne({ userId });

        if (!businessStage) {
            return NextResponse.json({ error: "Business stage not found" }, { status: 404 });
        }

        return NextResponse.json({ stage: businessStage.stage });

    } catch (error) {
        console.error('Error in stage route:', error);
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}