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
    const eWhere = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT p.id AS projectId,
              p.name AS name,
              COALESCE(pb.allocated_amount, 0) AS allocated,
              COALESCE(es.spent, 0) AS spent
         FROM projects p
         LEFT JOIN project_budgets pb ON pb.project_id = p.id
         LEFT JOIN (
           SELECT project_id, SUM(amount) AS spent
             FROM expenses e
             ${eWhere}
             GROUP BY project_id
         ) es ON es.project_id = p.id
         ORDER BY p.name ASC`
    , params);

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load budget vs expense' }, { status: 500 });
  }
}
