import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { sendCourseInvitationOnLogin } from "@/utils/canvasEnrollment";

export async function POST(req) {
    try {
        const body = await req.json();

        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        await connectToDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        // Send Canvas course invitation after successful signup
        try {
            await sendCourseInvitationOnLogin(email);
            console.log(`Canvas invitation sent to ${email}`);
        } catch (invitationError) {
            console.error('Canvas invitation error:', invitationError);
            // Continue with signup process even if invitation fails
        }

        return NextResponse.json(
            { message: "Signup successful", userId: newUser._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing signup:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}