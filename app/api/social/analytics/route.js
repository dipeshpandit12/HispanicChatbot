import { NextResponse } from 'next/server';
import { connectToDB } from "@/utils/database";
import User from '@/models/user';

export async function GET(request) {
  try {
    // Extract user token from request headers or cookies
    const authToken = request.headers.get('authorization')?.split(' ')[1];
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();
    const user = await User.findOne({
      $or: [
        { 'socialAuth.facebook.accessToken': { $exists: true } },
        { 'googleId': { $exists: true } }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let analytics = {
      facebook: null,
      instagram: null
    };

    // Fetch Facebook analytics if available
    if (user.socialAuth?.facebook?.accessToken) {
      const fbResponse = await fetch(
        `https://graph.facebook.com/v22.0/me/accounts?access_token=${user.socialAuth.facebook.accessToken}`
      );
      analytics.facebook = await fbResponse.json();
    }

    // Fetch Instagram analytics if available
    if (user.socialAuth?.facebook?.accessToken && user.socialAuth?.instagram?.businessAccountId) {
      const igResponse = await fetch(
        `https://graph.facebook.com/v22.0/${user.socialAuth.instagram.businessAccountId}?fields=followers_count,media_count&access_token=${user.socialAuth.facebook.accessToken}`
      );
      analytics.instagram = await igResponse.json();
    }

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media analytics' },
      { status: 500 }
    );
  }
}