import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'feature_Flow';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const result = await pool.query('SELECT id, email, password, name FROM users WHERE email = ?', [email]);
    const users = result[0] as User[];

    if (!users || users.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, id: user.id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    // Set token as HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
