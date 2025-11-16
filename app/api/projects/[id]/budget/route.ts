import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { canManageBudget, canViewBudget } from '@/lib/permissions';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canViewBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const projectId = Number(params.id);
    if (!projectId) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

    const [[allocRows], [spendRows]]: any = await Promise.all([
      pool.query('SELECT id, project_id, allocated_amount, notes FROM project_budgets WHERE project_id = ? LIMIT 1', [projectId]),
      pool.query('SELECT COALESCE(SUM(amount),0) AS spent FROM expenses WHERE project_id = ?', [projectId])
    ]);

    const allocation = allocRows[0] || null;
    const spent = Number(spendRows[0]?.spent || 0);
    const allocated = Number(allocation?.allocated_amount || 0);
    const remaining = allocated - spent;

    return NextResponse.json({
      projectId,
      allocation,
      totals: {
        allocated,
        spent,
        remaining,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load project budget' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canManageBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const projectId = Number(params.id);
    if (!projectId) return NextResponse.json({ error: 'Invalid project id' }, { status: 400 });

    const { allocated_amount, notes } = await req.json();

    const [[existing]]: any = await pool.query('SELECT id FROM project_budgets WHERE project_id = ? LIMIT 1', [projectId]);
    if (existing?.id) {
      await pool.query('UPDATE project_budgets SET allocated_amount = ?, notes = ? WHERE id = ?', [Number(allocated_amount || 0), notes || null, existing.id]);
    } else {
      await pool.query('INSERT INTO project_budgets (project_id, allocated_amount, notes) VALUES (?,?,?)', [projectId, Number(allocated_amount || 0), notes || null]);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save project budget' }, { status: 500 });
  }
}
