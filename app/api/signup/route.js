import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Signup request body:", body); // Debugging

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