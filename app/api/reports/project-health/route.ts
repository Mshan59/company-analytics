import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Health rules (simple):
// - RED if spent > allocated (when allocated > 0), or overdueTasks > 3, or allocated = 0 and spent > 0
// - YELLOW if utilization between 0.8 and 1.0 inclusive, or overdueTasks between 1 and 3
// - GREEN otherwise
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

    // Spend per project in range
    const [spendRows]: any = await pool.query(
      `SELECT e.project_id AS projectId, COALESCE(SUM(e.amount), 0) AS spent
         FROM expenses e
         ${eWhere}
         GROUP BY e.project_id`
    , params);
    const spentByProject: Record<number, number> = {};
    for (const r of spendRows) spentByProject[Number(r.projectId)] = Number(r.spent);

    // All projects with allocation
    const [projects]: any = await pool.query(
      `SELECT p.id AS projectId, p.name,
              COALESCE(pb.allocated_amount, 0) AS allocated
         FROM projects p
         LEFT JOIN project_budgets pb ON pb.project_id = p.id
         ORDER BY p.name ASC`
    );

    // Overdue tasks per project (non-completed and due_date < today)
    const [overdueRows]: any = await pool.query(
      `SELECT t.project_id AS projectId, COUNT(*) AS overdue
         FROM tasks t
         WHERE t.status <> 'completed' AND t.due_date IS NOT NULL AND t.due_date < CURDATE()
         GROUP BY t.project_id`
    );
    const overdueByProject: Record<number, number> = {};
    for (const r of overdueRows) overdueByProject[Number(r.projectId)] = Number(r.overdue);

    const result = projects.map((p: any) => {
      const allocated = Number(p.allocated || 0);
      const spent = Number(spentByProject[p.projectId] || 0);
      const overdueTasks = Number(overdueByProject[p.projectId] || 0);
      const utilization = allocated > 0 ? spent / allocated : (spent > 0 ? 999 : 0);
      let health: 'green' | 'yellow' | 'red';
      if ((allocated > 0 && spent > allocated) || overdueTasks > 3 || (allocated === 0 && spent > 0)) health = 'red';
      else if ((utilization >= 0.8 && utilization <= 1) || (overdueTasks >= 1 && overdueTasks <= 3)) health = 'yellow';
      else health = 'green';
      return {
        projectId: Number(p.projectId),
        name: p.name,
        allocated,
        spent,
        overdueTasks,
        utilization: allocated > 0 ? Number((utilization * 100).toFixed(1)) : (spent > 0 ? 100 : 0),
        health,
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load project health' }, { status: 500 });
  }
}
