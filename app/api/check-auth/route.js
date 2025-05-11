import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = await cookieStore.get('authToken');
  const hasBusinessData = await cookieStore.get('hasBusinessData');

  return NextResponse.json({
    isAuthenticated: !!authToken?.value,
    hasBusinessData: !!hasBusinessData?.value
  });
}