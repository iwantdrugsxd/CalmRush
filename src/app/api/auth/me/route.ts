import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    console.log('API /auth/me - userId from cookie:', userId);
    console.log('API /auth/me - all cookies:', cookieStore.getAll());

    if (!userId) {
      console.log('API /auth/me - No userId cookie found');
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      }
    });

    console.log('API /auth/me - User found in database:', user);

    if (!user) {
      console.log('API /auth/me - User not found in database');
      return NextResponse.json({ user: null });
    }

    console.log('API /auth/me - Returning user data');
    return NextResponse.json({ user });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}
