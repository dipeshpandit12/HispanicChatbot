import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import User from '@/models/user';
import GoogleUser from '@/models/google';
import jwt from 'jsonwebtoken';

export async function PUT(request) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Verify token and extract user data
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid authentication token' }, 
        { status: 401 }
      );
    }

    await connectToDB();

    // Check if this is a Google user or regular user based on the token
    if (decoded.isGoogleUser) {
      // Update Google user
      await GoogleUser.findByIdAndUpdate(
        decoded._id || decoded.userId,
        { hasBusinessData: true }
      );
    } else {
      // Update regular user
      await User.findByIdAndUpdate(
        decoded._id || decoded.userId,
        { hasBusinessData: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Business data status updated successfully'
    });
  } catch (error) {
    console.error('Update business data status error:', error);
    return NextResponse.json(
      { error: 'Failed to update business data status', details: error.message },
      { status: 500 }
    );
  }
}