import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { processGeminiRequest } from '../geminiApi/route';

export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const result = await processGeminiRequest(decoded);
            return NextResponse.json(result);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return NextResponse.json({ error: `Invalid token: ${error.message}` }, { status: 401 });
            }
            console.error('Error in stage route:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in stage route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}