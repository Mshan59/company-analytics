import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Returns rows of shape: { date: 'YYYY-MM' or 'YYYY-MM-DD', team: string, hours: number }
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD
    const granularity = (searchParams.get('granularity') || 'month').toLowerCase(); // 'day' | 'month'

    const dateExpr = granularity === 'day' ? "DATE(t.work_date)" : "DATE_FORMAT(t.work_date, '%Y-%m')";

    const where: string[] = [];
    const params: any[] = [];
    if (from && to) { where.push('t.work_date BETWEEN ? AND ?'); params.push(from, to); }
    else if (from) { where.push('t.work_date >= ?'); params.push(from); }
    else if (to) { where.push('t.work_date <= ?'); params.push(to); }

    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const [rows] = await pool.query(
      `SELECT ${dateExpr} AS date,
              COALESCE(tm.name, 'Unassigned') AS team,
              SUM(t.hours) AS hours
         FROM timesheets t
         LEFT JOIN teams tm ON tm.id = t.team_id
         ${whereSql}
         GROUP BY date, team
         ORDER BY date ASC, team ASC`,
      params
    );

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load time spent per team' }, { status: 500 });
  }
}
