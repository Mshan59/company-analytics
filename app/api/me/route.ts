import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId, id, email, name, role } = payload as any;

    return NextResponse.json({
      id: userId || id,
      email,
      name,
      role,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
