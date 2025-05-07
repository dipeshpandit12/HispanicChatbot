import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { connectToDB } from "@/utils/database";
import GoogleUser from '@/models/google';
import { generateToken } from '@/utils/auth';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    const { credential,redirect } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    await connectToDB();

    let googleUser = await GoogleUser.findOne({
      $or: [
        { email },
        { googleId }
      ]
    });

    if (!googleUser) {
      googleUser = await GoogleUser.create({
        email,
        googleId,
        hasBusinessData: false
      });
    }

    const token = generateToken({
      _id: googleUser._id,
      email: googleUser.email,
      hasBusinessData: googleUser.hasBusinessData,
      isGoogleUser: true
    });

    const response = NextResponse.json({
      message: 'Google login successful',
      user: {
        email: googleUser.email,
        hasBusinessData: googleUser.hasBusinessData
      },
      redirect: redirect || '/pages/stage'
    });

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400
    });

    return response;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error.message },
      { status: 401 }
    );
  }
}