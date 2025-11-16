import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { canManageBudget, canViewBudget } from '@/lib/permissions';

// List expenses with optional filters: projectId, month (YYYY-MM), category
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canViewBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const month = searchParams.get('month'); // format: YYYY-MM
    const category = searchParams.get('category');
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    const where: string[] = [];
    const params: any[] = [];

    if (projectId) { where.push('e.project_id = ?'); params.push(Number(projectId)); }
    if (category) { where.push('e.category = ?'); params.push(category); }
    if (from && to) { 
      where.push('e.incurred_on BETWEEN ? AND ?'); params.push(from, to);
    } else if (from) {
      where.push('e.incurred_on >= ?'); params.push(from);
    } else if (to) {
      where.push('e.incurred_on <= ?'); params.push(to);
    } else if (month) { 
      where.push("DATE_FORMAT(e.incurred_on, '%Y-%m') = ?"); params.push(month); 
    }

    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const [rows] = await pool.query(
      `SELECT e.id, e.project_id AS projectId, e.category, e.amount, e.description, e.incurred_on AS incurredOn,
              e.created_by AS createdBy, e.created_at AS createdAt,
              p.name AS projectName, u.name AS createdByName
         FROM expenses e
         LEFT JOIN projects p ON p.id = e.project_id
         LEFT JOIN users u ON u.id = e.created_by
         ${whereSql}
         ORDER BY e.incurred_on DESC, e.id DESC`,
      params
    );

    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canManageBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = (payload as any)?.userId || (payload as any)?.id || null;
    const { projectId, category, amount, description, incurredOn } = await req.json();
    if (!category || !amount || !incurredOn) {
      return NextResponse.json({ error: 'category, amount, incurredOn are required' }, { status: 400 });
    }

    const [result] = await pool.query(
      'INSERT INTO expenses (project_id, category, amount, description, incurred_on, created_by) VALUES (?,?,?,?,?,?)',
      [projectId || null, String(category), Number(amount), description || null, String(incurredOn), userId]
    );

    return NextResponse.json({ id: (result as any).insertId });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
