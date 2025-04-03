import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ error: `Invalid token: ${error.message}` }, { status: 401 });
        }

        // Use absolute URL for API call
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/geminiApi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch stage');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in stage route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}