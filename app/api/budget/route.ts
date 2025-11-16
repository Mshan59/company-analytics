import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { canManageBudget, canViewBudget } from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canViewBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [[budgetRows], [spendRows]]: any = await Promise.all([
      pool.query('SELECT id, total_amount, currency, fiscal_year, created_at FROM budgets ORDER BY id ASC LIMIT 1'),
      pool.query('SELECT COALESCE(SUM(amount),0) AS spent FROM expenses'),
    ]);

    const budget = budgetRows[0] || null;
    const spent = Number(spendRows[0]?.spent || 0);
    const total = Number(budget?.total_amount || 0);
    const remaining = total - spent;

    return NextResponse.json({
      budget,
      totals: {
        total,
        spent,
        remaining,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load budget' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const role = (payload as any)?.role || 'member';
    if (!canManageBudget(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { total_amount, currency, fiscal_year } = await req.json();
    const [[existing]]: any = await pool.query('SELECT id FROM budgets ORDER BY id ASC LIMIT 1');

    if (existing?.id) {
      await pool.query(
        'UPDATE budgets SET total_amount = ?, currency = ?, fiscal_year = ? WHERE id = ?',
        [Number(total_amount || 0), currency || 'INR', fiscal_year || null, existing.id]
      );
    } else {
      await pool.query(
        'INSERT INTO budgets (total_amount, currency, fiscal_year) VALUES (?,?,?)',
        [Number(total_amount || 0), currency || 'INR', fiscal_year || null]
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save budget' }, { status: 500 });
  }
}
