import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    const where: string[] = [];
    const params: any[] = [];
    if (projectId) { where.push('t.project_id = ?'); params.push(Number(projectId)); }
    if (from && to) { where.push('t.created_at BETWEEN ? AND ?'); params.push(from, to); }
    else if (from) { where.push('t.created_at >= ?'); params.push(from); }
    else if (to) { where.push('t.created_at <= ?'); params.push(to); }
    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const [rows] = await pool.query(
      `SELECT t.status AS name, COUNT(*) AS value
         FROM tasks t
         ${whereSql}
         GROUP BY t.status
         ORDER BY value DESC`
      , params
    );

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load tasks by status' }, { status: 500 });
  }
}
