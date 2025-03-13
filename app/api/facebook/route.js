import { NextResponse } from 'next/server';
import { connectToDB } from '@/utils/database';
import SocialMedia from '@/models/socialMediaSchema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        
        if (!code) {
            return NextResponse.redirect('/pages/socialMediaDiagnostic?error=No_code_received');
        }

        // Get the token from cookies to extract userId
        const cookieStore = cookies();
        const token = cookieStore.get('authToken')?.value;
        if (!token) {
            return NextResponse.redirect('/pages/socialMediaDiagnostic?error=Not_authenticated');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const tokenUrl = new URL('https://graph.facebook.com/v22.0/oauth/access_token');
        tokenUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
        tokenUrl.searchParams.append('client_secret', process.env.FACEBOOK_APP_SECRET);
        tokenUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL}/api/facebook`);
        tokenUrl.searchParams.append('code', code);

        const tokenResponse = await fetch(tokenUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            return NextResponse.redirect('/pages/socialMediaDiagnostic?error=Token_exchange_failed');
        }

        // Store the token
        await connectToDB();
        await SocialMedia.findOneAndUpdate(
            { userId },
            {
                $set: {
                    'socialAccounts.facebook': {
                        accessToken: tokenData.access_token,
                        expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000))
                    }
                }
            },
            { upsert: true }
        );

        return NextResponse.redirect('/pages/socialMediaDiagnostic?status=success');
    } catch (error) {
        console.error('Facebook callback error:', error);
        return NextResponse.redirect('/pages/socialMediaDiagnostic?error=Authentication_failed');
    }
}