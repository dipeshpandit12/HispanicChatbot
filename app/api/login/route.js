import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDB } from "@/utils/database";
import User from '@/models/user';

export async function POST(request) {
    try {
        const { email, password: inputPassword } = await request.json();

        if (!email || !inputPassword) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectToDB();

        // Find user by email using the User model
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(inputPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Convert user document to object and remove password
        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json({
            message: 'Login successful',
            user: userObject
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}