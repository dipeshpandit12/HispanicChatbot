import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({ message: 'Social Media Diagnostics API' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        return NextResponse.json({ message: 'Data received', data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}