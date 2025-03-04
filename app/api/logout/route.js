import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    message: 'Logged out successfully',
    success: true
  });

  // Clear all auth-related cookies
  response.cookies.delete('authToken', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  response.cookies.delete('hasBusinessData', {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return response;
}