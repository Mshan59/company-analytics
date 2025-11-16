import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const from = searchParams.get('from'); // YYYY-MM-DD
    const to = searchParams.get('to');     // YYYY-MM-DD

    // Expenses filter
    const ew: string[] = [];
    const ep: any[] = [];
    if (projectId) { ew.push('e.project_id = ?'); ep.push(Number(projectId)); }
    if (from && to) { ew.push('e.incurred_on BETWEEN ? AND ?'); ep.push(from, to); }
    else if (from) { ew.push('e.incurred_on >= ?'); ep.push(from); }
    else if (to) { ew.push('e.incurred_on <= ?'); ep.push(to); }
    const eWhere = ew.length ? ('WHERE ' + ew.join(' AND ')) : '';

    // Tasks filter (use created_at for range)
    const tw: string[] = [];
    const tp: any[] = [];
    if (projectId) { tw.push('t.project_id = ?'); tp.push(Number(projectId)); }
    if (from && to) { tw.push('t.created_at BETWEEN ? AND ?'); tp.push(from, to); }
    else if (from) { tw.push('t.created_at >= ?'); tp.push(from); }
    else if (to) { tw.push('t.created_at <= ?'); tp.push(to); }
    const tWhere = tw.length ? ('WHERE ' + tw.join(' AND ')) : '';

    const [[projRows]]: any = await Promise.all([ pool.query('SELECT COUNT(*) AS totalProjects FROM projects') ]);

    const [[spentRows]]: any = await Promise.all([ pool.query(`SELECT COALESCE(SUM(amount),0) AS spent FROM expenses e ${eWhere}`, ep) ]);

    const [[budgetRows]]: any = await Promise.all([ pool.query('SELECT COALESCE(MAX(total_amount),0) AS totalBudget FROM budgets') ]);

    // Tasks KPIs
    const [[taskTotals]]: any = await Promise.all([ pool.query(`SELECT COUNT(*) AS totalTasks FROM tasks t ${tWhere}`, tp) ]);
    const [[taskCompleted]]: any = await Promise.all([ pool.query(`SELECT COUNT(*) AS completedTasks FROM tasks t ${tWhere} ${tWhere ? ' AND' : 'WHERE'} t.status = 'completed'`) ]);
    const [[taskOverdue]]: any = await Promise.all([ pool.query(`SELECT COUNT(*) AS overdueTasks FROM tasks t ${tWhere} ${tWhere ? ' AND' : 'WHERE'} t.status <> 'completed' AND t.due_date IS NOT NULL AND t.due_date < CURDATE()`) ]);

    const totalProjects = Number(projRows[0]?.totalProjects || 0);
    const totalBudget = Number(budgetRows[0]?.totalBudget || 0);
    const spent = Number(spentRows[0]?.spent || 0);
    const remaining = totalBudget - spent;
    const totalTasks = Number(taskTotals[0]?.totalTasks || 0);
    const completedTasks = Number(taskCompleted[0]?.completedTasks || 0);
    const overdueTasks = Number(taskOverdue[0]?.overdueTasks || 0);

    return NextResponse.json({
      kpis: {
        totalProjects,
        totalBudget,
        spent,
        remaining,
        totalTasks,
        completedTasks,
        overdueTasks,
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 });
  }
}
