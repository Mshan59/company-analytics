import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Update an expense
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await req.json();
    const { projectId, category, amount, description, incurredOn } = body as {
      projectId?: number | null;
      category?: string;
      amount?: number;
      description?: string | null;
      incurredOn?: string; // YYYY-MM-DD
    };

    const sets: string[] = [];
    const vals: any[] = [];

    if (projectId !== undefined) { sets.push('project_id = ?'); vals.push(projectId); }
    if (category !== undefined) { sets.push('category = ?'); vals.push(String(category)); }
    if (amount !== undefined) { sets.push('amount = ?'); vals.push(Number(amount)); }
    if (description !== undefined) { sets.push('description = ?'); vals.push(description); }
    if (incurredOn !== undefined) { sets.push('incurred_on = ?'); vals.push(incurredOn); }

    if (sets.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    vals.push(id);
    const [result]: any = await pool.query(`UPDATE expenses SET ${sets.join(', ')} WHERE id = ?`, vals);

    if (result.affectedRows === 0) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    const [rows]: any = await pool.query(
      `SELECT e.id, e.project_id AS projectId, e.category, e.amount, e.description, e.incurred_on AS incurredOn,
              e.created_by AS createdBy, e.created_at AS createdAt,
              p.name AS projectName, u.name AS createdByName
         FROM expenses e
         LEFT JOIN projects p ON p.id = e.project_id
         LEFT JOIN users u ON u.id = e.created_by
         WHERE e.id = ?`,
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// Delete an expense
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const [result]: any = await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
