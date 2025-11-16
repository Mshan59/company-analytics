import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT id, name FROM roles ORDER BY name ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load roles' }, { status: 500 });
  }
}
