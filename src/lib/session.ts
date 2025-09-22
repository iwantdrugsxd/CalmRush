import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function getSession(req: NextRequest) {
  return await getServerSession(authOptions);
}

export function createSessionResponse(user: any, req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    data: user,
    message: 'Authentication successful'
  });

  // Set session cookie
  response.cookies.set('userId', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return response;
}
