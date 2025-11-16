import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Returns rows of shape: { date: 'YYYY-MM' or 'YYYY-MM-DD', team: string, value: number }
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD
    const granularity = (searchParams.get('granularity') || 'month').toLowerCase(); // 'day' | 'month'

    const dateExpr = granularity === 'day' ? "DATE(t.created_at)" : "DATE_FORMAT(t.created_at, '%Y-%m')";

    const where: string[] = [];
    const params: any[] = [];
    if (from && to) { where.push('t.created_at BETWEEN ? AND ?'); params.push(from, to); }
    else if (from) { where.push('t.created_at >= ?'); params.push(from); }
    else if (to) { where.push('t.created_at <= ?'); params.push(to); }

    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const [rows] = await pool.query(
      `SELECT ${dateExpr} AS date,
              COALESCE(tm.name, 'Unassigned') AS team,
              COUNT(*) AS value
         FROM tasks t
         LEFT JOIN projects p ON p.id = t.project_id
         LEFT JOIN teams tm ON tm.id = p.team_id
         ${whereSql}
         GROUP BY date, team
         ORDER BY date ASC, team ASC`,
      params
    );

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load team productivity' }, { status: 500 });
  }
}
