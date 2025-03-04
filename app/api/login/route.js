import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDB } from "@/utils/database";
import User from '@/models/user';
import { generateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const { email, password: inputPassword } = await request.json();

    await connectToDB();
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(inputPassword, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        email: user.email,
        hasBusinessData: user.hasBusinessData
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.log(`error ${error}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}