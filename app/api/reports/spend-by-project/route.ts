import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    const where: string[] = [];
    const params: any[] = [];
    if (from && to) { where.push('e.incurred_on BETWEEN ? AND ?'); params.push(from, to); }
    else if (from) { where.push('e.incurred_on >= ?'); params.push(from); }
    else if (to) { where.push('e.incurred_on <= ?'); params.push(to); }
    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const [rows] = await pool.query(
      `SELECT COALESCE(p.name,'Unassigned') as name, COALESCE(SUM(e.amount),0) as value
         FROM expenses e
         LEFT JOIN projects p ON p.id = e.project_id
         ${whereSql}
         GROUP BY p.name
         ORDER BY value DESC`
      , params
    );

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load spend by project' }, { status: 500 });
  }
}
